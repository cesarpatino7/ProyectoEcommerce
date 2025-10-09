package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.AdminUsuarioCreateRequestDTO;
import com.taller.ingenieria.api.dto.request.UsuarioLoginRequestDTO;
import com.taller.ingenieria.api.dto.request.UsuarioRegistroRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioLoginResponseDTO;
import com.taller.ingenieria.api.dto.request.UsuarioUpdateRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import com.taller.ingenieria.api.dto.response.UsuarioRegistroResponseDTO;
import com.taller.ingenieria.api.model.Usuario;

import java.util.List;

public interface UsuarioService {

    UsuarioRegistroResponseDTO registrarUsuario(UsuarioRegistroRequestDTO requestDTO);

    UsuarioPerfilResponseDTO obtenerUsuarioPorId(Integer id);

    UsuarioLoginResponseDTO loginUsuario(UsuarioLoginRequestDTO requestDTO);

    UsuarioPerfilResponseDTO obtenerUsuarioPorEmail(String email);

    List<UsuarioPerfilResponseDTO> obtenerTodosLosUsuarios();

    UsuarioPerfilResponseDTO actualizarUsuario(Integer id, UsuarioUpdateRequestDTO requestDTO);

    void eliminarUsuario(Integer id);

    /**
     * Obtiene el perfil del usuario actualmente autenticado a partir del contexto de seguridad.
     *
     * @return El DTO con la información del perfil del usuario.
     */
    UsuarioPerfilResponseDTO obtenerMiPerfil();

    /**
     * Actualiza los datos personales (nombre, apellido, teléfono) del usuario
     * autenticado actualmente en la sesión.
     *
     * @param requestDTO El DTO con la nueva información.
     * @return El DTO del perfil del usuario con los datos ya actualizados.
     */
    UsuarioPerfilResponseDTO actualizarMiPerfil(UsuarioUpdateRequestDTO requestDTO);

    /**
     * Crea un nuevo usuario con un rol específico.
     * Usado por administradores para crear otros usuarios con roles administrativos.
     * @param requestDTO Datos del usuario a crear, incluyendo el id del rol.
     * @return El perfil del usuario recién creado.
     */
    UsuarioPerfilResponseDTO crearUsuarioAdmin(AdminUsuarioCreateRequestDTO requestDTO);
}
