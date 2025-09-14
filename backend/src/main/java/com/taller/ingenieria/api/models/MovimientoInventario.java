package com.taller.ingenieria.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "movimiento_inventario")
public class MovimientoInventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idmovimientoinventario", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "idinventario", nullable = false)
    private Inventario idinventario;

    @NotNull
    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "fecha_movimiento")
    private Instant fechaMovimiento;

    @Size(max = 100)
    @Column(name = "referencia", length = 100)
    private String referencia;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idtipomovimiento", nullable = false)
    private TipoMovimiento idtipomovimiento;

}