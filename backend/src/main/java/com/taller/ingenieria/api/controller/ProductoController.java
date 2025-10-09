package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.response.ProductoCatalogoDTO;
import com.taller.ingenieria.api.dto.response.ProductoDetalleDTO;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Catálogo de Productos (Cliente)", description = "Endpoints públicos para la visualización de productos por parte de los clientes.")
public interface ProductoController {

    @Operation(
            summary = "Obtener el catálogo de productos paginado",
            description = "Devuelve una lista paginada de productos para la vista del catálogo. " +
                    "Soporta filtros por término de búsqueda (nombre) y por categoría. " +
                    "Los parámetros de paginación (`page`, `size`) y ordenamiento (`sort`) son opcionales y siguen el estándar de Spring Data."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Página de productos obtenida exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class)) }
            )
    })
    ResponseEntity<Page<ProductoCatalogoDTO>> obtenerCatalogo(
            @ParameterObject Pageable pageable,

            @Parameter(description = "Término de búsqueda para filtrar productos por nombre (no distingue mayúsculas/minúsculas).",
                    example = "Océano")
            @RequestParam(required = false) String busqueda,

            @Parameter(description = "Nombre exacto de una categoría para filtrar los productos.",
                    example = "Cítricos")
            @RequestParam(required = false) String categoria);

    @Operation(
            summary = "Obtener el detalle de un producto por ID",
            description = "Devuelve la información completa y detallada de un producto específico para su vista individual. Este endpoint es público."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Producto encontrado.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductoDetalleDTO.class)) }
            ),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado.", content = @Content)
    })
    ResponseEntity<ProductoDetalleDTO> obtenerProductoDetalle(
            @Parameter(description = "ID del producto a buscar.", required = true, example = "1")
            @PathVariable Integer id);
}