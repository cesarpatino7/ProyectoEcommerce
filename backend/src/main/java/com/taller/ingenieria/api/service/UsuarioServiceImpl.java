package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.UsuarioRegistroRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import com.taller.ingenieria.api.exception.EmailAlreadyExistsException;
import com.taller.ingenieria.api.exception.ResourceNotFoundException;
import com.taller.ingenieria.api.model.Rol;
import com.taller.ingenieria.api.model.Usuario;
import com.taller.ingenieria.api.repository.RolRepository;
import com.taller.ingenieria.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    public Usuario registrarUsuario(UsuarioRegistroRequestDTO requestDTO) {
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

        return usuarioRepository.save(nuevoUsuario);
    }


    @Override
    public UsuarioPerfilResponseDTO obtenerUsuarioPorId(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        UsuarioPerfilResponseDTO responseDTO = new UsuarioPerfilResponseDTO();
        responseDTO.setId(usuario.getId());
        responseDTO.setNombre(usuario.getNombre());
        responseDTO.setApellido(usuario.getApellido());
        responseDTO.setEmail(usuario.getEmail());
        responseDTO.setRol(usuario.getRol().getDescripcion());
        responseDTO.setTelefono(Optional.ofNullable(usuario.getTelefono()).orElse(""));

        return responseDTO;
    }
}