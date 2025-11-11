package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.AdminUsuarioCreateRequestDTO;
import com.taller.ingenieria.api.dto.request.UsuarioUpdateRequestDTO;
import com.taller.ingenieria.api.dto.response.RolResponseDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
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

@Tag(name = "Administración de Usuarios", description = "Endpoints para la gestión de usuarios por parte de un Super Administrador.")
@SecurityRequirement(name = "bearerAuth")
public interface UsuarioAdminController {

    @Operation(
            summary = "Crear un nuevo usuario con un rol específico",
            description = "Permite a un SUPER_ADMIN crear un nuevo usuario en el sistema y asignarle un rol específico " +
                    "(2. ROLE_PRODUCT_MANAGER ; 3. ROLE_ORDER_MANAGER ; 4. ROLE_SUPER_ADMIN). " +
                    "No se permite crear usuarios con el rol CUSTOMER desde este endpoint."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Usuario creado exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UsuarioPerfilResponseDTO.class)) }
            ),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos (ej. el email ya existe, el rol no es válido o es CUSTOMER).", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado. Se requiere rol de SUPER_ADMIN.", content = @Content)
    })
    ResponseEntity<UsuarioPerfilResponseDTO> crearUsuarioAdmin(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos del nuevo usuario administrador",
                    required = true,
                    content = @Content(schema = @Schema(implementation = AdminUsuarioCreateRequestDTO.class))
            )
            @RequestBody AdminUsuarioCreateRequestDTO requestDTO);

    @Operation(
            summary = "Obtener todos los usuarios del sistema",
            description = "Devuelve una lista de todos los usuarios registrados en el sistema. Requiere rol de SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de usuarios obtenida exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = UsuarioPerfilResponseDTO.class))) }
            ),
            @ApiResponse(responseCode = "403", description = "Acceso denegado. Se requiere rol de SUPER_ADMIN.", content = @Content)
    })
    ResponseEntity<List<UsuarioPerfilResponseDTO>> obtenerTodosLosUsuarios();

    @Operation(
            summary = "Actualizar un usuario",
            description = "Actualiza los datos de un usuario específico (nombre, apellido, teléfono). Requiere rol de SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuario actualizado exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UsuarioPerfilResponseDTO.class)) }
            ),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos.", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado. Se requiere rol de SUPER_ADMIN.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado.", content = @Content)
    })
    ResponseEntity<UsuarioPerfilResponseDTO> actualizarUsuario(
            @Parameter(description = "ID del usuario a actualizar", required = true, example = "1")
            @PathVariable Integer id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Nuevos datos del usuario",
                    required = true,
                    content = @Content(schema = @Schema(implementation = UsuarioUpdateRequestDTO.class))
            )
            @RequestBody UsuarioUpdateRequestDTO requestDTO);

    @Operation(
            summary = "Eliminar un usuario",
            description = "Elimina un usuario del sistema de forma permanente. Requiere rol de SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "Usuario eliminado exitosamente.",
                    content = @Content
            ),
            @ApiResponse(responseCode = "403", description = "Acceso denegado. Se requiere rol de SUPER_ADMIN.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado.", content = @Content)
    })
    ResponseEntity<Void> eliminarUsuario(
            @Parameter(description = "ID del usuario a eliminar", required = true, example = "1")
            @PathVariable Integer id);

    @Operation(
            summary = "Obtener roles de administrador disponibles",
            description = "Devuelve la lista de roles administrativos que pueden ser asignados a nuevos usuarios " +
                    "(excluyendo CUSTOMER). Requiere rol de SUPER_ADMIN."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de roles obtenida exitosamente.",
                    content = { @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = RolResponseDTO.class))) }
            ),
            @ApiResponse(responseCode = "403", description = "Acceso denegado. Se requiere rol de SUPER_ADMIN.", content = @Content)
    })
    ResponseEntity<List<RolResponseDTO>> obtenerRolesDeAdmin();
}