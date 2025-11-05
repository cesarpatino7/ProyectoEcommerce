package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.ResenaRequestDTO;
import com.taller.ingenieria.api.dto.response.ResenaResponseDTO;
import java.util.List;

public interface ResenasProductoService {
    List<ResenaResponseDTO> obtenerResenasPorProducto(Long idProducto);
    void publicarResena(ResenaRequestDTO request);
}