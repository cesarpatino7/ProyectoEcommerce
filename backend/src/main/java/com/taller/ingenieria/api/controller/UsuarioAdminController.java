package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.AdminUsuarioCreateRequestDTO;
import com.taller.ingenieria.api.dto.request.UsuarioUpdateRequestDTO;
import com.taller.ingenieria.api.dto.response.RolResponseDTO;
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

import java.util.List;

@Tag(name = "Administración de Usuarios", description = "Endpoints para la gestión de usuarios por parte de un Super Administrador.")
@SecurityRequirement(name = "bearerAuth")
public interface UsuarioAdminController {

    @Operation(
            summary = "Crear un nuevo usuario con un rol específico",
            description = "Permite a un SUPER_ADMIN crear un nuevo usuario en el sistema y asignarle un rol específico " +
                    "(1. ROLE_CUSTOMER ; 2. ROLE_PRODUCT_MANAGER ; 3. ROLE_ORDER_MANAGER ; 4. ROLE_SUPER_ADMIN). No se permite crear usuarios con el rol CUSTOMER desde este endpoint."
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
    ResponseEntity<UsuarioPerfilResponseDTO> crearUsuarioAdmin(@RequestBody AdminUsuarioCreateRequestDTO requestDTO);

    ResponseEntity<List<UsuarioPerfilResponseDTO>> obtenerTodosLosUsuarios();

    ResponseEntity<UsuarioPerfilResponseDTO> actualizarUsuario(Integer id, UsuarioUpdateRequestDTO requestDTO);

    ResponseEntity<Void> eliminarUsuario(Integer id);

    ResponseEntity<List<RolResponseDTO>> obtenerRolesDeAdmin();


}