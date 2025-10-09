package com.taller.ingenieria.api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Schema(description = "DTO para devolver la información detallada de un producto (vista de administrador).")
public class ProductoResponseDTO {

    @Schema(description = "ID único del producto.", example = "1")
    private Integer id;

    @Schema(description = "Nombre del producto.", example = "Perfume Océano Fresco")
    private String nombre;

    @Schema(description = "Descripción detallada del producto.", example = "Una fragancia vibrante con notas cítricas y marinas.")
    private String descripcion;

    @Schema(description = "Precio de venta del producto.", example = "250000.50")
    private BigDecimal precio;

    @Schema(description = "Indica si el producto está activo y visible en el catálogo.", example = "true")
    private Boolean activo;

    @Schema(description = "Fecha y hora de creación del producto.", example = "2025-10-08T20:30:00Z")
    private Instant createdAt;

    @Schema(description = "Lista de nombres de las categorías a las que pertenece el producto.")
    private List<String> categorias;

    @Schema(description = "Lista de URLs completas de las imágenes del producto.")
    private List<String> imagenes;
}