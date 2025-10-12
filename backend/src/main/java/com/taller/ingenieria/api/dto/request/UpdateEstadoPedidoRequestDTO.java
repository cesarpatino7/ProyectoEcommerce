package com.taller.ingenieria.api.dto.request;

import lombok.Data;

@Data
public class UpdateEstadoPedidoRequestDTO {

    /**
     * El nuevo ID del estado que se le asignará al pedido.
     * (ej. 3 para "Enviado", 4 para "Entregado").
     */
    private Integer idEstado;
}