package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.DireccionRequestDTO;
import com.taller.ingenieria.api.dto.response.DireccionResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface DireccionController {

    ResponseEntity<List<DireccionResponseDTO>> obtenerMisDirecciones();

    ResponseEntity<DireccionResponseDTO> crearDireccion(@RequestBody DireccionRequestDTO requestDTO);

    ResponseEntity<DireccionResponseDTO> actualizarDireccion(@PathVariable Integer idDireccion, @RequestBody DireccionRequestDTO requestDTO);

    ResponseEntity<Void> eliminarDireccion(@PathVariable Integer idDireccion);

}