package com.taller.ingenieria.api.dto.response;

import lombok.Data;
import java.time.Instant;

@Data
public class CategoriaResponseDTO {
    private Integer id;
    private String nombre;
    private String descripcion;
    private Instant createdAt;
}