package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.AddItemRequestDTO;
import com.taller.ingenieria.api.dto.request.UpdateItemRequestDTO;
import com.taller.ingenieria.api.dto.response.CarritoResponseDTO;
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
import org.springframework.web.bind.annotation.RequestHeader;

@Tag(name = "Carrito de Compras", description = "Endpoints para gestionar el carrito de compras del usuario.")
public interface CarritoController {

    @Operation(
            summary = "Obtener el carrito de compras",
            description = "Obtiene el carrito de compras actual del usuario. Si no existe un carrito asociado al ID proporcionado, " +
                    "se crea uno nuevo. El carrito puede ser identificado mediante el header 'X-Cart-ID'."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Carrito obtenido exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CarritoResponseDTO.class)) }
            )
    })
    ResponseEntity<CarritoResponseDTO> obtenerCarrito(
            @Parameter(description = "ID del carrito (opcional). Si no se proporciona, se crea un nuevo carrito.")
            @RequestHeader(name = "X-Cart-ID", required = false) String cartId);

    @Operation(
            summary = "Agregar un producto al carrito",
            description = "Agrega un nuevo producto al carrito de compras. Si el producto ya existe en el carrito, " +
                    "se incrementa su cantidad."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Producto agregado al carrito exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CarritoResponseDTO.class)) }
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Solicitud inválida. Puede deberse a datos incorrectos o stock insuficiente.",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Producto no encontrado.",
                    content = @Content
            )
    })
    ResponseEntity<CarritoResponseDTO> agregarItemAlCarrito(
            @Parameter(description = "ID del carrito (opcional).")
            @RequestHeader(name = "X-Cart-ID", required = false) String cartId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos del producto a agregar al carrito",
                    required = true,
                    content = @Content(schema = @Schema(implementation = AddItemRequestDTO.class))
            )
            @RequestBody AddItemRequestDTO addItemDTO);

    @Operation(
            summary = "Actualizar la cantidad de un producto en el carrito",
            description = "Actualiza la cantidad de un producto específico que ya está en el carrito."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Cantidad actualizada exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CarritoResponseDTO.class)) }
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Cantidad inválida o stock insuficiente.",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Carrito o producto no encontrado.",
                    content = @Content
            )
    })
    ResponseEntity<CarritoResponseDTO> actualizarItemDelCarrito(
            @Parameter(description = "ID del carrito.")
            @RequestHeader(name = "X-Cart-ID", required = false) String cartId,
            @Parameter(description = "ID del item en el carrito a actualizar", required = true)
            @PathVariable Integer itemId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Nueva cantidad del producto",
                    required = true,
                    content = @Content(schema = @Schema(implementation = UpdateItemRequestDTO.class))
            )
            @RequestBody UpdateItemRequestDTO updateItemDTO);

    @Operation(
            summary = "Eliminar un producto del carrito",
            description = "Elimina completamente un producto específico del carrito de compras."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "Producto eliminado del carrito exitosamente.",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Carrito o producto no encontrado.",
                    content = @Content
            )
    })
    ResponseEntity<Void> eliminarItemDelCarrito(
            @Parameter(description = "ID del carrito.")
            @RequestHeader(name = "X-Cart-ID", required = false) String cartId,
            @Parameter(description = "ID del item en el carrito a eliminar", required = true)
            @PathVariable Integer itemId);
}