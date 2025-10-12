package com.taller.ingenieria.api.dto.request;

import lombok.Data;

@Data
public class UpdateStockRequestDTO {

    /**
     * La nueva cantidad total de unidades disponibles para el producto.
     */
    private Integer stockActual;

    /**
     * El umbral para el stock mínimo (opcional).
     */
    private Integer stockMinimo;
}