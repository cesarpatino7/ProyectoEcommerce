package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
}