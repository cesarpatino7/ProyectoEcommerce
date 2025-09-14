package com.taller.ingenieria.api.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class ProductoCategoriaId implements Serializable {
    private static final long serialVersionUID = -6440405186063259098L;
    @NotNull
    @Column(name = "idproducto", nullable = false)
    private Integer idproducto;

    @NotNull
    @Column(name = "idcategoria", nullable = false)
    private Integer idcategoria;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ProductoCategoriaId entity = (ProductoCategoriaId) o;
        return Objects.equals(this.idcategoria, entity.idcategoria) &&
                Objects.equals(this.idproducto, entity.idproducto);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idcategoria, idproducto);
    }

}