package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.DireccionRequestDTO;
import com.taller.ingenieria.api.dto.response.DireccionResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Tag(name = "Direcciones de Usuario", description = "Endpoints para gestionar las direcciones de envío del usuario autenticado.")
public interface DireccionController {

    @Operation(
            summary = "Obtener mis direcciones",
            description = "Devuelve una lista de todas las direcciones de envío guardadas por el usuario autenticado."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de direcciones obtenida exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = DireccionResponseDTO.class))) }
            ),
            @ApiResponse(responseCode = "403", description = "Acceso denegado. Se requiere un token válido.", content = @Content)
    })
    ResponseEntity<List<DireccionResponseDTO>> obtenerMisDirecciones();

    @Operation(
            summary = "Crear una nueva dirección",
            description = "Añade una nueva dirección de envío al perfil del usuario autenticado."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Dirección creada exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DireccionResponseDTO.class)) }
            ),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos (ej. idCiudad no existe).", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado. Se requiere un token válido.", content = @Content)
    })
    ResponseEntity<DireccionResponseDTO> crearDireccion(@RequestBody DireccionRequestDTO requestDTO);

    @Operation(
            summary = "Actualizar una dirección existente",
            description = "Actualiza los datos de una dirección de envío específica. El usuario solo puede actualizar sus propias direcciones."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Dirección actualizada exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = DireccionResponseDTO.class)) }
            ),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos.", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado. No tiene permiso para modificar esta dirección.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Dirección no encontrada.", content = @Content)
    })
    ResponseEntity<DireccionResponseDTO> actualizarDireccion(
            @Parameter(description = "ID de la dirección a actualizar.", required = true, example = "1")
            @PathVariable Integer idDireccion,
            @RequestBody DireccionRequestDTO requestDTO);

    @Operation(
            summary = "Eliminar una dirección",
            description = "Elimina una dirección de envío específica. El usuario solo puede eliminar sus propias direcciones."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Dirección eliminada exitosamente.", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado. No tiene permiso para eliminar esta dirección.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Dirección no encontrada.", content = @Content)
    })
    ResponseEntity<Void> eliminarDireccion(
            @Parameter(description = "ID de la dirección a eliminar.", required = true, example = "1")
            @PathVariable Integer idDireccion);

}