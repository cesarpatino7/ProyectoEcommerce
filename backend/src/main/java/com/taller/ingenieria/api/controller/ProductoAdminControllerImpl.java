package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.ProductoRequestDTO;
import com.taller.ingenieria.api.dto.response.ProductoResponseDTO;
import com.taller.ingenieria.api.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/productos")
public class ProductoAdminControllerImpl implements ProductoAdminController {
    @Autowired
    private ProductoService productoService;

    @Override
    @PostMapping
    @PreAuthorize("hasAnyRole('PRODUCT_MANAGER', 'SUPER_ADMIN')")
    public ResponseEntity<ProductoResponseDTO> crearProducto(@RequestBody ProductoRequestDTO productoDTO) {
        return new ResponseEntity<>(productoService.crearProducto(productoDTO), HttpStatus.CREATED);
    }

    @Override
    @GetMapping
    @PreAuthorize("hasAnyRole('PRODUCT_MANAGER', 'SUPER_ADMIN')")
    public ResponseEntity<List<ProductoResponseDTO>> obtenerTodosLosProductos() {
        return ResponseEntity.ok(productoService.obtenerTodosLosProductos());
    }

    @Override
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PRODUCT_MANAGER', 'SUPER_ADMIN')")
    public ResponseEntity<ProductoResponseDTO> obtenerProductoPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(productoService.obtenerProductoPorId(id));
    }

    @Override
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PRODUCT_MANAGER', 'SUPER_ADMIN')")
    public ResponseEntity<ProductoResponseDTO> actualizarProducto(@PathVariable Integer id, @RequestBody ProductoRequestDTO productoDTO) {
        return ResponseEntity.ok(productoService.actualizarProducto(id, productoDTO));
    }

    @Override
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PRODUCT_MANAGER', 'SUPER_ADMIN')")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Integer id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }
}
