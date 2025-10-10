package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.AddItemRequestDTO;
import com.taller.ingenieria.api.dto.request.UpdateItemRequestDTO;
import com.taller.ingenieria.api.dto.response.CarritoResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

public interface CarritoController {

    ResponseEntity<CarritoResponseDTO> obtenerCarrito(
            @RequestHeader(name = "X-Cart-ID", required = false) String cartId);

    ResponseEntity<CarritoResponseDTO> agregarItemAlCarrito(
            @RequestHeader(name = "X-Cart-ID", required = false) String cartId,
            @RequestBody AddItemRequestDTO addItemDTO);

    ResponseEntity<CarritoResponseDTO> actualizarItemDelCarrito(
            @RequestHeader(name = "X-Cart-ID", required = false) String cartId,
            @PathVariable Integer itemId,
            @RequestBody UpdateItemRequestDTO updateItemDTO);

    ResponseEntity<Void> eliminarItemDelCarrito(
            @RequestHeader(name = "X-Cart-ID", required = false) String cartId,
            @PathVariable Integer itemId);
}