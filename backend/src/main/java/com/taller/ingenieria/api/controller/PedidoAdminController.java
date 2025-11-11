package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UpdateEstadoPedidoRequestDTO;
import com.taller.ingenieria.api.dto.response.PedidoAdminDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Administración de Pedidos", description = "Endpoints para que los administradores gestionen los pedidos del sistema.")
public interface PedidoAdminController {

    @Operation(
            summary = "Obtener todos los pedidos del sistema",
            description = "Devuelve una lista paginada de todos los pedidos realizados en el sistema. " +
                    "Permite a los administradores visualizar y gestionar los pedidos de todos los clientes. " +
                    "Requiere rol de ORDER_MANAGER o SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Página de pedidos obtenida exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class)) }
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Acceso denegado. Se requiere rol de administrador.",
                    content = @Content
            )
    })
    ResponseEntity<Page<PedidoAdminDTO>> obtenerTodosLosPedidos(
            @ParameterObject Pageable pageable);

    @Operation(
            summary = "Actualizar el estado de un pedido",
            description = "Permite a un administrador cambiar el estado de un pedido específico " +
                    "(por ejemplo, de 'PENDIENTE' a 'EN_PROCESO', 'ENVIADO', 'ENTREGADO', etc.). " +
                    "Requiere rol de ORDER_MANAGER o SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Estado del pedido actualizado exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PedidoAdminDTO.class)) }
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Estado inválido o datos incorrectos.",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Acceso denegado. Se requiere rol de administrador.",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Pedido no encontrado.",
                    content = @Content
            )
    })
    ResponseEntity<PedidoAdminDTO> actualizarEstadoPedido(
            @Parameter(description = "ID del pedido a actualizar", required = true, example = "1")
            @PathVariable Integer idPedido,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Nuevo estado del pedido",
                    required = true,
                    content = @Content(schema = @Schema(implementation = UpdateEstadoPedidoRequestDTO.class))
            )
            @RequestBody UpdateEstadoPedidoRequestDTO updateDTO);
}