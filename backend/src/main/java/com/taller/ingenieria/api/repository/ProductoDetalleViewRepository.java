package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.ProductoDetalleView;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoDetalleViewRepository extends JpaRepository<ProductoDetalleView, Integer> {
}