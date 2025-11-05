package com.taller.ingenieria.api.dto.request;

import lombok.Data;

@Data
public class ResenaRequestDTO {
    private Integer idUsuario;
    private Integer idProducto;
    private Integer calificacion;
    private String comentario;
}