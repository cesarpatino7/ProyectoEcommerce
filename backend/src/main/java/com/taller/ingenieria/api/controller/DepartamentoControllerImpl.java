package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.response.DepartamentoResponseDTO;
import com.taller.ingenieria.api.service.DepartamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departamentos")
public class DepartamentoControllerImpl implements DepartamentoController {

    @Autowired
    private DepartamentoService departamentoService;

    @Override
    @GetMapping
    public ResponseEntity<List<DepartamentoResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(departamentoService.obtenerTodos());
    }
}