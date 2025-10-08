package com.taller.ingenieria.api.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
public class ProductoRequestDTO {
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Boolean activo;
    private Set<Integer> categoriaIds;
    private List<String> imagenes;
}