package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UsuarioLoginRequestDTO;
import com.taller.ingenieria.api.dto.request.UsuarioRegistroRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioLoginResponseDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import com.taller.ingenieria.api.dto.response.UsuarioRegistroResponseDTO;
import org.springframework.http.ResponseEntity;

public interface UsuarioController {

    ResponseEntity<UsuarioRegistroResponseDTO> registrarUsuario(UsuarioRegistroRequestDTO requestDTO);

    ResponseEntity<UsuarioPerfilResponseDTO> obtenerUsuarioPorId(Integer id); // 👈 Añade esta línea

    ResponseEntity<UsuarioLoginResponseDTO> loginUsuario(UsuarioLoginRequestDTO requestDTO);

}