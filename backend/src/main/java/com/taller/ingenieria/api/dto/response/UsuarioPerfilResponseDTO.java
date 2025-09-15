package com.taller.ingenieria.api.dto.response;

import lombok.Data;

@Data
public class UsuarioPerfilResponseDTO {
    private Integer id;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String rol;
}