package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.CheckoutRequestDTO;
import com.taller.ingenieria.api.dto.request.UpdateEstadoPedidoRequestDTO;
import com.taller.ingenieria.api.dto.response.PedidoAdminDTO;
import com.taller.ingenieria.api.dto.response.PedidoHistorialDTO;
import com.taller.ingenieria.api.dto.response.PedidoResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PedidoService {

    /**
     * Crea un pedido después de una confirmación de pago exitosa (ej. desde Stripe).
     * Esta es la lógica central de creación de pedidos, desacoplada del contexto de seguridad.
     *
     * @param carritoId El ID del carrito que se convertirá en pedido.
     * @param direccionId El ID de la dirección de envío para el pedido.
     */
    void crearPedidoPostPago(Integer carritoId, Integer direccionId);

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

    /**
     * Obtiene una lista paginada de todos los pedidos en el sistema para la vista de administración.
     * @param pageable Objeto que contiene la información de paginación y ordenamiento.
     * @return Una página de DTOs con el resumen de cada pedido.
     */
    Page<PedidoAdminDTO> obtenerTodosLosPedidos(Pageable pageable);

    /**
     * Actualiza el estado de un pedido específico.
     * @param idPedido El ID del pedido a actualizar.
     * @param updateDTO DTO que contiene el nuevo ID del estado.
     * @return Un DTO con el resumen del pedido actualizado.
     */
    PedidoAdminDTO actualizarEstadoPedido(Integer idPedido, UpdateEstadoPedidoRequestDTO updateDTO);
}