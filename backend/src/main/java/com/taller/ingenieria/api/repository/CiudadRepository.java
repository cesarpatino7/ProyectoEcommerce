package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Ciudad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CiudadRepository extends JpaRepository<Ciudad, Integer> {

    // Método para obtener ciudades por ID de departamento
    List<Ciudad> findByIdDepartamento_Id(Integer idDepartamento);

}