package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.ProductoSimpleView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductoSimpleViewRepository extends JpaRepository<ProductoSimpleView, Integer> {

    Page<ProductoSimpleView> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);

    // Búsqueda por categoría (CU.09). Usamos una consulta nativa porque la columna es un String agregado.
    @Query(value = "SELECT * FROM v_datos_productos_simple p WHERE EXISTS (" +
            "SELECT 1 FROM productos_categorias pc " +
            "JOIN categorias c ON pc.id_categoria = c.id_categoria " +
            "WHERE pc.id_producto = p.id_producto AND c.nombre = :categoria)",
            countQuery = "SELECT count(*) FROM v_datos_productos_simple p WHERE EXISTS (" +
                    "SELECT 1 FROM productos_categorias pc " +
                    "JOIN categorias c ON pc.id_categoria = c.id_categoria " +
                    "WHERE pc.id_producto = p.id_producto AND c.nombre = :categoria)",
            nativeQuery = true)
    Page<ProductoSimpleView> findByCategoria(@Param("categoria") String categoria, Pageable pageable);
}