package com.taller.ingenieria.api.dto.response;

import lombok.Data;

@Data
public class PaymentIntentResponseDTO {

    /**
     * El "secreto del cliente" generado por Stripe.
     * El frontend usa para inicializar el formulario de pago.
     */
    private String clientSecret;

    public PaymentIntentResponseDTO(String clientSecret) {
        this.clientSecret = clientSecret;
    }
}