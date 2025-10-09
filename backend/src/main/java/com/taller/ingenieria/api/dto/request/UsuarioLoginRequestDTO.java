package com.taller.ingenieria.api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "DTO para la autenticación de un usuario.")
public class UsuarioLoginRequestDTO {

    @Schema(description = "Correo electrónico del usuario registrado.", example = "juan.perez@example.com", required = true)
    private String email;

    @Schema(description = "Contraseña del usuario registrado.", example = "Contrasena123!", required = true)
    private String password;
}