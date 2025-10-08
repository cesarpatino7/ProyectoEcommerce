package com.taller.ingenieria.api.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
public class ProductoResponseDTO {
    private Integer id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Boolean activo;
    private Instant createdAt;
    private List<String> categorias;
    private List<String> imagenes;
}