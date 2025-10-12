package com.taller.ingenieria.api.dto.request;

import lombok.Data;

@Data
public class CheckoutRequestDTO {

    /**
     * El ID de la dirección de envío que el usuario ha seleccionado
     * de su lista de direcciones guardadas.
     */
    private Integer idDireccion;

    // A futuro, aquí podríamos añadir información sobre el método de pago,
    // un ID de transacción de Stripe, etc. Por ahora, solo la dirección es suficiente.
}