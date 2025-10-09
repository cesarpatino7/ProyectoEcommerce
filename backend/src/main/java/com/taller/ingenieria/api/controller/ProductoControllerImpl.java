package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.response.ProductoCatalogoDTO;
import com.taller.ingenieria.api.dto.response.ProductoDetalleDTO;
import com.taller.ingenieria.api.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoControllerImpl implements ProductoController {

    @Autowired
    private ProductoService productoService;

    @Override
    @GetMapping
    public ResponseEntity<Page<ProductoCatalogoDTO>> obtenerCatalogo(
            Pageable pageable,
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) String categoria) {
        return ResponseEntity.ok(productoService.obtenerCatalogo(pageable, busqueda, categoria));
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDetalleDTO> obtenerProductoDetalle(@PathVariable Integer id) {
        return ResponseEntity.ok(productoService.obtenerProductoDetalle(id));
    }
}