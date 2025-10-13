package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.response.CiudadResponseDTO;
import com.taller.ingenieria.api.service.CiudadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ciudades")
public class CiudadControllerImpl implements CiudadController {

    @Autowired
    private CiudadService ciudadService;

    @Override
    @GetMapping("/departamento/{idDepartamento}")
    public ResponseEntity<List<CiudadResponseDTO>> obtenerCiudadesPorDepartamento(@PathVariable Integer idDepartamento) {
        return ResponseEntity.ok(ciudadService.obtenerCiudadesPorDepartamento(idDepartamento));
    }
}