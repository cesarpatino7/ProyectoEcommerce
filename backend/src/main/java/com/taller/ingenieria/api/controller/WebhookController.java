package com.taller.ingenieria.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

public interface WebhookController {

    /**
     * Endpoint para recibir y procesar los eventos de webhook de Stripe.
     * @param payload El cuerpo completo de la petición enviado por Stripe.
     * @param sigHeader El valor de la cabecera 'Stripe-Signature' para verificación.
     * @return Una respuesta al servidor de Stripe.
     */
    ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader);
}