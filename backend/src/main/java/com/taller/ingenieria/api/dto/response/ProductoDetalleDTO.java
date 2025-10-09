package com.taller.ingenieria.api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Schema(description = "DTO para mostrar la información completa de un producto en su página de detalle.")
public class ProductoDetalleDTO {

    @Schema(description = "ID único del producto.", example = "1")
    private Integer id;

    @Schema(description = "Nombre del producto.", example = "Perfume Océano Fresco")
    private String nombre;

    @Schema(description = "Descripción detallada del producto.", example = "Una fragancia vibrante con notas cítricas y marinas.")
    private String descripcion;

    @Schema(description = "Precio de venta del producto.", example = "250000.50")
    private BigDecimal precio;

    @Schema(description = "Cantidad de unidades disponibles en stock.", example = "50")
    private Integer stockActual;

    @Schema(description = "Cadena de texto con los nombres de las categorías a las que pertenece, separadas por comas.", example = "Cítricos, Acuáticos, Verano")
    private String categorias;

    @Schema(description = "Cadena de texto en formato JSON con las URLs de todas las imágenes del producto.", example = "[\"http://.../img1.jpg\", \"http://.../img2.jpg\"]")
    private String imagenes;
}