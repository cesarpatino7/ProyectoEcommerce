package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UsuarioUpdateRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import com.taller.ingenieria.api.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileControllerImplTest {

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private ProfileControllerImpl profileController;

    private UsuarioPerfilResponseDTO perfilResponse;
    private UsuarioUpdateRequestDTO updateRequest;

    @BeforeEach
    void setUp() {
        perfilResponse = new UsuarioPerfilResponseDTO();
        perfilResponse.setId(1);
        perfilResponse.setNombre("Test");
        perfilResponse.setApellido("User");
        perfilResponse.setEmail("test@example.com");
        perfilResponse.setTelefono("0981123456");

        updateRequest = new UsuarioUpdateRequestDTO();
        updateRequest.setNombre("Test Actualizado");
        updateRequest.setApellido("User Actualizado");
        updateRequest.setTelefono("0987654321");
    }

    @Test
    void obtenerMiPerfil_DeberiaRetornarPerfilDelUsuario() {
        // Arrange
        when(usuarioService.obtenerMiPerfil()).thenReturn(perfilResponse);

        // Act
        ResponseEntity<UsuarioPerfilResponseDTO> result = profileController.obtenerMiPerfil();

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(1, result.getBody().getId());
        assertEquals("Test", result.getBody().getNombre());
        assertEquals("test@example.com", result.getBody().getEmail());
        verify(usuarioService).obtenerMiPerfil();
    }

    @Test
    void obtenerMiPerfil_DeberiaLlamarAlServicio() {
        // Arrange
        when(usuarioService.obtenerMiPerfil()).thenReturn(perfilResponse);

        // Act
        profileController.obtenerMiPerfil();

        // Assert
        verify(usuarioService, times(1)).obtenerMiPerfil();
    }

    @Test
    void actualizarMiPerfil_DeberiaRetornarPerfilActualizado() {
        // Arrange
        perfilResponse.setNombre("Test Actualizado");
        perfilResponse.setApellido("User Actualizado");
        when(usuarioService.actualizarMiPerfil(any(UsuarioUpdateRequestDTO.class))).thenReturn(perfilResponse);

        // Act
        ResponseEntity<UsuarioPerfilResponseDTO> result = profileController.actualizarMiPerfil(updateRequest);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals("Test Actualizado", result.getBody().getNombre());
        assertEquals("User Actualizado", result.getBody().getApellido());
        verify(usuarioService).actualizarMiPerfil(any(UsuarioUpdateRequestDTO.class));
    }

    @Test
    void actualizarMiPerfil_DeberiaLlamarAlServicioConRequestCorrecto() {
        // Arrange
        when(usuarioService.actualizarMiPerfil(updateRequest)).thenReturn(perfilResponse);

        // Act
        profileController.actualizarMiPerfil(updateRequest);

        // Assert
        verify(usuarioService).actualizarMiPerfil(updateRequest);
    }
}
