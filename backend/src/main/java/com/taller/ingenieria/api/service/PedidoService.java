package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.CheckoutRequestDTO;
import com.taller.ingenieria.api.dto.response.PedidoHistorialDTO;
import com.taller.ingenieria.api.dto.response.PedidoResponseDTO;

import java.util.List;

public interface PedidoService {

    /**
     * Lógica principal del checkout. Crea un pedido a partir del carrito del usuario,
     * transfiere los items, calcula el total y limpia el carrito.
     *
     * @param checkoutDTO DTO con la información necesaria para el checkout.
     * @return Un DTO con el resumen del pedido creado.
     */
    PedidoResponseDTO crearPedido(CheckoutRequestDTO checkoutDTO);

    /**
     * Obtiene el historial de pedidos del usuario autenticado.
     * @return Una lista de DTOs con el resumen de cada pedido.
     */
    List<PedidoHistorialDTO> obtenerMisPedidos();
}