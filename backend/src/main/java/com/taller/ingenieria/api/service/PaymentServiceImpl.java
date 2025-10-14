package com.taller.ingenieria.api.service;

import com.stripe.Stripe;
import com.stripe.exception.EventDataObjectDeserializationException;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import com.taller.ingenieria.api.dto.response.CarritoResponseDTO;
import com.taller.ingenieria.api.dto.response.PaymentIntentResponseDTO;
import com.taller.ingenieria.api.exception.BusinessValidationException;
import com.taller.ingenieria.api.exception.ResourceNotFoundException;
import com.taller.ingenieria.api.model.Carrito;
import com.taller.ingenieria.api.model.Direccion;
import com.taller.ingenieria.api.model.Usuario;
import com.taller.ingenieria.api.repository.CarritoRepository;
import com.taller.ingenieria.api.repository.DireccionRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.stripe.model.Event;

import java.math.BigDecimal;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Value("${stripe.api.secretKey}")
    private String secretKey;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;


    @Autowired
    private CarritoService carritoService;

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    DireccionRepository direccionRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    @Override
    public PaymentIntentResponseDTO createPaymentIntent(String cartId, Integer idDireccion) throws StripeException {
        CarritoResponseDTO carritoDTO = carritoService.obtenerCarrito(cartId);

        Carrito carrito = carritoRepository.findById(carritoDTO.getId()).orElseThrow();
        Usuario usuario = carrito.getIdUsuario();

        validarDireccion(idDireccion, usuario);

        if (usuario == null) {
            throw new BusinessValidationException("Los usuarios anónimos no pueden realizar pagos. Por favor, inicia sesión.");
        }

        if (usuario.getTelefono() == null || usuario.getTelefono().trim().isEmpty()) {
            throw new BusinessValidationException("Es necesario que agregues un número de teléfono a tu perfil antes de poder realizar un pedido.");
        }

        BigDecimal total = carritoDTO.getTotal();

        if (total == null || total.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessValidationException("No se puede procesar el pago. El carrito está vacío o el total es cero.");
        }

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(total.longValue())
                .setCurrency("pyg")
                .putMetadata("carritoId", carritoDTO.getId().toString())
                .putMetadata("direccionId", idDireccion.toString())
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .setAllowRedirects(PaymentIntentCreateParams.AutomaticPaymentMethods.AllowRedirects.NEVER)
                                .build()
                )
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);
        return new PaymentIntentResponseDTO(paymentIntent.getClientSecret());
    }

    private void validarDireccion(Integer idDireccion, Usuario usuario) {
        Direccion direccion = direccionRepository.findById(idDireccion)
                .orElseThrow(() -> new ResourceNotFoundException("La dirección de envío seleccionada con ID " + idDireccion + " no existe."));

        if (!direccion.getIdUsuario().getId().equals(usuario.getId())) {
            throw new SecurityException("La dirección de envío seleccionada no pertenece al usuario actual.");
        }
    }

    @Override
    public void handleStripeEvent(String payload, String sigHeader) throws SignatureVerificationException {
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            System.err.println("❌ Error de verificación de firma de webhook de Stripe.");
            throw e;
        }

        // Directamente vamos al switch para actuar según el tipo de evento
        switch (event.getType()) {
            case "payment_intent.succeeded":
                PaymentIntent paymentIntent = null;
                try {
                    // Intentamos convertir el objeto de datos a un PaymentIntent.
                    // Esto es más seguro hacerlo aquí dentro.
                    paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().deserializeUnsafe();
                } catch (ClassCastException e) {
                    System.err.println("❌ Error de casting al procesar payment_intent.succeeded. " + e.getMessage());
                } catch (EventDataObjectDeserializationException e) {
                    throw new RuntimeException(e);
                }

                if (paymentIntent != null) {
                    System.out.println("✅ LOG: Pago exitoso para PaymentIntent: " + paymentIntent.getId());

                    String carritoIdStr = paymentIntent.getMetadata().get("carritoId");
                    String direccionIdStr = paymentIntent.getMetadata().get("direccionId");

                    if (carritoIdStr == null || direccionIdStr == null) {
                        System.err.println("❌ ¡ERROR CRÍTICO! Faltan metadatos en el PaymentIntent: " + paymentIntent.getId());
                        break; // Salimos del case
                    }

                    try {
                        System.out.println("⏳ LOG: Pago completado para el carrito ID: " + carritoIdStr + ". Creando pedido...");

                        pedidoService.crearPedidoPostPago(
                                Integer.parseInt(carritoIdStr),
                                Integer.parseInt(direccionIdStr)
                        );

                        System.out.println("✅ LOG: Pedido creado exitosamente para el carrito ID: " + carritoIdStr);
                    } catch (Exception e) {
                        System.err.println("❌ ¡ERROR CRÍTICO! El pago " + paymentIntent.getId() + " fue exitoso pero falló la creación del pedido. Causa: " + e.getMessage());
                    }
                } else {
                    System.err.println("❌ ERROR: El objeto PaymentIntent era nulo para el evento payment_intent.succeeded.");
                }
                break;
            default:
                System.out.println("⚪️ LOG: Evento de webhook no manejado: " + event.getType());
        }
    }

}