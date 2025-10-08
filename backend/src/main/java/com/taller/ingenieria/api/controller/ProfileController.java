package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import org.springframework.http.ResponseEntity;

public interface ProfileController {

    /**
     * Obtiene el perfil del usuario actualmente autenticado.
     * La información del usuario se extrae del contexto de seguridad.
     *
     * @return ResponseEntity con el DTO del perfil del usuario y estado 200 OK.
     */
    ResponseEntity<UsuarioPerfilResponseDTO> obtenerMiPerfil();

}