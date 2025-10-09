package com.taller.ingenieria.api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.Instant;

@Data
@Schema(description = "DTO para devolver la información de una categoría.")
public class CategoriaResponseDTO {

    @Schema(description = "ID único de la categoría.", example = "1")
    private Integer id;

    @Schema(description = "Nombre de la categoría.", example = "Fragancias Cítricas")
    private String nombre;

    @Schema(description = "Descripción detallada de la categoría.", example = "Perfumes frescos con notas de limón, naranja y bergamota.")
    private String descripcion;

    @Schema(description = "Fecha y hora de creación de la categoría.", example = "2025-10-08T20:30:00Z")
    private Instant createdAt;
}