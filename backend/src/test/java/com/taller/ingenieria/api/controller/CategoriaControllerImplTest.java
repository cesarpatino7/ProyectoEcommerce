package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.CategoriaRequestDTO;
import com.taller.ingenieria.api.dto.response.CategoriaResponseDTO;
import com.taller.ingenieria.api.service.CategoriaService;
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
class CategoriaControllerImplTest {

    @Mock
    private CategoriaService categoriaService;

    @InjectMocks
    private CategoriaControllerImpl categoriaController;

    private CategoriaRequestDTO categoriaRequest;
    private CategoriaResponseDTO categoriaResponse;

    @BeforeEach
    void setUp() {
        categoriaRequest = new CategoriaRequestDTO();
        categoriaRequest.setNombre("Electrónica");
        categoriaRequest.setDescripcion("Productos electrónicos");

        categoriaResponse = new CategoriaResponseDTO();
        categoriaResponse.setId(1);
        categoriaResponse.setNombre("Electrónica");
        categoriaResponse.setDescripcion("Productos electrónicos");
    }

    @Test
    void crearCategoria_DeberiaRetornarCategoriaCreada() {
        // Arrange
        when(categoriaService.crearCategoria(any(CategoriaRequestDTO.class))).thenReturn(categoriaResponse);

        // Act
        ResponseEntity<CategoriaResponseDTO> result = categoriaController.crearCategoria(categoriaRequest);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals("Electrónica", result.getBody().getNombre());
        verify(categoriaService).crearCategoria(any(CategoriaRequestDTO.class));
    }

    @Test
    void obtenerTodasLasCategorias_DeberiaRetornarListaDeCategorias() {
        // Arrange
        List<CategoriaResponseDTO> categorias = Arrays.asList(categoriaResponse);
        when(categoriaService.obtenerTodasLasCategorias()).thenReturn(categorias);

        // Act
        ResponseEntity<List<CategoriaResponseDTO>> result = categoriaController.obtenerTodasLasCategorias();

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(1, result.getBody().size());
        verify(categoriaService).obtenerTodasLasCategorias();
    }

    @Test
    void obtenerCategoriaPorId_DeberiaRetornarCategoria_CuandoIdExiste() {
        // Arrange
        when(categoriaService.obtenerCategoriaPorId(1)).thenReturn(categoriaResponse);

        // Act
        ResponseEntity<CategoriaResponseDTO> result = categoriaController.obtenerCategoriaPorId(1);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(1, result.getBody().getId());
        verify(categoriaService).obtenerCategoriaPorId(1);
    }

    @Test
    void actualizarCategoria_DeberiaRetornarCategoriaActualizada() {
        // Arrange
        categoriaResponse.setNombre("Electrónica Actualizada");
        when(categoriaService.actualizarCategoria(eq(1), any(CategoriaRequestDTO.class))).thenReturn(categoriaResponse);

        // Act
        ResponseEntity<CategoriaResponseDTO> result = categoriaController.actualizarCategoria(1, categoriaRequest);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals("Electrónica Actualizada", result.getBody().getNombre());
        verify(categoriaService).actualizarCategoria(eq(1), any(CategoriaRequestDTO.class));
    }

    @Test
    void eliminarCategoria_DeberiaRetornarNoContent() {
        // Arrange
        doNothing().when(categoriaService).eliminarCategoria(1);

        // Act
        ResponseEntity<Void> result = categoriaController.eliminarCategoria(1);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
        assertNull(result.getBody());
        verify(categoriaService).eliminarCategoria(1);
    }
}
