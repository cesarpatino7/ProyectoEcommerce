package com.taller.ingenieria.api.dto.request;

import lombok.Data;

@Data
public class UsuarioUpdateRequestDTO {
    private String nombre;
    private String apellido;
    private String telefono;
}