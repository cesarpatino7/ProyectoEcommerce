package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.UsuarioRegistroRequestDTO;
import com.taller.ingenieria.api.dto.request.UsuarioUpdateRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import com.taller.ingenieria.api.dto.response.UsuarioRegistroResponseDTO;
import com.taller.ingenieria.api.model.Usuario;

import java.util.List;

public interface UsuarioService {

    UsuarioRegistroResponseDTO registrarUsuario(UsuarioRegistroRequestDTO requestDTO);

    UsuarioPerfilResponseDTO obtenerUsuarioPorId(Integer id);

    UsuarioPerfilResponseDTO obtenerUsuarioPorEmail(String email);

    List<UsuarioPerfilResponseDTO> obtenerTodosLosUsuarios();

    UsuarioPerfilResponseDTO actualizarUsuario(Integer id, UsuarioUpdateRequestDTO requestDTO);
}
