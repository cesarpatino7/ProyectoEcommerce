package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UsuarioRegistroRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import com.taller.ingenieria.api.dto.response.UsuarioRegistroResponseDTO;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface UsuarioController {

    ResponseEntity<UsuarioRegistroResponseDTO> registrarUsuario(UsuarioRegistroRequestDTO requestDTO);

    ResponseEntity<UsuarioPerfilResponseDTO> obtenerUsuarioPorId(Integer id);

    ResponseEntity<UsuarioPerfilResponseDTO> obtenerUsuarioPorEmail(@PathVariable String email);

    ResponseEntity<List<UsuarioPerfilResponseDTO>> obtenerTodosLosUsuarios();

}