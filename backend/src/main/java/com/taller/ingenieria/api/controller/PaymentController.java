package com.taller.ingenieria.api.controller;

import com.stripe.exception.StripeException;
import com.taller.ingenieria.api.dto.request.CreatePaymentIntentRequestDTO;
import com.taller.ingenieria.api.dto.response.PaymentIntentResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@Tag(name = "Pagos", description = "Endpoints para gestionar los pagos mediante Stripe.")
public interface PaymentController {

    @Operation(
            summary = "Crear una intención de pago",
            description = "Crea una Payment Intent en Stripe para procesar el pago del carrito. " +
                    "Retorna el 'client_secret' necesario para completar el pago en el frontend " +
                    "usando Stripe Elements. El monto se calcula automáticamente a partir del carrito del usuario."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Payment Intent creado exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PaymentIntentResponseDTO.class)) }
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Error al procesar la solicitud. El carrito puede estar vacío o contener datos inválidos.",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Error interno del servidor o error de comunicación con Stripe.",
                    content = @Content
            )
    })
    ResponseEntity<PaymentIntentResponseDTO> createPaymentIntent(
            @Parameter(description = "ID del carrito (opcional para usuarios anónimos).")
            @RequestHeader(name = "X-Cart-ID", required = false) String cartId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos para crear la intención de pago",
                    required = true,
                    content = @Content(schema = @Schema(implementation = CreatePaymentIntentRequestDTO.class))
            )
            @RequestBody CreatePaymentIntentRequestDTO requestDTO) throws StripeException;
}