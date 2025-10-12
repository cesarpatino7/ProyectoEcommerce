package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UpdateStockRequestDTO;
import com.taller.ingenieria.api.dto.response.InventarioResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

public interface InventarioAdminController {

    /**
     * Endpoint para actualizar el stock de un producto.
     * @param idProducto El ID del producto.
     * @param updateStockDTO El cuerpo de la petición con los nuevos datos de stock.
     * @return La vista actualizada del inventario del producto.
     */
    ResponseEntity<InventarioResponseDTO> actualizarStock(
            @PathVariable Integer idProducto,
            @RequestBody UpdateStockRequestDTO updateStockDTO);
}