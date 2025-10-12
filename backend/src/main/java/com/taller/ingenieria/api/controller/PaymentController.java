package com.taller.ingenieria.api.controller;

import com.stripe.exception.StripeException;
import com.taller.ingenieria.api.dto.request.CreatePaymentIntentRequestDTO;
import com.taller.ingenieria.api.dto.response.PaymentIntentResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

public interface PaymentController {

    /**
     * Endpoint para crear una Intención de Pago (Payment Intent).
     * @param cartId El ID del carrito para usuarios anónimos (opcional).
     * @return ResponseEntity con el 'client_secret' de Stripe.
     */
    ResponseEntity<PaymentIntentResponseDTO> createPaymentIntent(
            @RequestHeader(name = "X-Cart-ID", required = false) String cartId,
            @RequestBody CreatePaymentIntentRequestDTO requestDTO) throws StripeException;
}