package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {
}