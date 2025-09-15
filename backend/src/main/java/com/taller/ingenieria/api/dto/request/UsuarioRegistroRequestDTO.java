package com.taller.ingenieria.api.dto.request;

import lombok.Data;

@Data
public class UsuarioRegistroRequestDTO {
    private String nombre;
    private String apellido;
    private String email;
    private String password;
}
