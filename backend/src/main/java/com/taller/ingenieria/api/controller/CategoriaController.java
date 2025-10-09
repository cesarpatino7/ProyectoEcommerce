package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.CategoriaRequestDTO;
import com.taller.ingenieria.api.dto.response.CategoriaResponseDTO;
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

@Tag(name = "Categorías", description = "Endpoints para la gestión de categorías de productos.")
public interface CategoriaController {


    @Operation(
            summary = "Crear una nueva categoría",
            description = "Crea una nueva categoría en el sistema. Requiere permisos de administrador."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Categoría creada exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CategoriaResponseDTO.class)) }
            ),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos.", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado. Se requiere rol de PRODUCT_MANAGER o SUPER_ADMIN.", content = @Content)
    })
    ResponseEntity<CategoriaResponseDTO> crearCategoria(@RequestBody CategoriaRequestDTO categoriaDTO);


    @Operation(
            summary = "Obtener todas las categorías",
            description = "Devuelve una lista de todas las categorías disponibles en el sistema. Este endpoint es público."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de categorías obtenida exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = CategoriaResponseDTO.class))) }
            )
    })
    ResponseEntity<List<CategoriaResponseDTO>> obtenerTodasLasCategorias();


    @Operation(
            summary = "Obtener una categoría por ID",
            description = "Devuelve los detalles de una categoría específica. Este endpoint es público."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Categoría encontrada.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CategoriaResponseDTO.class)) }
            ),
            @ApiResponse(responseCode = "404", description = "Categoría no encontrada.", content = @Content)
    })
    ResponseEntity<CategoriaResponseDTO> obtenerCategoriaPorId(@Parameter(description = "ID de la categoría a buscar.", required = true, example = "1")
                                                               @PathVariable Integer id);

    @Operation(
            summary = "Actualizar una categoría existente",
            description = "Actualiza el nombre y/o la descripción de una categoría. Requiere permisos de administrador."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Categoría actualizada exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = CategoriaResponseDTO.class)) }
            ),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos.", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado. Se requiere rol de PRODUCT_MANAGER o SUPER_ADMIN.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Categoría no encontrada.", content = @Content)
    })
    ResponseEntity<CategoriaResponseDTO> actualizarCategoria(@Parameter(description = "ID de la categoría a actualizar.", required = true, example = "1")
                                                             @PathVariable Integer id,
                                                             @RequestBody CategoriaRequestDTO categoriaDTO);

    @Operation(
            summary = "Eliminar una categoría",
            description = "Elimina una categoría del sistema. Requiere permisos de administrador. Esta operación fallará si la categoría está asociada a algún producto."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Categoría eliminada exitosamente.", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado. Se requiere rol de PRODUCT_MANAGER o SUPER_ADMIN.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Categoría no encontrada.", content = @Content),
            @ApiResponse(responseCode = "409", description = "Conflicto. La categoría no se puede eliminar porque está en uso.", content = @Content)
    })
    ResponseEntity<Void> eliminarCategoria(@Parameter(description = "ID de la categoría a eliminar.", required = true, example = "1")
                                           @PathVariable Integer id);
}