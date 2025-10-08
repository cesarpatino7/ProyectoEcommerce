package com.taller.ingenieria.api.dto.request;

import lombok.Data;

@Data
public class DireccionRequestDTO {
    private String descripcionCalle;
    private Integer idCiudad;
}