package com.taller.ingenieria.api.controller;

import com.stripe.exception.StripeException;
import com.taller.ingenieria.api.dto.request.CreatePaymentIntentRequestDTO;
import com.taller.ingenieria.api.dto.response.PaymentIntentResponseDTO;
import com.taller.ingenieria.api.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentControllerImpl implements PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Override
    @PostMapping("/create-intent")
    public ResponseEntity<PaymentIntentResponseDTO> createPaymentIntent(
            @RequestHeader(name = "X-Cart-ID", required = false) String cartId,
            @RequestBody CreatePaymentIntentRequestDTO requestDTO) throws StripeException {

        PaymentIntentResponseDTO response = paymentService.createPaymentIntent(cartId, requestDTO.getIdDireccion());
        return ResponseEntity.ok(response);
    }
}