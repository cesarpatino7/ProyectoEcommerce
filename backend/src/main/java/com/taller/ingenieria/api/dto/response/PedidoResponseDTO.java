package com.taller.ingenieria.api.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
public class PedidoResponseDTO {

    private Integer id;
    private Instant fechaPedido;
    private String estado;
    private BigDecimal total;
    private DireccionResponseDTO direccionEnvio;
    private List<ItemPedidoResponseDTO> items;

    @Data
    public static class ItemPedidoResponseDTO {
        private String nombreProducto;
        private int cantidad;
        private BigDecimal precioUnitario;
    }
}