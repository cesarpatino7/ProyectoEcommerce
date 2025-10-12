package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.service.PaymentService; // Lo usaremos para la lógica
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/webhooks")
public class WebhookControllerImpl implements WebhookController {

    @Autowired
    private PaymentService paymentService;

    @Override
    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        try {
            // Delegamos todo el procesamiento y la verificación al servicio
            paymentService.handleStripeEvent(payload, sigHeader);
            return ResponseEntity.ok("Webhook received");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}