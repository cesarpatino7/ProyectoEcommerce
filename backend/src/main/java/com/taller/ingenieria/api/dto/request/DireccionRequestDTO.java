package com.taller.ingenieria.api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "DTO para crear o actualizar una dirección de envío de un usuario.")
public class DireccionRequestDTO {

    @Schema(description = "Descripción completa de la calle, número de casa, y referencias.", example = "Av. Siempre Viva 742, casa con puerta azul", required = true)
    private String descripcionCalle;

    @Schema(description = "ID de la ciudad a la que pertenece la dirección.", example = "15", required = true)
    private Integer idCiudad;
}