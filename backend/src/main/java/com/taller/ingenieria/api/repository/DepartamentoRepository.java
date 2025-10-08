package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartamentoRepository extends JpaRepository<Departamento, Integer> {
}