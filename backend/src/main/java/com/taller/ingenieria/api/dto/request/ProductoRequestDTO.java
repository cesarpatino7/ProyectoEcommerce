package com.taller.ingenieria.api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
@Schema(description = "DTO para crear o actualizar un producto. Usado por administradores.")
public class ProductoRequestDTO {

    @Schema(description = "Nombre del producto.", example = "Perfume Océano Fresco", required = true)
    private String nombre;

    @Schema(description = "Descripción detallada del producto.", example = "Una fragancia vibrante con notas cítricas y marinas.")
    private String descripcion;

    @Schema(description = "Precio de venta del producto.", example = "250000.50", required = true)
    private BigDecimal precio;

    @Schema(description = "Indica si el producto está activo y visible en el catálogo.", defaultValue = "true")
    private Boolean activo;

    @Schema(description = "Lista de IDs de las categorías a las que pertenece el producto.", required = true)
    private Set<Integer> categoriaIds;

    @Schema(description = "Lista de URLs completas de las imágenes del producto.")
    private List<String> imagenes;
}