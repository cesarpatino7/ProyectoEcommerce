package com.taller.ingenieria.api.repository;

import com.taller.ingenieria.api.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

    // Método para buscar todos los pedidos de un usuario específico
    List<Pedido> findByIdUsuario_Id(Integer idUsuario);
}