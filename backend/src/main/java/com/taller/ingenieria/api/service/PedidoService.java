package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.CheckoutRequestDTO;
import com.taller.ingenieria.api.dto.response.PedidoResponseDTO;

public interface PedidoService {

    /**
     * Lógica principal del checkout. Crea un pedido a partir del carrito del usuario,
     * transfiere los items, calcula el total y limpia el carrito.
     *
     * @param checkoutDTO DTO con la información necesaria para el checkout.
     * @return Un DTO con el resumen del pedido creado.
     */
    PedidoResponseDTO crearPedido(CheckoutRequestDTO checkoutDTO);
}