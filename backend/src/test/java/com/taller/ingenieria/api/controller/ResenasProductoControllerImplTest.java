package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.ResenaRequestDTO;
import com.taller.ingenieria.api.dto.response.ResenaResponseDTO;
import com.taller.ingenieria.api.service.ResenasProductoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResenasProductoControllerImplTest {

    @Mock
    private ResenasProductoService resenasProductoService;

    @InjectMocks
    private ResenasProductoControllerImpl resenasProductoController;

    private ResenaRequestDTO resenaRequest;
    private ResenaResponseDTO resenaResponse1;
    private ResenaResponseDTO resenaResponse2;

    @BeforeEach
    void setUp() {
        resenaRequest = new ResenaRequestDTO();
        resenaRequest.setIdUsuario(1);
        resenaRequest.setIdProducto(1);
        resenaRequest.setCalificacion(5);
        resenaRequest.setComentario("Excelente producto");

        resenaResponse1 = new ResenaResponseDTO(
            "Perfume Océano Fresco",
            "Juan Pérez",
            5,
            "Excelente producto",
            LocalDateTime.now()
        );

        resenaResponse2 = new ResenaResponseDTO(
            "Perfume Océano Fresco",
            "María García",
            4,
            "Muy buen producto",
            LocalDateTime.now()
        );
    }

    @Test
    void obtenerResenasPorProducto_DeberiaRetornarListaDeResenas() {
        // Arrange
        Long idProducto = 1L;
        List<ResenaResponseDTO> resenas = Arrays.asList(resenaResponse1, resenaResponse2);
        when(resenasProductoService.obtenerResenasPorProducto(idProducto)).thenReturn(resenas);

        // Act
        List<ResenaResponseDTO> result = resenasProductoController.obtenerResenasPorProducto(idProducto);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Juan Pérez", result.get(0).getUsuario());
        assertEquals("María García", result.get(1).getUsuario());
        assertEquals(5, result.get(0).getCalificacion());
        assertEquals(4, result.get(1).getCalificacion());
        
        verify(resenasProductoService).obtenerResenasPorProducto(idProducto);
    }

    @Test
    void obtenerResenasPorProducto_DeberiaRetornarListaVacia_CuandoNoHayResenas() {
        // Arrange
        Long idProducto = 1L;
        when(resenasProductoService.obtenerResenasPorProducto(idProducto)).thenReturn(Collections.emptyList());

        // Act
        List<ResenaResponseDTO> result = resenasProductoController.obtenerResenasPorProducto(idProducto);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.size());
        
        verify(resenasProductoService).obtenerResenasPorProducto(idProducto);
    }

    @Test
    void obtenerResenasPorProducto_DeberiaLlamarAlServicio() {
        // Arrange
        Long idProducto = 1L;
        when(resenasProductoService.obtenerResenasPorProducto(idProducto)).thenReturn(Collections.emptyList());

        // Act
        resenasProductoController.obtenerResenasPorProducto(idProducto);

        // Assert
        verify(resenasProductoService, times(1)).obtenerResenasPorProducto(idProducto);
    }

    @Test
    void obtenerResenasPorProducto_DeberiaRetornarUnaResena() {
        // Arrange
        Long idProducto = 1L;
        List<ResenaResponseDTO> resenas = Arrays.asList(resenaResponse1);
        when(resenasProductoService.obtenerResenasPorProducto(idProducto)).thenReturn(resenas);

        // Act
        List<ResenaResponseDTO> result = resenasProductoController.obtenerResenasPorProducto(idProducto);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Perfume Océano Fresco", result.get(0).getProducto());
        assertEquals("Excelente producto", result.get(0).getComentario());
        
        verify(resenasProductoService).obtenerResenasPorProducto(idProducto);
    }

    @Test
    void publicarResena_DeberiaRetornarCreated_CuandoResenaEsPublicadaExitosamente() {
        // Arrange
        doNothing().when(resenasProductoService).publicarResena(any(ResenaRequestDTO.class));

        // Act
        ResponseEntity<?> result = resenasProductoController.publicarResena(resenaRequest);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNull(result.getBody());
        
        verify(resenasProductoService).publicarResena(resenaRequest);
    }

    @Test
    void publicarResena_DeberiaLlamarAlServicio() {
        // Arrange
        doNothing().when(resenasProductoService).publicarResena(any(ResenaRequestDTO.class));

        // Act
        resenasProductoController.publicarResena(resenaRequest);

        // Assert
        verify(resenasProductoService, times(1)).publicarResena(any(ResenaRequestDTO.class));
    }

    @Test
    void publicarResena_DeberiaRetornarConflict_CuandoResenaYaExiste() {
        // Arrange
        ResponseStatusException exception = new ResponseStatusException(
            HttpStatus.CONFLICT, 
            "El usuario ya ha publicado una reseña para este producto."
        );
        doThrow(exception).when(resenasProductoService).publicarResena(any(ResenaRequestDTO.class));

        // Act
        ResponseEntity<?> result = resenasProductoController.publicarResena(resenaRequest);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.CONFLICT, result.getStatusCode());
        assertEquals("El usuario ya ha publicado una reseña para este producto.", result.getBody());
        
        verify(resenasProductoService).publicarResena(resenaRequest);
    }

    @Test
    void publicarResena_DeberiaRetornarMensajeDeError_EnCasoDeConflicto() {
        // Arrange
        String mensajeError = "El usuario ya ha publicado una reseña para este producto.";
        ResponseStatusException exception = new ResponseStatusException(HttpStatus.CONFLICT, mensajeError);
        doThrow(exception).when(resenasProductoService).publicarResena(any(ResenaRequestDTO.class));

        // Act
        ResponseEntity<?> result = resenasProductoController.publicarResena(resenaRequest);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.CONFLICT, result.getStatusCode());
        assertEquals(mensajeError, result.getBody());
        
        verify(resenasProductoService).publicarResena(resenaRequest);
    }

    @Test
    void publicarResena_DeberiaRetornarStatusCorrecto_EnCasoDeExcepcion() {
        // Arrange
        ResponseStatusException exception = new ResponseStatusException(
            HttpStatus.BAD_REQUEST, 
            "Datos inválidos"
        );
        doThrow(exception).when(resenasProductoService).publicarResena(any(ResenaRequestDTO.class));

        // Act
        ResponseEntity<?> result = resenasProductoController.publicarResena(resenaRequest);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        
        verify(resenasProductoService).publicarResena(resenaRequest);
    }

    @Test
    void publicarResena_DeberiaLlamarAlServicioConRequestCorrecto() {
        // Arrange
        doNothing().when(resenasProductoService).publicarResena(resenaRequest);

        // Act
        resenasProductoController.publicarResena(resenaRequest);

        // Assert
        verify(resenasProductoService).publicarResena(resenaRequest);
    }

    @Test
    void publicarResena_NoDeberiaRetornarBody_CuandoEsExitoso() {
        // Arrange
        doNothing().when(resenasProductoService).publicarResena(any(ResenaRequestDTO.class));

        // Act
        ResponseEntity<?> result = resenasProductoController.publicarResena(resenaRequest);

        // Assert
        assertNull(result.getBody());
        assertEquals(HttpStatus.CREATED, result.getStatusCode());
    }

    @Test
    void publicarResena_DeberiaRetornarBody_CuandoHayError() {
        // Arrange
        ResponseStatusException exception = new ResponseStatusException(
            HttpStatus.CONFLICT, 
            "El usuario ya ha publicado una reseña para este producto."
        );
        doThrow(exception).when(resenasProductoService).publicarResena(any(ResenaRequestDTO.class));

        // Act
        ResponseEntity<?> result = resenasProductoController.publicarResena(resenaRequest);

        // Assert
        assertNotNull(result.getBody());
        assertTrue(result.getBody() instanceof String);
    }
}
