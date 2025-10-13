package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.response.DepartamentoResponseDTO;

import java.util.List;

public interface DepartamentoService {
    List<DepartamentoResponseDTO> obtenerTodos();
}