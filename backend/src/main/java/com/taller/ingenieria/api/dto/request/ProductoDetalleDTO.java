package com.taller.ingenieria.api.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductoDetalleDTO {
    private Integer id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer stockActual;
    private String categorias;
    private String imagenes;
}