package com.taller.ingenieria.api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "DTO para actualizar los datos de un usuario existente.")
public class UsuarioUpdateRequestDTO {

    @Schema(description = "Nuevo nombre del usuario.", example = "Juan Carlos")
    private String nombre;

    @Schema(description = "Nuevo apellido del usuario.", example = "Pérez Gómez")
    private String apellido;

    @Schema(description = "Nuevo número de teléfono del usuario.", example = "0981123456")
    private String telefono;
}