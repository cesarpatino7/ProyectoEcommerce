package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Estado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstadoRepository extends JpaRepository<Estado, Integer> {
}