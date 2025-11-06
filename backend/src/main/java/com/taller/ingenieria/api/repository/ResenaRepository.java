package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Producto;
import com.taller.ingenieria.api.model.Resena;
import com.taller.ingenieria.api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResenaRepository extends JpaRepository<Resena, Long> {
    boolean existsByIdUsuarioAndIdProducto(Usuario usuario, Producto producto);
}