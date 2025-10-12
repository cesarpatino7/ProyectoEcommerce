package com.taller.ingenieria.api.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
public class PedidoHistorialDTO {

    /**
     * El ID único del pedido (ej. #1024).
     */
    private Integer id;

    /**
     * La fecha en que se realizó el pedido.
     */
    private Instant fechaPedido;

    /**
     * El estado actual del pedido (ej. "Pendiente", "Enviado").
     */
    private String estado;

    /**
     * El monto total de la compra.
     */
    private BigDecimal total;

    private List<ItemHistorialDTO> items;

    @Data
    public static class ItemHistorialDTO {
        private String nombreProducto;
        private int cantidad;
    }
}