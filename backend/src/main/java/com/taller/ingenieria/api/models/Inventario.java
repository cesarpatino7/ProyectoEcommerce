package com.taller.ingenieria.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "inventarios", indexes = {
        @Index(name = "idx_inventarios_producto", columnList = "id_producto")
}, uniqueConstraints = {
        @UniqueConstraint(name = "inventarios_id_producto_key", columnNames = {"id_producto"})
})
public class Inventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inventario", nullable = false)
    private Integer id;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto idProducto;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "stock_actual", nullable = false)
    private Integer stockActual;

    @ColumnDefault("0")
    @Column(name = "stock_minimo")
    private Integer stockMinimo;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "fecha_actualizacion")
    private Instant fechaActualizacion;

}