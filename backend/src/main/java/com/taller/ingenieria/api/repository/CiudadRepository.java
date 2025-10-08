package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Ciudad;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CiudadRepository extends JpaRepository<Ciudad, Integer> {
}