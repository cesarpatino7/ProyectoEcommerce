package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UpdateEstadoPedidoRequestDTO;
import com.taller.ingenieria.api.dto.response.PedidoAdminDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

public interface PedidoAdminController {

    /**
     * Endpoint para que un administrador vea todos los pedidos del sistema, de forma paginada.
     * @param pageable Parámetros de paginación (page, size, sort).
     * @return Una página con la lista de pedidos.
     */
    ResponseEntity<Page<PedidoAdminDTO>> obtenerTodosLosPedidos(Pageable pageable);

    /**
     * Endpoint para que un administrador actualice el estado de un pedido.
     * @param idPedido El ID del pedido a modificar.
     * @param updateDTO El cuerpo de la petición con el nuevo idEstado.
     * @return Un resumen del pedido con su nuevo estado.
     */
    ResponseEntity<PedidoAdminDTO> actualizarEstadoPedido(
            @PathVariable Integer idPedido,
            @RequestBody UpdateEstadoPedidoRequestDTO updateDTO);
}