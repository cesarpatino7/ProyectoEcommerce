package com.taller.ingenieria.api.dto.response;

import lombok.Data;

@Data
public class DireccionResponseDTO {
    private Integer id;
    private String descripcionCalle;
    private String nombreCiudad;
    private String nombreDepartamento;
}