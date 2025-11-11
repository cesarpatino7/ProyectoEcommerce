package com.taller.ingenieria.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@Tag(name = "Webhooks", description = "Endpoints para recibir notificaciones de eventos externos (Stripe).")
public interface WebhookController {

    @Operation(
            summary = "Procesar webhook de Stripe",
            description = "Endpoint para recibir y procesar eventos de webhook enviados por Stripe. " +
                    "Estos eventos notifican sobre cambios en el estado de pagos, como pagos exitosos, " +
                    "fallidos, reembolsos, etc. La firma del webhook es verificada para garantizar " +
                    "la autenticidad del evento."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Evento procesado exitosamente.",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Firma inválida o evento no reconocido.",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Error al procesar el evento.",
                    content = @Content
            )
    })
    ResponseEntity<String> handleStripeWebhook(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Payload JSON enviado por Stripe con los datos del evento",
                    required = true
            )
            @RequestBody String payload,
            @Parameter(description = "Firma de Stripe para verificar la autenticidad del webhook", required = true)
            @RequestHeader("Stripe-Signature") String sigHeader);
}