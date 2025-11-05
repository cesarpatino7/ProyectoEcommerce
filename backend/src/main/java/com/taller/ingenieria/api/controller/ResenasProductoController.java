package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.ResenaRequestDTO;
import com.taller.ingenieria.api.dto.response.ResenaResponseDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ResenasProductoController {
    List<ResenaResponseDTO> obtenerResenasPorProducto(Long idProducto);
    ResponseEntity<Void> publicarResena(ResenaRequestDTO request);
}
