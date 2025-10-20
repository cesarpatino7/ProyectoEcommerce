package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.UsuarioRegistroRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import com.taller.ingenieria.api.dto.response.UsuarioRegistroResponseDTO;
import com.taller.ingenieria.api.exception.EmailAlreadyExistsException;
import com.taller.ingenieria.api.exception.ResourceNotFoundException;
import com.taller.ingenieria.api.model.Rol;
import com.taller.ingenieria.api.model.Usuario;
import com.taller.ingenieria.api.repository.RolRepository;
import com.taller.ingenieria.api.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private RolRepository rolRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    private Usuario usuario;
    private Rol rol;
    private UsuarioRegistroRequestDTO registroRequest;

    @BeforeEach
    void setUp() {
        rol = new Rol();
        rol.setId(1);
        rol.setDescripcion("ROLE_CUSTOMER");

        usuario = new Usuario();
        usuario.setId(1);
        usuario.setNombre("Test");
        usuario.setApellido("User");
        usuario.setEmail("test@example.com");
        usuario.setPassword("encodedPassword");
        usuario.setTelefono("0981123456");
        usuario.setRol(rol);

        registroRequest = new UsuarioRegistroRequestDTO();
        registroRequest.setNombre("Test");
        registroRequest.setApellido("User");
        registroRequest.setEmail("test@example.com");
        registroRequest.setPassword("Password123!");
    }

    @Test
    void registrarUsuario_DeberiaRetornarUsuarioRegistrado() {
        // Arrange
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(rolRepository.findByDescripcion("ROLE_CUSTOMER")).thenReturn(Optional.of(rol));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        // Act
        UsuarioRegistroResponseDTO result = usuarioService.registrarUsuario(registroRequest);

        // Assert
        assertNotNull(result);
        verify(usuarioRepository).findByEmail(anyString());
        verify(rolRepository).findByDescripcion("ROLE_CUSTOMER");
        verify(passwordEncoder).encode(anyString());
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void registrarUsuario_DeberiaLanzarExcepcion_CuandoEmailYaExiste() {
        // Arrange
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.of(usuario));

        // Act & Assert
        assertThrows(EmailAlreadyExistsException.class, () -> {
            usuarioService.registrarUsuario(registroRequest);
        });
        verify(usuarioRepository).findByEmail(anyString());
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void obtenerUsuarioPorId_DeberiaRetornarUsuario_CuandoIdExiste() {
        // Arrange
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));

        // Act
        UsuarioPerfilResponseDTO result = usuarioService.obtenerUsuarioPorId(1);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Test", result.getNombre());
        assertEquals("test@example.com", result.getEmail());
        verify(usuarioRepository).findById(1);
    }

    @Test
    void obtenerUsuarioPorId_DeberiaLanzarExcepcion_CuandoIdNoExiste() {
        // Arrange
        when(usuarioRepository.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            usuarioService.obtenerUsuarioPorId(999);
        });
        verify(usuarioRepository).findById(999);
    }

    @Test
    void obtenerUsuarioPorEmail_DeberiaRetornarUsuario_CuandoEmailExiste() {
        // Arrange
        when(usuarioRepository.findByEmail("test@example.com")).thenReturn(Optional.of(usuario));

        // Act
        UsuarioPerfilResponseDTO result = usuarioService.obtenerUsuarioPorEmail("test@example.com");

        // Assert
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        verify(usuarioRepository).findByEmail("test@example.com");
    }

    @Test
    void obtenerUsuarioPorEmail_DeberiaLanzarExcepcion_CuandoEmailNoExiste() {
        // Arrange
        when(usuarioRepository.findByEmail("noexiste@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            usuarioService.obtenerUsuarioPorEmail("noexiste@example.com");
        });
        verify(usuarioRepository).findByEmail("noexiste@example.com");
    }

    @Test
    void obtenerTodosLosUsuarios_DeberiaRetornarListaDeUsuarios() {
        // Arrange
        List<Usuario> usuarios = Arrays.asList(usuario);
        when(usuarioRepository.findAll()).thenReturn(usuarios);

        // Act
        List<UsuarioPerfilResponseDTO> result = usuarioService.obtenerTodosLosUsuarios();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(usuarioRepository).findAll();
    }
}
