package com.taller.ingenieria.api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Schema(description = "DTO para mostrar un producto en la vista de catálogo (simplificada).")
public class ProductoCatalogoDTO {

    @Schema(description = "ID único del producto.", example = "1")
    private Integer id;

    @Schema(description = "Nombre del producto.", example = "Perfume Océano Fresco")
    private String nombre;

    @Schema(description = "Precio de venta del producto.", example = "250000.50")
    private BigDecimal precio;

    @Schema(description = "Calificación promedio del producto, basada en las reseñas de los usuarios.", example = "4.5")
    private BigDecimal calificacionPromedio;

    @Schema(description = "URL de la imagen principal del producto.", example = "http://localhost:8080/api/v1/files/download/a1b2c3d4.jpg")
    private String imagen;
}