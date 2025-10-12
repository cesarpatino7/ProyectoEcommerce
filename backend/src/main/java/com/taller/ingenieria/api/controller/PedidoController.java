package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.CheckoutRequestDTO;
import com.taller.ingenieria.api.dto.response.PedidoHistorialDTO;
import com.taller.ingenieria.api.dto.response.PedidoResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface PedidoController {

    /**
     * Procesa el checkout y crea un nuevo pedido a partir del carrito del usuario.
     * @param checkoutDTO DTO que contiene el ID de la dirección de envío seleccionada.
     * @return Un DTO con el resumen del pedido recién creado.
     */
    ResponseEntity<PedidoResponseDTO> crearPedido(@RequestBody CheckoutRequestDTO checkoutDTO);

    /**
     * Endpoint para que un cliente vea su historial de pedidos.
     * @return Una lista con el resumen de todos sus pedidos.
     */
    ResponseEntity<List<PedidoHistorialDTO>> obtenerMisPedidos();
}