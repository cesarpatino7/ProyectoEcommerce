package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.ProductoRequestDTO;
import com.taller.ingenieria.api.dto.response.ProductoResponseDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ProductoController {
    ResponseEntity<ProductoResponseDTO> crearProducto(ProductoRequestDTO productoDTO);
    ResponseEntity<List<ProductoResponseDTO>> obtenerTodosLosProductos();
    ResponseEntity<ProductoResponseDTO> obtenerProductoPorId(Integer id);
    ResponseEntity<ProductoResponseDTO> actualizarProducto(Integer id, ProductoRequestDTO productoDTO);
    ResponseEntity<Void> eliminarProducto(Integer id);
}