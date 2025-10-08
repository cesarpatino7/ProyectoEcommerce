package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.CategoriaRequestDTO;
import com.taller.ingenieria.api.dto.response.CategoriaResponseDTO;
import com.taller.ingenieria.api.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categorias")
public class CategoriaControllerImpl implements CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @Override
    @PostMapping
    public ResponseEntity<CategoriaResponseDTO> crearCategoria(@RequestBody CategoriaRequestDTO categoriaDTO) {
        return new ResponseEntity<>(categoriaService.crearCategoria(categoriaDTO), HttpStatus.CREATED);
    }

    @Override
    @GetMapping
    public ResponseEntity<List<CategoriaResponseDTO>> obtenerTodasLasCategorias() {
        return ResponseEntity.ok(categoriaService.obtenerTodasLasCategorias());
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponseDTO> obtenerCategoriaPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(categoriaService.obtenerCategoriaPorId(id));
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponseDTO> actualizarCategoria(@PathVariable Integer id, @RequestBody CategoriaRequestDTO categoriaDTO) {
        return ResponseEntity.ok(categoriaService.actualizarCategoria(id, categoriaDTO));
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable Integer id) {
        categoriaService.eliminarCategoria(id);
        return ResponseEntity.noContent().build();
    }
}