package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.CategoriaRequestDTO;
import com.taller.ingenieria.api.dto.response.CategoriaResponseDTO;
import com.taller.ingenieria.api.exception.ResourceNotFoundException;
import com.taller.ingenieria.api.model.Categoria;
import com.taller.ingenieria.api.repository.CategoriaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceImplTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private CategoriaServiceImpl categoriaService;

    private Categoria categoria;
    private CategoriaRequestDTO categoriaRequest;

    @BeforeEach
    void setUp() {
        categoria = new Categoria();
        categoria.setId(1);
        categoria.setNombre("Electrónica");
        categoria.setDescripcion("Productos electrónicos");
        categoria.setCreatedAt(Instant.now());

        categoriaRequest = new CategoriaRequestDTO();
        categoriaRequest.setNombre("Electrónica");
        categoriaRequest.setDescripcion("Productos electrónicos");
    }

    @Test
    void crearCategoria_DeberiaRetornarCategoriaCreada() {
        // Arrange
        when(categoriaRepository.save(any(Categoria.class))).thenReturn(categoria);

        // Act
        CategoriaResponseDTO result = categoriaService.crearCategoria(categoriaRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Electrónica", result.getNombre());
        assertEquals("Productos electrónicos", result.getDescripcion());
        verify(categoriaRepository).save(any(Categoria.class));
    }

    @Test
    void obtenerTodasLasCategorias_DeberiaRetornarListaDeCategorias() {
        // Arrange
        List<Categoria> categorias = Arrays.asList(categoria);
        when(categoriaRepository.findAll()).thenReturn(categorias);

        // Act
        List<CategoriaResponseDTO> result = categoriaService.obtenerTodasLasCategorias();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Electrónica", result.get(0).getNombre());
        verify(categoriaRepository).findAll();
    }

    @Test
    void obtenerCategoriaPorId_DeberiaRetornarCategoria_CuandoIdExiste() {
        // Arrange
        when(categoriaRepository.findById(1)).thenReturn(Optional.of(categoria));

        // Act
        CategoriaResponseDTO result = categoriaService.obtenerCategoriaPorId(1);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Electrónica", result.getNombre());
        verify(categoriaRepository).findById(1);
    }

    @Test
    void obtenerCategoriaPorId_DeberiaLanzarExcepcion_CuandoIdNoExiste() {
        // Arrange
        when(categoriaRepository.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            categoriaService.obtenerCategoriaPorId(999);
        });
        verify(categoriaRepository).findById(999);
    }

    @Test
    void actualizarCategoria_DeberiaRetornarCategoriaActualizada() {
        // Arrange
        categoriaRequest.setNombre("Electrónica Actualizada");
        when(categoriaRepository.findById(1)).thenReturn(Optional.of(categoria));
        when(categoriaRepository.save(any(Categoria.class))).thenReturn(categoria);

        // Act
        CategoriaResponseDTO result = categoriaService.actualizarCategoria(1, categoriaRequest);

        // Assert
        assertNotNull(result);
        verify(categoriaRepository).findById(1);
        verify(categoriaRepository).save(any(Categoria.class));
    }

    @Test
    void actualizarCategoria_DeberiaLanzarExcepcion_CuandoIdNoExiste() {
        // Arrange
        when(categoriaRepository.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            categoriaService.actualizarCategoria(999, categoriaRequest);
        });
        verify(categoriaRepository).findById(999);
        verify(categoriaRepository, never()).save(any(Categoria.class));
    }

    @Test
    void eliminarCategoria_DeberiaEliminarCategoria_CuandoIdExiste() {
        // Arrange
        when(categoriaRepository.findById(1)).thenReturn(Optional.of(categoria));
        doNothing().when(categoriaRepository).delete(categoria);

        // Act
        categoriaService.eliminarCategoria(1);

        // Assert
        verify(categoriaRepository).findById(1);
        verify(categoriaRepository).delete(categoria);
    }

    @Test
    void eliminarCategoria_DeberiaLanzarExcepcion_CuandoIdNoExiste() {
        // Arrange
        when(categoriaRepository.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            categoriaService.eliminarCategoria(999);
        });
        verify(categoriaRepository).findById(999);
        verify(categoriaRepository, never()).delete(any(Categoria.class));
    }
}
