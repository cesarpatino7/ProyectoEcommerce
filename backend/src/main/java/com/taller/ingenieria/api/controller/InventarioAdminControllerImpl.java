package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UpdateStockRequestDTO;
import com.taller.ingenieria.api.dto.response.InventarioResponseDTO;
import com.taller.ingenieria.api.service.InventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/inventario")
public class InventarioAdminControllerImpl implements InventarioAdminController {

    @Autowired
    private InventarioService inventarioService;

    @Override
    @PutMapping("/{idProducto}")
    @PreAuthorize("hasAnyRole('PRODUCT_MANAGER', 'SUPER_ADMIN')")
    public ResponseEntity<InventarioResponseDTO> actualizarStock(
            @PathVariable Integer idProducto,
            @RequestBody UpdateStockRequestDTO updateStockDTO) {

        InventarioResponseDTO inventarioActualizado = inventarioService.actualizarStock(idProducto, updateStockDTO);
        return ResponseEntity.ok(inventarioActualizado);
    }
}