package com.taller.ingenieria.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "pedidos", indexes = {
        @Index(name = "idx_pedidos_usuario", columnList = "id_usuario"),
        @Index(name = "idx_pedidos_fecha", columnList = "fecha_pedido")
})
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario idUsuario;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_estado", nullable = false)
    private Estado idEstado;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_direccion", nullable = false)
    private Direccion idDireccion;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "fecha_pedido")
    private Instant fechaPedido;

    @Column(name = "fecha_entrega")
    private Instant fechaEntrega;

    @NotNull
    @Column(name = "total", nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @OneToMany(mappedBy = "idPedido", fetch = FetchType.LAZY)
    private List<DetallePedido> detalles;
}