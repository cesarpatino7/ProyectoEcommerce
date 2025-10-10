package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CarritoRepository extends JpaRepository<Carrito, Integer> {

    // Método para encontrar el carrito activo de un usuario por su ID
    Optional<Carrito> findByIdUsuario_Id(Integer idUsuario);
}