package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UsuarioUpdateRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Tag(name = "Perfil de Usuario", description = "Endpoints para que el usuario autenticado gestione su propio perfil.")
public interface ProfileController {

    @Operation(
            summary = "Obtener mi perfil",
            description = "Devuelve la información del perfil del usuario que está actualmente autenticado a través del token JWT."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Perfil de usuario obtenido exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UsuarioPerfilResponseDTO.class)) }
            ),
            @ApiResponse(responseCode = "403", description = "Acceso denegado. Se requiere un token válido.", content = @Content)
    })
    ResponseEntity<UsuarioPerfilResponseDTO> obtenerMiPerfil();

    @Operation(
            summary = "Actualizar mi perfil",
            description = "Actualiza los datos personales (nombre, apellido y/o teléfono) del usuario actualmente autenticado."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Perfil actualizado exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UsuarioPerfilResponseDTO.class)) }
            ),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos.", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado. Se requiere un token válido.", content = @Content)
    })
    ResponseEntity<UsuarioPerfilResponseDTO> actualizarMiPerfil(@RequestBody UsuarioUpdateRequestDTO requestDTO);

}