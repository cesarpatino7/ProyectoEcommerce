package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.CategoriaRequestDTO;
import com.taller.ingenieria.api.dto.response.CategoriaResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface CategoriaController {

    ResponseEntity<CategoriaResponseDTO> crearCategoria(@RequestBody CategoriaRequestDTO categoriaDTO);

    ResponseEntity<List<CategoriaResponseDTO>> obtenerTodasLasCategorias();

    ResponseEntity<CategoriaResponseDTO> obtenerCategoriaPorId(@PathVariable Integer id);

    ResponseEntity<CategoriaResponseDTO> actualizarCategoria(@PathVariable Integer id, @RequestBody CategoriaRequestDTO categoriaDTO);

    ResponseEntity<Void> eliminarCategoria(@PathVariable Integer id);
}