package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.DireccionRequestDTO;
import com.taller.ingenieria.api.dto.response.DireccionResponseDTO;
import com.taller.ingenieria.api.service.DireccionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DireccionControllerImplTest {

    @Mock
    private DireccionService direccionService;

    @InjectMocks
    private DireccionControllerImpl direccionController;

    private DireccionRequestDTO direccionRequest;
    private DireccionResponseDTO direccionResponse;

    @BeforeEach
    void setUp() {
        direccionRequest = new DireccionRequestDTO();
        direccionRequest.setDescripcionCalle("Av. Siempre Viva 742");
        direccionRequest.setIdCiudad(1);

        direccionResponse = new DireccionResponseDTO();
        direccionResponse.setId(1);
        direccionResponse.setDescripcionCalle("Av. Siempre Viva 742");
        direccionResponse.setNombreCiudad("Asunción");
        direccionResponse.setNombreDepartamento("Central");
    }

    @Test
    void obtenerMisDirecciones_DeberiaRetornarListaDeDirecciones() {
        // Arrange
        List<DireccionResponseDTO> direcciones = Arrays.asList(direccionResponse);
        when(direccionService.obtenerMisDirecciones()).thenReturn(direcciones);

        // Act
        ResponseEntity<List<DireccionResponseDTO>> result = direccionController.obtenerMisDirecciones();

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(1, result.getBody().size());
        verify(direccionService).obtenerMisDirecciones();
    }

    @Test
    void crearDireccion_DeberiaRetornarDireccionCreada() {
        // Arrange
        when(direccionService.crearDireccion(any(DireccionRequestDTO.class))).thenReturn(direccionResponse);

        // Act
        ResponseEntity<DireccionResponseDTO> result = direccionController.crearDireccion(direccionRequest);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals("Av. Siempre Viva 742", result.getBody().getDescripcionCalle());
        verify(direccionService).crearDireccion(any(DireccionRequestDTO.class));
    }

    @Test
    void actualizarDireccion_DeberiaRetornarDireccionActualizada() {
        // Arrange
        direccionResponse.setDescripcionCalle("Calle Actualizada 456");
        when(direccionService.actualizarDireccion(eq(1), any(DireccionRequestDTO.class))).thenReturn(direccionResponse);

        // Act
        ResponseEntity<DireccionResponseDTO> result = direccionController.actualizarDireccion(1, direccionRequest);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals("Calle Actualizada 456", result.getBody().getDescripcionCalle());
        verify(direccionService).actualizarDireccion(eq(1), any(DireccionRequestDTO.class));
    }

    @Test
    void eliminarDireccion_DeberiaRetornarNoContent() {
        // Arrange
        doNothing().when(direccionService).eliminarDireccion(1);

        // Act
        ResponseEntity<Void> result = direccionController.eliminarDireccion(1);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
        assertNull(result.getBody());
        verify(direccionService).eliminarDireccion(1);
    }

    @Test
    void eliminarDireccion_DeberiaLlamarAlServicioConIdCorrecto() {
        // Arrange
        doNothing().when(direccionService).eliminarDireccion(anyInt());

        // Act
        direccionController.eliminarDireccion(5);

        // Assert
        verify(direccionService).eliminarDireccion(5);
    }
}
