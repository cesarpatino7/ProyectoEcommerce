package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Imagen;
import com.taller.ingenieria.api.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImagenRepository extends JpaRepository<Imagen, Integer> {
    // Método para encontrar todas las imágenes de un producto
    List<Imagen> findByIdProducto(Producto producto);
}