package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.response.CiudadResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface CiudadController {

    @Operation(
            summary = "Obtener ciudades por departamento",
            description = "Devuelve una lista de ciudades que pertenecen al departamento especificado."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de ciudades obtenida exitosamente."),
            @ApiResponse(responseCode = "404", description = "Departamento no encontrado.")
    })
    ResponseEntity<List<CiudadResponseDTO>> obtenerCiudadesPorDepartamento(@PathVariable Integer idDepartamento);
}