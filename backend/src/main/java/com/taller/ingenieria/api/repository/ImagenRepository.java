package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Imagen;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImagenRepository extends JpaRepository<Imagen, Integer> {
}