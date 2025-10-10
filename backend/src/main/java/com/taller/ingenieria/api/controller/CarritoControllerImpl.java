package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.AddItemRequestDTO;
import com.taller.ingenieria.api.dto.request.UpdateItemRequestDTO;
import com.taller.ingenieria.api.dto.response.CarritoResponseDTO;
import com.taller.ingenieria.api.service.CarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/carrito")
public class CarritoControllerImpl implements CarritoController {

    @Autowired
    private CarritoService carritoService;

    @Override
    @GetMapping
    public ResponseEntity<CarritoResponseDTO> obtenerCarrito(
            @RequestHeader(name = "X-Cart-ID", required = false) String cartId) {
        return ResponseEntity.ok(carritoService.obtenerCarrito(cartId));
    }

    @Override
    @PostMapping("/items")
    public ResponseEntity<CarritoResponseDTO> agregarItemAlCarrito(
            @RequestHeader(name = "X-Cart-ID", required = false) String cartId,
            @RequestBody AddItemRequestDTO addItemDTO) {
        return ResponseEntity.ok(carritoService.agregarItemAlCarrito(cartId, addItemDTO));
    }

    @Override
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CarritoResponseDTO> actualizarItemDelCarrito(
            @RequestHeader(name = "X-Cart-ID", required = false) String cartId,
            @PathVariable Integer itemId,
            @RequestBody UpdateItemRequestDTO updateItemDTO) {
        return ResponseEntity.ok(carritoService.actualizarItemDelCarrito(cartId, itemId, updateItemDTO));
    }

    @Override
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> eliminarItemDelCarrito(
            @RequestHeader(name = "X-Cart-ID", required = false) String cartId,
            @PathVariable Integer itemId) {
        carritoService.eliminarItemDelCarrito(cartId, itemId);
        return ResponseEntity.noContent().build();
    }
}