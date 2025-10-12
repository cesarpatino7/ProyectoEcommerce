package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.UpdateStockRequestDTO;
import com.taller.ingenieria.api.dto.response.InventarioResponseDTO;
import com.taller.ingenieria.api.exception.ResourceNotFoundException;
import com.taller.ingenieria.api.model.Inventario;
import com.taller.ingenieria.api.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventarioServiceImpl implements InventarioService {

    @Autowired
    private InventarioRepository inventarioRepository;

    @Override
    @Transactional
    public InventarioResponseDTO actualizarStock(Integer idProducto, UpdateStockRequestDTO updateStockDTO) {

        Inventario inventario = inventarioRepository.findByIdProducto_Id(idProducto)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró un inventario para el producto con ID: " + idProducto));

        if (updateStockDTO.getStockActual() != null) {
            inventario.setStockActual(updateStockDTO.getStockActual());
        }
        if (updateStockDTO.getStockMinimo() != null) {
            inventario.setStockMinimo(updateStockDTO.getStockMinimo());
        }

        Inventario inventarioActualizado = inventarioRepository.save(inventario);

        return convertirADTO(inventarioActualizado);
    }

    private InventarioResponseDTO convertirADTO(Inventario inventario) {
        InventarioResponseDTO dto = new InventarioResponseDTO();
        dto.setIdInventario(inventario.getId());
        dto.setIdProducto(inventario.getIdProducto().getId());
        dto.setNombreProducto(inventario.getIdProducto().getNombre());
        dto.setStockActual(inventario.getStockActual());
        dto.setStockMinimo(inventario.getStockMinimo());
        dto.setFechaActualizacion(inventario.getFechaActualizacion());
        return dto;
    }
}