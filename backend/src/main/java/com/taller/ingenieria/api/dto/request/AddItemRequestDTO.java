package com.taller.ingenieria.api.dto.request;

import lombok.Data;

@Data
public class AddItemRequestDTO {
    private Integer idProducto;
    private int cantidad;
}