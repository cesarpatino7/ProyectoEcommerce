package com.taller.ingenieria.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Immutable
@Table(name = "v_resenas_producto")
public class ResenasProductoView {

    @Id
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "id_producto")
    private Integer idProducto;

    @Column(name = "producto")
    private String producto;

    @Column(name = "usuario")
    private String usuario;

    @Column(name = "calificacion")
    private Integer calificacion;

    @Column(name = "comentario")
    private String comentario;

    @Column(name = "fecha_publicacion")
    private LocalDateTime fechaPublicacion;
}