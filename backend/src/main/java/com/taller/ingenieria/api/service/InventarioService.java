package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.UpdateStockRequestDTO;
import com.taller.ingenieria.api.dto.response.InventarioResponseDTO;

public interface InventarioService {

    /**
     * Actualiza el stock de un producto específico.
     * @param idProducto El ID del producto cuyo inventario se va a actualizar.
     * @param updateStockDTO DTO con la nueva cantidad de stock.
     * @return Un DTO con el estado actualizado del inventario.
     */
    InventarioResponseDTO actualizarStock(Integer idProducto, UpdateStockRequestDTO updateStockDTO);
}