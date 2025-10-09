package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UsuarioLoginRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioLoginResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

@Tag(name = "Autenticación", description = "Endpoints para el inicio y cierre de sesión de usuarios.")
public interface AuthController {

    @Operation(
            summary = "Iniciar sesión de un usuario",
            description = "Autentica a un usuario con su email y contraseña. Si las credenciales son válidas, " +
                    "devuelve los datos del usuario junto con un token JWT que debe ser utilizado " +
                    "para autorizar las siguientes peticiones a endpoints protegidos."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Autenticación exitosa.",
                    content = { @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UsuarioLoginResponseDTO.class)) }
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "No autorizado. El email o la contraseña son incorrectos.",
                    content = @Content
            )
    })
    ResponseEntity<UsuarioLoginResponseDTO> login(UsuarioLoginRequestDTO loginRequest);


    @Operation(
            summary = "Cerrar sesión de un usuario",
            description = "Invalida el token JWT actual del usuario, añadiéndolo a una lista negra en el servidor. " +
                    "El cliente debe enviar el token JWT en la cabecera 'Authorization' para que pueda ser invalidado. " +
                    "Después de esta operación, el token ya no será válido para acceder a recursos protegidos."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Logout exitoso. El token ha sido invalidado.",
                    content = { @Content(mediaType = "text/plain") }
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Acceso denegado. Se requiere un token válido para cerrar la sesión.",
                    content = @Content
            )
    })
    ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response);

}
