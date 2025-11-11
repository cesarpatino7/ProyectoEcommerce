package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.ResenaRequestDTO;
import com.taller.ingenieria.api.dto.response.ResenaResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Tag(name = "Reseñas de Productos", description = "Endpoints para gestionar las reseñas y calificaciones de productos.")
public interface ResenasProductoController {

    @Operation(
            summary = "Obtener reseñas de un producto",
            description = "Obtiene todas las reseñas y calificaciones asociadas a un producto específico. " +
                    "Retorna una lista con la información de cada reseña incluyendo el nombre del usuario, " +
                    "calificación, comentario y fecha de publicación."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de reseñas obtenida exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ResenaResponseDTO.class)) }
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Producto no encontrado.",
                    content = @Content
            )
    })
    List<ResenaResponseDTO> obtenerResenasPorProducto(
            @Parameter(description = "ID del producto del cual se desean obtener las reseñas", required = true, example = "1")
            Long idProducto
    );

    @Operation(
            summary = "Publicar una nueva reseña",
            description = "Permite a un usuario autenticado publicar una reseña y calificación sobre un producto. " +
                    "La reseña debe incluir una calificación entre 1 y 5 estrellas y opcionalmente un comentario. " +
                    "El usuario debe estar autenticado para poder realizar esta acción."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Reseña publicada exitosamente.",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Solicitud inválida. Puede deberse a datos faltantes o formato incorrecto.",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Acceso denegado. Se requiere autenticación.",
                    content = @Content
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Usuario o producto no encontrado.",
                    content = @Content
            )
    })
    ResponseEntity<?> publicarResena(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos de la reseña a publicar",
                    required = true,
                    content = @Content(schema = @Schema(implementation = ResenaRequestDTO.class))
            )
            ResenaRequestDTO request
    );
}
