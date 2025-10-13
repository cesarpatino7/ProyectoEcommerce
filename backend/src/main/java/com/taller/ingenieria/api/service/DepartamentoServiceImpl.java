package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.response.DepartamentoResponseDTO;
import com.taller.ingenieria.api.model.Departamento;
import com.taller.ingenieria.api.repository.DepartamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartamentoServiceImpl implements DepartamentoService {

    @Autowired
    private DepartamentoRepository departamentoRepository;

    @Override
    public List<DepartamentoResponseDTO> obtenerTodos() {
        return departamentoRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private DepartamentoResponseDTO convertirADTO(Departamento departamento) {
        DepartamentoResponseDTO dto = new DepartamentoResponseDTO();
        dto.setId(departamento.getId());
        dto.setNombre(departamento.getNombre());
        return dto;
    }
}