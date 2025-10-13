package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.response.CiudadResponseDTO;

import java.util.List;

public interface CiudadService {
    List<CiudadResponseDTO> obtenerCiudadesPorDepartamento(Integer idDepartamento);
}
