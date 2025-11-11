package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UpdateStockRequestDTO;
import com.taller.ingenieria.api.dto.response.InventarioResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Administración de Inventario", description = "Endpoints para gestionar el inventario y stock de productos. Requiere rol de INVENTORY_MANAGER o SUPER_ADMIN.")
public interface InventarioAdminController {

    @Operation(
            summary = "Actualizar el stock de un producto",
            description = "Actualiza la cantidad disponible en inventario de un producto específico. " +
                    "Permite incrementar o decrementar el stock según sea necesario. " +
                    "Requiere rol de INVENTORY_MANAGER o SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Stock actualizado exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = InventarioResponseDTO.class)) }
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Cantidad inválida. El stock no puede ser negativo.",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Acceso denegado. Se requiere rol de administrador.",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Producto no encontrado.",
                    content = @Content
            )
    })
    ResponseEntity<InventarioResponseDTO> actualizarStock(
            @Parameter(description = "ID del producto cuyo stock se desea actualizar", required = true, example = "1")
            @PathVariable Integer idProducto,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Nueva cantidad de stock",
                    required = true,
                    content = @Content(schema = @Schema(implementation = UpdateStockRequestDTO.class))
            )
            @RequestBody UpdateStockRequestDTO updateStockDTO);
}