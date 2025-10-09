package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UsuarioRegistroRequestDTO;
import com.taller.ingenieria.api.dto.request.UsuarioUpdateRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import com.taller.ingenieria.api.dto.response.UsuarioRegistroResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Tag(name = "Administración de Usuarios (General)", description = "Endpoints para el registro público de clientes y la gestión de usuarios por parte de administradores.")
public interface UsuarioController {

    @Operation(
            summary = "Registrar un nuevo usuario (Cliente)",
            description = "Endpoint público para que un nuevo usuario se registre en el sistema. Por defecto, se le asignará el rol 'ROLE_CUSTOMER'."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuario registrado exitosamente.", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = UsuarioRegistroResponseDTO.class)) }),
            @ApiResponse(responseCode = "409", description = "Conflicto. El correo electrónico proporcionado ya se encuentra registrado.", content = @Content)
    })
    ResponseEntity<UsuarioRegistroResponseDTO> registrarUsuario(@RequestBody UsuarioRegistroRequestDTO requestDTO);

    @Operation(
            summary = "Obtener todos los usuarios (Admin)",
            description = "Devuelve una lista de todos los usuarios del sistema. Requiere rol de SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente.", content = { @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = UsuarioPerfilResponseDTO.class))) }),
            @ApiResponse(responseCode = "403", description = "Acceso denegado.", content = @Content)
    })
    ResponseEntity<List<UsuarioPerfilResponseDTO>> obtenerTodosLosUsuarios();

    @Operation(
            summary = "Obtener un usuario por ID (Admin)",
            description = "Busca y devuelve el perfil de un usuario específico por su ID. Requiere rol de SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario encontrado.", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = UsuarioPerfilResponseDTO.class)) }),
            @ApiResponse(responseCode = "403", description = "Acceso denegado.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado.", content = @Content)
    })
    ResponseEntity<UsuarioPerfilResponseDTO> obtenerUsuarioPorId(
            @Parameter(description = "ID del usuario a buscar.", required = true, example = "1")
            @PathVariable Integer id);

    @Operation(
            summary = "Obtener un usuario por Email (Admin)",
            description = "Busca y devuelve el perfil de un usuario específico por su dirección de email. Requiere rol de SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario encontrado.", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = UsuarioPerfilResponseDTO.class)) }),
            @ApiResponse(responseCode = "403", description = "Acceso denegado.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado.", content = @Content)
    })
    ResponseEntity<UsuarioPerfilResponseDTO> obtenerUsuarioPorEmail(
            @Parameter(description = "Email del usuario a buscar.", required = true, example = "juan.perez@example.com")
            @RequestParam String email);

    @Operation(
            summary = "Actualizar un usuario por ID (Admin)",
            description = "Actualiza los datos de un usuario existente (nombre, apellido, teléfono). Requiere rol de SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario actualizado exitosamente.", content = { @Content(mediaType = "application/json", schema = @Schema(implementation = UsuarioPerfilResponseDTO.class)) }),
            @ApiResponse(responseCode = "403", description = "Acceso denegado.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado.", content = @Content)
    })
    ResponseEntity<UsuarioPerfilResponseDTO> actualizarUsuario(
            @Parameter(description = "ID del usuario a actualizar.", required = true, example = "1")
            @PathVariable Integer id,
            @RequestBody UsuarioUpdateRequestDTO requestDTO);

    @Operation(
            summary = "Eliminar un usuario por ID (Admin)",
            description = "Elimina un usuario del sistema. Esta es una operación destructiva. Requiere rol de SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Usuario eliminado exitosamente.", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado.", content = @Content)
    })
    ResponseEntity<Void> eliminarUsuario(
            @Parameter(description = "ID del usuario a eliminar.", required = true, example = "1")
            @PathVariable Integer id);
}