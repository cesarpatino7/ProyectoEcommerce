package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.ProductoCategoria;
import com.taller.ingenieria.api.model.id.ProductoCategoriaId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoCategoriaRepository extends JpaRepository<ProductoCategoria, ProductoCategoriaId> {
}