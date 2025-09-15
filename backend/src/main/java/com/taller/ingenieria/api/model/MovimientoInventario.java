package com.taller.ingenieria.api.model;

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
@Table(name = "movimientos_inventario", indexes = {
        @Index(name = "idx_movimientos_inventario_fecha", columnList = "fecha_movimiento")
})
public class MovimientoInventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimiento_inventario", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "id_inventario", nullable = false)
    private Inventario idInventario;

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
    @JoinColumn(name = "id_tipo_movimiento", nullable = false)
    private TipoMovimiento idTipoMovimiento;

}