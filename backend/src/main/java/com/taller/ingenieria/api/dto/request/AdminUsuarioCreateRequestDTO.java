package com.taller.ingenieria.api.dto.request;

import lombok.Data;

@Data
public class AdminUsuarioCreateRequestDTO extends UsuarioRegistroRequestDTO {
    private Integer idRol;
}