package com.taller.ingenieria.api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@AllArgsConstructor
@Schema(description = "DTO para mostrar la información de una reseña asociada a un producto.")
public class ResenaResponseDTO {

    @Schema(description = "Nombre del producto al que pertenece la reseña.", example = "Perfume Océano Fresco")
    private String producto;

    @Schema(description = "Nombre del usuario que realizó la reseña.", example = "Juan Pérez")
    private String usuario;

    @Schema(description = "Calificación otorgada por el usuario (1 a 5).", example = "5")
    private Integer calificacion;

    @Schema(description = "Comentario escrito por el usuario.", example = "Excelente fragancia, muy fresca y duradera.")
    private String comentario;

    @Schema(description = "Fecha en que se publicó la reseña.", example = "2025-11-05T14:30:00")
    private LocalDateTime fechaPublicacion;
}