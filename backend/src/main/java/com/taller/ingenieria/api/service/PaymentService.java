package com.taller.ingenieria.api.service;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.taller.ingenieria.api.dto.response.PaymentIntentResponseDTO;

public interface PaymentService {

    /**
     * Crea una Intención de Pago (Payment Intent) en Stripe.
     * Calcula el total del carrito del usuario y le pide a Stripe que prepare
     * una transacción por ese monto.
     *
     * @param cartId El ID del carrito para usuarios anónimos (opcional).
     * @return Un DTO que contiene el 'client_secret' necesario para el frontend.
     * @throws StripeException Si hay un error al comunicarse con la API de Stripe.
     */
    PaymentIntentResponseDTO createPaymentIntent(String cartId, Integer idDireccion) throws StripeException;


    /**
     * Procesa y verifica un evento de webhook entrante de Stripe.
     * Si el evento es un pago exitoso, procede a crear el pedido en el sistema.
     *
     * @param payload El cuerpo de la petición (el JSON del evento) enviado por Stripe.
     * @param sigHeader El valor de la cabecera 'Stripe-Signature' para la verificación.
     * @throws SignatureVerificationException si la firma del webhook es inválida.
     */
    void handleStripeEvent(String payload, String sigHeader) throws SignatureVerificationException;
}