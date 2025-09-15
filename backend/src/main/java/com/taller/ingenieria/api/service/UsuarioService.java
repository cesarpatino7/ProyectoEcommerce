package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.UsuarioRegistroRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import com.taller.ingenieria.api.model.Usuario;

public interface UsuarioService {

    Usuario registrarUsuario(UsuarioRegistroRequestDTO requestDTO);

    UsuarioPerfilResponseDTO obtenerUsuarioPorId(Integer id);

}
