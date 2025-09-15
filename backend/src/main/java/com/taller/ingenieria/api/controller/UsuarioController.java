package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UsuarioRegistroRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import com.taller.ingenieria.api.dto.response.UsuarioRegistroResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

public interface UsuarioController {

    ResponseEntity<UsuarioRegistroResponseDTO> registrarUsuario(UsuarioRegistroRequestDTO requestDTO);

    ResponseEntity<UsuarioPerfilResponseDTO> obtenerUsuarioPorId(Integer id);

    public ResponseEntity<UsuarioPerfilResponseDTO> obtenerUsuarioPorEmail(@PathVariable String email);
}