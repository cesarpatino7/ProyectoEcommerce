package com.taller.ingenieria.api.dto.request;

import lombok.Data;

@Data
public class UsuarioLoginRequestDTO {
    private String email;
    private String password;
}
