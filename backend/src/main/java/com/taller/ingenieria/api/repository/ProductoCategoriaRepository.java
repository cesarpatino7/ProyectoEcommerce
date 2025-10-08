package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Producto;
import com.taller.ingenieria.api.model.ProductoCategoria;
import com.taller.ingenieria.api.model.id.ProductoCategoriaId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductoCategoriaRepository extends JpaRepository<ProductoCategoria, ProductoCategoriaId> {
    // Método para encontrar todas las relaciones por producto
    List<ProductoCategoria> findByProducto(Producto producto);
}