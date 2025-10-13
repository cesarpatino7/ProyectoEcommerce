package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.response.CiudadResponseDTO;
import com.taller.ingenieria.api.model.Ciudad;
import com.taller.ingenieria.api.repository.CiudadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CiudadServiceImpl implements CiudadService {

    @Autowired
    private CiudadRepository ciudadRepository;

    @Override
    public List<CiudadResponseDTO> obtenerCiudadesPorDepartamento(Integer idDepartamento) {
        return ciudadRepository.findByIdDepartamento_Id(idDepartamento).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private CiudadResponseDTO convertirADTO(Ciudad ciudad) {
        CiudadResponseDTO dto = new CiudadResponseDTO();
        dto.setId(ciudad.getId());
        dto.setNombre(ciudad.getNombre());
        return dto;
    }
}

