package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventarioRepository extends JpaRepository<Inventario, Integer> {
}