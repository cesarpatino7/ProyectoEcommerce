package com.taller.ingenieria.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "tipos_movimiento")
public class TipoMovimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_movimiento", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Column(name = "descripcion", nullable = false, length = 50)
    private String descripcion;

}