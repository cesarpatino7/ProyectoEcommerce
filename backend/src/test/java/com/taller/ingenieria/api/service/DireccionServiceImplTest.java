package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.DireccionRequestDTO;
import com.taller.ingenieria.api.dto.response.DireccionResponseDTO;
import com.taller.ingenieria.api.exception.ResourceNotFoundException;
import com.taller.ingenieria.api.model.Ciudad;
import com.taller.ingenieria.api.model.Departamento;
import com.taller.ingenieria.api.model.Direccion;
import com.taller.ingenieria.api.model.Rol;
import com.taller.ingenieria.api.model.Usuario;
import com.taller.ingenieria.api.repository.CiudadRepository;
import com.taller.ingenieria.api.repository.DireccionRepository;
import com.taller.ingenieria.api.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DireccionServiceImplTest {

    @Mock
    private DireccionRepository direccionRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private CiudadRepository ciudadRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private DireccionServiceImpl direccionService;

    private Usuario usuario;
    private Direccion direccion;
    private Ciudad ciudad;
    private Departamento departamento;
    private DireccionRequestDTO direccionRequest;

    @BeforeEach
    void setUp() {
        Rol rol = new Rol();
        rol.setId(1);
        rol.setDescripcion("ROLE_CUSTOMER");

        usuario = new Usuario();
        usuario.setId(1);
        usuario.setNombre("Test");
        usuario.setApellido("User");
        usuario.setEmail("test@example.com");
        usuario.setRol(rol);

        departamento = new Departamento();
        departamento.setId(1);
        departamento.setNombre("Central");

        ciudad = new Ciudad();
        ciudad.setId(1);
        ciudad.setNombre("Asunción");
        ciudad.setIdDepartamento(departamento);

        direccion = new Direccion();
        direccion.setId(1);
        direccion.setDescripcionCalle("Av. Siempre Viva 742");
        direccion.setIdUsuario(usuario);
        direccion.setIdCiudad(ciudad);

        direccionRequest = new DireccionRequestDTO();
        direccionRequest.setDescripcionCalle("Av. Siempre Viva 742");
        direccionRequest.setIdCiudad(1);

        // Mock del contexto de seguridad
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("test@example.com");
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void obtenerMisDirecciones_DeberiaRetornarListaDeDirecciones() {
        // Arrange
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.of(usuario));
        when(direccionRepository.findByIdUsuario_Id(1)).thenReturn(Arrays.asList(direccion));

        // Act
        List<DireccionResponseDTO> result = direccionService.obtenerMisDirecciones();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(usuarioRepository).findByEmail(anyString());
        verify(direccionRepository).findByIdUsuario_Id(1);
    }

    @Test
    void crearDireccion_DeberiaRetornarDireccionCreada() {
        // Arrange
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.of(usuario));
        when(ciudadRepository.findById(1)).thenReturn(Optional.of(ciudad));
        when(direccionRepository.save(any(Direccion.class))).thenReturn(direccion);

        // Act
        DireccionResponseDTO result = direccionService.crearDireccion(direccionRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Av. Siempre Viva 742", result.getDescripcionCalle());
        verify(usuarioRepository).findByEmail(anyString());
        verify(ciudadRepository).findById(1);
        verify(direccionRepository).save(any(Direccion.class));
    }

    @Test
    void crearDireccion_DeberiaLanzarExcepcion_CuandoCiudadNoExiste() {
        // Arrange
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.of(usuario));
        when(ciudadRepository.findById(999)).thenReturn(Optional.empty());
        direccionRequest.setIdCiudad(999);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            direccionService.crearDireccion(direccionRequest);
        });
        verify(ciudadRepository).findById(999);
        verify(direccionRepository, never()).save(any(Direccion.class));
    }

    @Test
    void actualizarDireccion_DeberiaRetornarDireccionActualizada() {
        // Arrange
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.of(usuario));
        when(direccionRepository.findById(1)).thenReturn(Optional.of(direccion));
        when(ciudadRepository.findById(1)).thenReturn(Optional.of(ciudad));
        when(direccionRepository.save(any(Direccion.class))).thenReturn(direccion);

        // Act
        DireccionResponseDTO result = direccionService.actualizarDireccion(1, direccionRequest);

        // Assert
        assertNotNull(result);
        verify(usuarioRepository).findByEmail(anyString());
        verify(direccionRepository).findById(1);
        verify(ciudadRepository).findById(1);
        verify(direccionRepository).save(any(Direccion.class));
    }

    @Test
    void actualizarDireccion_DeberiaLanzarExcepcion_CuandoDireccionNoExiste() {
        // Arrange
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.of(usuario));
        when(direccionRepository.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            direccionService.actualizarDireccion(999, direccionRequest);
        });
        verify(direccionRepository).findById(999);
        verify(direccionRepository, never()).save(any(Direccion.class));
    }

    @Test
    void eliminarDireccion_DeberiaEliminarDireccion_CuandoDireccionExiste() {
        // Arrange
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.of(usuario));
        when(direccionRepository.findById(1)).thenReturn(Optional.of(direccion));
        doNothing().when(direccionRepository).delete(direccion);

        // Act
        direccionService.eliminarDireccion(1);

        // Assert
        verify(usuarioRepository).findByEmail(anyString());
        verify(direccionRepository).findById(1);
        verify(direccionRepository).delete(direccion);
    }

    @Test
    void eliminarDireccion_DeberiaLanzarExcepcion_CuandoDireccionNoExiste() {
        // Arrange
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.of(usuario));
        when(direccionRepository.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            direccionService.eliminarDireccion(999);
        });
        verify(direccionRepository).findById(999);
        verify(direccionRepository, never()).delete(any(Direccion.class));
    }
}
