package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.ProductoRequestDTO;
import com.taller.ingenieria.api.dto.response.ProductoResponseDTO;
import com.taller.ingenieria.api.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoControllerImpl implements ProductoController {

    @Autowired
    private ProductoService productoService;

    @Override
    @PostMapping
    public ResponseEntity<ProductoResponseDTO> crearProducto(@RequestBody ProductoRequestDTO productoDTO) {
        return new ResponseEntity<>(productoService.crearProducto(productoDTO), HttpStatus.CREATED);
    }

    @Override
    @GetMapping
    public ResponseEntity<List<ProductoResponseDTO>> obtenerTodosLosProductos() {
        return ResponseEntity.ok(productoService.obtenerTodosLosProductos());
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> obtenerProductoPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(productoService.obtenerProductoPorId(id));
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> actualizarProducto(@PathVariable Integer id, @RequestBody ProductoRequestDTO productoDTO) {
        return ResponseEntity.ok(productoService.actualizarProducto(id, productoDTO));
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Integer id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }
}