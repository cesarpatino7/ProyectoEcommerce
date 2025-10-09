package com.taller.ingenieria.api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "DTO para mostrar una dirección de envío de un usuario.")
public class DireccionResponseDTO {

    @Schema(description = "ID único de la dirección.", example = "1")
    private Integer id;

    @Schema(description = "Descripción completa de la calle, número de casa, y referencias.", example = "Av. Siempre Viva 742, casa con puerta azul")
    private String descripcionCalle;

    @Schema(description = "Nombre de la ciudad.", example = "San Lorenzo")
    private String nombreCiudad;

    @Schema(description = "Nombre del departamento.", example = "Central")
    private String nombreDepartamento;
}