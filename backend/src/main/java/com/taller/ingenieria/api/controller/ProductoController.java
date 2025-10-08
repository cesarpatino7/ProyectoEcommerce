package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.ProductoCatalogoDTO;
import com.taller.ingenieria.api.dto.request.ProductoDetalleDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;


public interface ProductoController {
    ResponseEntity<Page<ProductoCatalogoDTO>> obtenerCatalogo(Pageable pageable, String busqueda, String categoria);
    ResponseEntity<ProductoDetalleDTO> obtenerProductoDetalle(Integer id);
}