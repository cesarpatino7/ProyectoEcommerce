package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.ProductoRequestDTO;
import com.taller.ingenieria.api.dto.response.ProductoResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Tag(name = "Administración de Productos", description = "Endpoints para el CRUD completo de productos. Requiere rol de PRODUCT_MANAGER o SUPER_ADMIN.")
public interface ProductoAdminController {

    @Operation(
            summary = "Crear un nuevo producto",
            description = "Crea un nuevo producto en el catálogo, incluyendo la asignación a categorías y el registro de imágenes. Requiere rol de PRODUCT_MANAGER o SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Producto creado exitosamente.", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = ProductoResponseDTO.class)) }),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos (ej. una categoría no existe).", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado.", content = @Content)
    })
    ResponseEntity<ProductoResponseDTO> crearProducto(@RequestBody ProductoRequestDTO productoDTO);

    @Operation(
            summary = "Obtener todos los productos (vista de admin)",
            description = "Devuelve una lista completa de todos los productos del sistema con su información detallada. Requiere rol de PRODUCT_MANAGER o SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de productos obtenida exitosamente.", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = ProductoResponseDTO.class))) }),
            @ApiResponse(responseCode = "403", description = "Acceso denegado.", content = @Content)
    })
    ResponseEntity<List<ProductoResponseDTO>> obtenerTodosLosProductos();

    @Operation(
            summary = "Obtener un producto por ID (vista de admin)",
            description = "Devuelve la información administrativa completa de un producto específico. Requiere rol de PRODUCT_MANAGER o SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Producto encontrado.", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = ProductoResponseDTO.class)) }),
            @ApiResponse(responseCode = "403", description = "Acceso denegado.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado.", content = @Content)
    })
    ResponseEntity<ProductoResponseDTO> obtenerProductoPorId(
            @Parameter(description = "ID del producto a buscar.", required = true, example = "1")
            @PathVariable Integer id);

    @Operation(
            summary = "Actualizar un producto existente",
            description = "Actualiza todos los datos de un producto, incluyendo nombre, precio, categorías e imágenes. Requiere rol de PRODUCT_MANAGER o SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Producto actualizado exitosamente.", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = ProductoResponseDTO.class)) }),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos.", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado.", content = @Content)
    })
    ResponseEntity<ProductoResponseDTO> actualizarProducto(
            @Parameter(description = "ID del producto a actualizar.", required = true, example = "1")
            @PathVariable Integer id,
            @RequestBody ProductoRequestDTO productoDTO);

    @Operation(
            summary = "Eliminar un producto",
            description = "Elimina un producto del sistema. Esto también eliminará en cascada su inventario, imágenes y relaciones de categorías. Requiere rol de PRODUCT_MANAGER o SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Producto eliminado exitosamente.", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado.", content = @Content)
    })
    ResponseEntity<Void> eliminarProducto(
            @Parameter(description = "ID del producto a eliminar.", required = true, example = "1")
            @PathVariable Integer id);
}