package com.taller.ingenieria.api.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ItemCarritoResponseDTO {
    private Integer id;
    private Integer idProducto;
    private String nombreProducto;
    private int cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}