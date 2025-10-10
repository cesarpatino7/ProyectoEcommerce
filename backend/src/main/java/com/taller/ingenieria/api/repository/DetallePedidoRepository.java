package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Integer> {
}