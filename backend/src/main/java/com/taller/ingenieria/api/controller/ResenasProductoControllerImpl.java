package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.ResenaRequestDTO;
import com.taller.ingenieria.api.dto.response.ResenaResponseDTO;

import java.util.List;

import com.taller.ingenieria.api.service.ResenasProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/resenas")
public class ResenasProductoControllerImpl implements ResenasProductoController {

    @Autowired
    private final ResenasProductoService service;

    public ResenasProductoControllerImpl(ResenasProductoService service) {
        this.service = service;
    }

    @Override
    @GetMapping("/{idProducto}")
    public List<ResenaResponseDTO> obtenerResenasPorProducto(@PathVariable Long idProducto) {
        return service.obtenerResenasPorProducto(idProducto);
    }


    @Override
    @PostMapping
    public ResponseEntity<?> publicarResena(@RequestBody ResenaRequestDTO request) {
        try {
            service.publicarResena(request);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getReason()); // Esto se muestra en Swagger
        }
    }

}
