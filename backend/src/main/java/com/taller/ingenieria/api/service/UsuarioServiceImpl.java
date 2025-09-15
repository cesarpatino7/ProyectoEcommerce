package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.UsuarioLoginRequestDTO;
import com.taller.ingenieria.api.dto.request.UsuarioRegistroRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioLoginResponseDTO;
import com.taller.ingenieria.api.dto.request.UsuarioUpdateRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import com.taller.ingenieria.api.dto.response.UsuarioRegistroResponseDTO;
import com.taller.ingenieria.api.exception.EmailAlreadyExistsException;
import com.taller.ingenieria.api.exception.ResourceNotFoundException;
import com.taller.ingenieria.api.model.Rol;
import com.taller.ingenieria.api.model.Usuario;
import com.taller.ingenieria.api.repository.RolRepository;
import com.taller.ingenieria.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UsuarioRegistroResponseDTO registrarUsuario(UsuarioRegistroRequestDTO requestDTO) {
        if (usuarioRepository.findByEmail(requestDTO.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("El email '" + requestDTO.getEmail() + "' ya se encuentra registrado.");
        }

        Rol rolUsuario = rolRepository.findByDescripcion("Cliente")
                .orElseThrow(() -> new ResourceNotFoundException("Error: Rol 'Cliente' no encontrado."));

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(requestDTO.getNombre());
        nuevoUsuario.setApellido(requestDTO.getApellido());
        nuevoUsuario.setEmail(requestDTO.getEmail());
        nuevoUsuario.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
        nuevoUsuario.setRol(rolUsuario);

         return mapearAUsuarioRegistroResponseDTO(usuarioRepository.save(nuevoUsuario));
    }

    @Override
    public UsuarioPerfilResponseDTO obtenerUsuarioPorId(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        return mapearAUsuarioPerfilResponseDTO(usuario);
    }

    @Override
    public UsuarioPerfilResponseDTO obtenerUsuarioPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con el email: " + email));

        return mapearAUsuarioPerfilResponseDTO(usuario);
    }

    @Override
    public List<UsuarioPerfilResponseDTO> obtenerTodosLosUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<UsuarioPerfilResponseDTO> responseDTO = new ArrayList<>();
        for (Usuario usuario : usuarios) {
            responseDTO.add(mapearAUsuarioPerfilResponseDTO(usuario));
        }
        return responseDTO;
    }

    @Override
    public UsuarioLoginResponseDTO loginUsuario(UsuarioLoginRequestDTO requestDTO) {
        Usuario usuario = usuarioRepository.findByEmail(requestDTO.getEmail()).orElse(null);

        if (usuario == null || !passwordEncoder.matches(requestDTO.getPassword(), usuario.getPassword())) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        UsuarioLoginResponseDTO responseDTO = new UsuarioLoginResponseDTO();
        responseDTO.setId(usuario.getId());
        responseDTO.setNombre(usuario.getNombre());
        responseDTO.setApellido(usuario.getApellido());
        responseDTO.setEmail(usuario.getEmail());
        responseDTO.setRol(usuario.getRol().getDescripcion());

        return responseDTO;
    }

    @Override
    public UsuarioPerfilResponseDTO actualizarUsuario(Integer id, UsuarioUpdateRequestDTO requestDTO) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        usuarioExistente.setNombre(requestDTO.getNombre());
        usuarioExistente.setApellido(requestDTO.getApellido());
        usuarioExistente.setTelefono(requestDTO.getTelefono());

        Usuario usuarioActualizado = usuarioRepository.save(usuarioExistente);

        return mapearAUsuarioPerfilResponseDTO(usuarioActualizado);

    }

    private UsuarioPerfilResponseDTO mapearAUsuarioPerfilResponseDTO(Usuario usuario) {
        UsuarioPerfilResponseDTO usuarioResponse = new UsuarioPerfilResponseDTO();
        usuarioResponse.setNombre(usuario.getNombre());
        usuarioResponse.setApellido(usuario.getApellido());
        usuarioResponse.setId(usuario.getId());
        usuarioResponse.setEmail(usuario.getEmail());
        usuarioResponse.setRol(usuario.getRol().getDescripcion());
        usuarioResponse.setTelefono(Optional.ofNullable(usuario.getTelefono()).orElse(""));
        return usuarioResponse;
    }

    private UsuarioRegistroResponseDTO mapearAUsuarioRegistroResponseDTO(Usuario usuarioGuardado) {
        UsuarioRegistroResponseDTO usuarioResponse = new UsuarioRegistroResponseDTO();
        usuarioResponse.setId(usuarioGuardado.getId());
        usuarioResponse.setNombre(usuarioGuardado.getNombre());
        usuarioResponse.setApellido(usuarioGuardado.getApellido());
        usuarioResponse.setEmail(usuarioGuardado.getEmail());
        usuarioResponse.setRol(usuarioGuardado.getRol().getDescripcion());
        usuarioResponse.setTelefono(Optional.ofNullable(usuarioGuardado.getTelefono()).orElse(""));

        return usuarioResponse;
    }

}