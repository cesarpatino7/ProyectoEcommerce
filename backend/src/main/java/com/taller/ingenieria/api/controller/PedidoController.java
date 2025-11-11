package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.CheckoutRequestDTO;
import com.taller.ingenieria.api.dto.response.PedidoHistorialDTO;
import com.taller.ingenieria.api.dto.response.PedidoResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Tag(name = "Pedidos de Cliente", description = "Endpoints para que los clientes gestionen sus pedidos.")
public interface PedidoController {

    @Operation(
            summary = "Crear un nuevo pedido (Checkout)",
            description = "Procesa el checkout y crea un nuevo pedido a partir del carrito del usuario autenticado. " +
                    "El pedido incluirá todos los productos del carrito, calculará el total y asignará " +
                    "la dirección de envío seleccionada. Requiere autenticación."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Pedido creado exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PedidoResponseDTO.class)) }
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Solicitud inválida. El carrito puede estar vacío o contener productos sin stock.",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Acceso denegado. Se requiere autenticación.",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Dirección de envío no encontrada.",
                    content = @Content
            )
    })
    ResponseEntity<PedidoResponseDTO> crearPedido(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos del checkout incluyendo la dirección de envío",
                    required = true,
                    content = @Content(schema = @Schema(implementation = CheckoutRequestDTO.class))
            )
            @RequestBody CheckoutRequestDTO checkoutDTO);

    @Operation(
            summary = "Obtener el historial de pedidos del cliente",
            description = "Retorna una lista con todos los pedidos realizados por el cliente autenticado, " +
                    "incluyendo el estado actual, fecha de creación y total de cada pedido."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Historial de pedidos obtenido exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = PedidoHistorialDTO.class))) }
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Acceso denegado. Se requiere autenticación.",
                    content = @Content
            )
    })
    ResponseEntity<List<PedidoHistorialDTO>> obtenerMisPedidos();
}