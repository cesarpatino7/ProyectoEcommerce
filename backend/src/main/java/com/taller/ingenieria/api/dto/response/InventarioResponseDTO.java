package com.taller.ingenieria.api.dto.response;

import lombok.Data;
import java.time.Instant;

@Data
public class InventarioResponseDTO {

    private Integer idInventario;
    private Integer idProducto;
    private String nombreProducto;
    private Integer stockActual;
    private Integer stockMinimo;
    private Instant fechaActualizacion;
}