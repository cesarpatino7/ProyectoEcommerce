package com.taller.ingenieria.api.dto.request;

import lombok.Data;

@Data
public class CreatePaymentIntentRequestDTO {
    // El ID de la dirección de envío que el usuario seleccionó.
    private Integer idDireccion;
}