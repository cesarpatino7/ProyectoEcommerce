package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.ProductoRequestDTO;
import com.taller.ingenieria.api.dto.response.ProductoResponseDTO;

import java.util.List;

public interface ProductoService {
    ProductoResponseDTO crearProducto(ProductoRequestDTO productoDTO);
    List<ProductoResponseDTO> obtenerTodosLosProductos();
    ProductoResponseDTO obtenerProductoPorId(Integer id);
    ProductoResponseDTO actualizarProducto(Integer id, ProductoRequestDTO productoDTO);
    void eliminarProducto(Integer id);
}