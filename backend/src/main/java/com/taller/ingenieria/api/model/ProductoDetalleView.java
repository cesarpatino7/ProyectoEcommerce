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
@Table(name = "v_datos_producto")
public class ProductoDetalleView {

    @Id
    @Column(name = "id_producto")
    private Integer idProducto;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "precio")
    private BigDecimal precio;

    @Column(name = "stock_actual")
    private Integer stockActual;

    @Column(name = "categorias")
    private String categorias;

    @Column(name = "imagenes", columnDefinition = "json")
    private String imagenes;
}