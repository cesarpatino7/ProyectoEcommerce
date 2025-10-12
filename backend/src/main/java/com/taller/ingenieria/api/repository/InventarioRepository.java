package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InventarioRepository extends JpaRepository<Inventario, Integer> {

    // Método para buscar un inventario por el ID de su producto asociado
    Optional<Inventario> findByIdProducto_Id(Integer idProducto);
}