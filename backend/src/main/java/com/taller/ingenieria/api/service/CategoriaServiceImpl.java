package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.CategoriaRequestDTO;
import com.taller.ingenieria.api.dto.response.CategoriaResponseDTO;
import com.taller.ingenieria.api.exception.ResourceNotFoundException;
import com.taller.ingenieria.api.model.Categoria;
import com.taller.ingenieria.api.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaServiceImpl implements CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Override
    public CategoriaResponseDTO crearCategoria(CategoriaRequestDTO categoriaDTO) {
        Categoria categoria = new Categoria();
        categoria.setNombre(categoriaDTO.getNombre());
        categoria.setDescripcion(categoriaDTO.getDescripcion());
        categoria.setCreatedAt(Instant.now());
        Categoria nuevaCategoria = categoriaRepository.save(categoria);
        return convertirADTO(nuevaCategoria);
    }

    @Override
    public List<CategoriaResponseDTO> obtenerTodasLasCategorias() {
        return categoriaRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategoriaResponseDTO obtenerCategoriaPorId(Integer id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con id: " + id));
        return convertirADTO(categoria);
    }

    @Override
    public CategoriaResponseDTO actualizarCategoria(Integer id, CategoriaRequestDTO categoriaDTO) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con id: " + id));
        categoria.setNombre(categoriaDTO.getNombre());
        categoria.setDescripcion(categoriaDTO.getDescripcion());
        Categoria categoriaActualizada = categoriaRepository.save(categoria);
        return convertirADTO(categoriaActualizada);
    }

    @Override
    public void eliminarCategoria(Integer id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con id: " + id));
        categoriaRepository.delete(categoria);
    }

    private CategoriaResponseDTO convertirADTO(Categoria categoria) {
        CategoriaResponseDTO dto = new CategoriaResponseDTO();
        dto.setId(categoria.getId());
        dto.setNombre(categoria.getNombre());
        dto.setDescripcion(categoria.getDescripcion());
        dto.setCreatedAt(categoria.getCreatedAt());
        return dto;
    }
}