package com.taller.ingenieria.api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "DTO para crear una nueva reseña de producto.")
public class ResenaRequestDTO {

    @Schema(description = "ID del usuario que publica la reseña", example = "1", required = true)
    private Integer idUsuario;

    @Schema(description = "ID del producto a reseñar", example = "5", required = true)
    private Integer idProducto;

    @Schema(description = "Calificación del producto (1 a 5 estrellas)", example = "5", required = true, minimum = "1", maximum = "5")
    private Integer calificacion;

    @Schema(description = "Comentario opcional sobre el producto", example = "Excelente producto, superó mis expectativas.")
    private String comentario;
}