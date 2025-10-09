package com.taller.ingenieria.api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "DTO para crear o actualizar una categoría de productos.")
public class CategoriaRequestDTO {

    @Schema(description = "Nombre de la categoría.", example = "Fragancias Cítricas", required = true)
    private String nombre;

    @Schema(description = "Descripción detallada de la categoría.", example = "Perfumes frescos con notas de limón, naranja y bergamota.")
    private String descripcion;
}