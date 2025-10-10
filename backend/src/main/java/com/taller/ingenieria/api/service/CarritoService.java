package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.AddItemRequestDTO;
import com.taller.ingenieria.api.dto.request.UpdateItemRequestDTO;
import com.taller.ingenieria.api.dto.response.CarritoResponseDTO;

public interface CarritoService {

    CarritoResponseDTO obtenerCarrito(String cartId);

    CarritoResponseDTO agregarItemAlCarrito(String cartId, AddItemRequestDTO addItemDTO);

    CarritoResponseDTO actualizarItemDelCarrito(String cartId, Integer itemId, UpdateItemRequestDTO updateItemDTO);

    void eliminarItemDelCarrito(String cartId, Integer itemId);
}