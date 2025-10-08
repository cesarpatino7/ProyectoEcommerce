package com.taller.ingenieria.api.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductoCatalogoDTO {
    private Integer id;
    private String nombre;
    private BigDecimal precio;
    private BigDecimal calificacionPromedio;
    private String imagen;
}