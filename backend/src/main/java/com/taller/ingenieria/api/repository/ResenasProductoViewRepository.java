package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.ResenasProductoView;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResenasProductoViewRepository extends JpaRepository<ResenasProductoView, Long> {
    List<ResenasProductoView> findByIdProductoOrderByFechaPublicacionDesc(Long idProducto);
}
