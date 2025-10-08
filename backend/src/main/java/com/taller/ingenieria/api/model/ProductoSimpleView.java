package com.taller.ingenieria.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Immutable
@Table(name = "v_datos_productos_simple")
public class ProductoSimpleView {

    @Id
    @Column(name = "id_producto")
    private Integer idProducto;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "precio")
    private BigDecimal precio;

    @Column(name = "activo")
    private Boolean activo;

    @Column(name = "calificacion_promedio")
    private BigDecimal calificacionPromedio;

    @Column(name = "imagen")
    private String imagen;
}