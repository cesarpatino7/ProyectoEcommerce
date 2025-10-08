package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.CategoriaRequestDTO;
import com.taller.ingenieria.api.dto.response.CategoriaResponseDTO;

import java.util.List;

public interface CategoriaService {

    CategoriaResponseDTO crearCategoria(CategoriaRequestDTO categoriaDTO);

    List<CategoriaResponseDTO> obtenerTodasLasCategorias();

    CategoriaResponseDTO obtenerCategoriaPorId(Integer id);

    CategoriaResponseDTO actualizarCategoria(Integer id, CategoriaRequestDTO categoriaDTO);

    void eliminarCategoria(Integer id);
}