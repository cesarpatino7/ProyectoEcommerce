package com.taller.ingenieria.api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "DTO para el registro de un nuevo usuario (Cliente).")
public class UsuarioRegistroRequestDTO {

    @Schema(description = "Nombre del usuario.", example = "Juan", required = true)
    private String nombre;

    @Schema(description = "Apellido del usuario.", example = "Pérez", required = true)
    private String apellido;

    @Schema(description = "Correo electrónico del usuario. Debe ser único.", example = "juan.perez@example.com", required = true)
    private String email;

    @Schema(description = "Contraseña del usuario.", example = "Contrasena123!", required = true)
    private String password;
}