package com.taller.ingenieria.api.dto.response;

import lombok.Data;

@Data
public class UsuarioLoginResponseDTO {
    private Integer id;
    private String nombre;
    private String apellido;
    private String email;
    private String rol;
    private String telefono;
}
