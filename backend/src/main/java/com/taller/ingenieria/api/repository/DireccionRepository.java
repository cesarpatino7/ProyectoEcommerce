package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DireccionRepository extends JpaRepository<Direccion, Integer> {

    // Método para buscar todas las direcciones de un usuario específico por su ID
    List<Direccion> findByIdUsuario_Id(Integer idUsuario);
}

