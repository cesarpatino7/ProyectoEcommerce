package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.response.DepartamentoResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface DepartamentoController {

    @Operation(
            summary = "Listar todos los departamentos",
            description = "Devuelve una lista con todos los departamentos disponibles."
    )
    @ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente.")
    ResponseEntity<List<DepartamentoResponseDTO>> obtenerTodos();
}