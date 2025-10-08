package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.DireccionRequestDTO;
import com.taller.ingenieria.api.dto.response.DireccionResponseDTO;

import java.util.List;

public interface DireccionService {

    List<DireccionResponseDTO> obtenerMisDirecciones();

    DireccionResponseDTO crearDireccion(DireccionRequestDTO requestDTO);

    DireccionResponseDTO actualizarDireccion(Integer idDireccion, DireccionRequestDTO requestDTO);

    void eliminarDireccion(Integer idDireccion);
}