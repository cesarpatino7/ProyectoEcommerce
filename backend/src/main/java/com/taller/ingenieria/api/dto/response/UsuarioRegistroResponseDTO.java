package com.taller.ingenieria.api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "DTO con la respuesta del servidor tras un registro de usuario exitoso.")
public class UsuarioRegistroResponseDTO {

    @Schema(description = "ID único del usuario recién creado.", example = "1")
    private Integer id;

    @Schema(description = "Nombre del usuario.", example = "Juan")
    private String nombre;

    @Schema(description = "Apellido del usuario.", example = "Pérez")
    private String apellido;

    @Schema(description = "Correo electrónico del usuario.", example = "juan.perez@example.com")
    private String email;

    @Schema(description = "Rol asignado al usuario (por defecto 'ROLE_CUSTOMER').", example = "ROLE_CUSTOMER")
    private String rol;

    @Schema(description = "Número de teléfono del usuario (si se proporcionó).", example = "0981123456")
    private String telefono;
}