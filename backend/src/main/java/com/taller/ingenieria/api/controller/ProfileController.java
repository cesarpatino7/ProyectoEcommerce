package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UsuarioUpdateRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

public interface ProfileController {

    /**
     * Obtiene el perfil del usuario actualmente autenticado.
     * La información del usuario se extrae del contexto de seguridad.
     *
     * @return ResponseEntity con el DTO del perfil del usuario y estado 200 OK.
     */
    ResponseEntity<UsuarioPerfilResponseDTO> obtenerMiPerfil();

    /**
     * Actualiza el perfil del usuario actualmente autenticado.
     *
     * @param requestDTO DTO con los datos a actualizar (nombre, apellido, teléfono).
     * @return ResponseEntity con el DTO del perfil actualizado y estado 200 OK.
     */
    ResponseEntity<UsuarioPerfilResponseDTO> actualizarMiPerfil(@RequestBody UsuarioUpdateRequestDTO requestDTO);

}