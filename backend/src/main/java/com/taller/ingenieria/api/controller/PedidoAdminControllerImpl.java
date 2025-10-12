package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UpdateEstadoPedidoRequestDTO;
import com.taller.ingenieria.api.dto.response.PedidoAdminDTO;
import com.taller.ingenieria.api.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/pedidos")
public class PedidoAdminControllerImpl implements PedidoAdminController {

    @Autowired
    private PedidoService pedidoService;

    @Override
    @GetMapping
    @PreAuthorize("hasAnyRole('ORDER_MANAGER', 'SUPER_ADMIN')")
    public ResponseEntity<Page<PedidoAdminDTO>> obtenerTodosLosPedidos(Pageable pageable) {
        return ResponseEntity.ok(pedidoService.obtenerTodosLosPedidos(pageable));
    }

    @Override
    @PutMapping("/{idPedido}/estado")
    @PreAuthorize("hasAnyRole('ORDER_MANAGER', 'SUPER_ADMIN')")
    public ResponseEntity<PedidoAdminDTO> actualizarEstadoPedido(
            @PathVariable Integer idPedido,
            @RequestBody UpdateEstadoPedidoRequestDTO updateDTO) {

        PedidoAdminDTO pedidoActualizado = pedidoService.actualizarEstadoPedido(idPedido, updateDTO);
        return ResponseEntity.ok(pedidoActualizado);
    }
}