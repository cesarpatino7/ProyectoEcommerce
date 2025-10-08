package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.DireccionRequestDTO;
import com.taller.ingenieria.api.dto.response.DireccionResponseDTO;
import com.taller.ingenieria.api.service.DireccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/me/direcciones")
public class DireccionControllerImpl implements DireccionController {

    @Autowired
    private DireccionService direccionService;

    @Override
    @GetMapping
    public ResponseEntity<List<DireccionResponseDTO>> obtenerMisDirecciones() {
        return ResponseEntity.ok(direccionService.obtenerMisDirecciones());
    }

    @Override
    @PostMapping
    public ResponseEntity<DireccionResponseDTO> crearDireccion(@RequestBody DireccionRequestDTO requestDTO) {
        return new ResponseEntity<>(direccionService.crearDireccion(requestDTO), HttpStatus.CREATED);
    }

    @Override
    @PutMapping("/{idDireccion}")
    public ResponseEntity<DireccionResponseDTO> actualizarDireccion(@PathVariable Integer idDireccion, @RequestBody DireccionRequestDTO requestDTO) {
        return ResponseEntity.ok(direccionService.actualizarDireccion(idDireccion, requestDTO));
    }

    @Override
    @DeleteMapping("/{idDireccion}")
    public ResponseEntity<Void> eliminarDireccion(@PathVariable Integer idDireccion) {
        direccionService.eliminarDireccion(idDireccion);
        return ResponseEntity.noContent().build();
    }
}