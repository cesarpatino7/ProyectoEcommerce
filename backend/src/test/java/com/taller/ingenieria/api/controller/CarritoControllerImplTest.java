package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.AddItemRequestDTO;
import com.taller.ingenieria.api.dto.request.UpdateItemRequestDTO;
import com.taller.ingenieria.api.dto.response.CarritoResponseDTO;
import com.taller.ingenieria.api.service.CarritoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarritoControllerImplTest {

    @Mock
    private CarritoService carritoService;

    @InjectMocks
    private CarritoControllerImpl carritoController;

    private CarritoResponseDTO carritoResponse;
    private AddItemRequestDTO addItemRequest;
    private UpdateItemRequestDTO updateItemRequest;
    private String cartId;

    @BeforeEach
    void setUp() {
        cartId = "test-cart-id-123";

        carritoResponse = new CarritoResponseDTO();
        carritoResponse.setId(1);
        carritoResponse.setItems(new ArrayList<>());
        carritoResponse.setTotal(BigDecimal.valueOf(100.00));

        addItemRequest = new AddItemRequestDTO();
        addItemRequest.setIdProducto(1);
        addItemRequest.setCantidad(2);

        updateItemRequest = new UpdateItemRequestDTO();
        updateItemRequest.setCantidad(3);
    }

    @Test
    void obtenerCarrito_DeberiaRetornarCarrito_CuandoCartIdExiste() {
        // Arrange
        when(carritoService.obtenerCarrito(cartId)).thenReturn(carritoResponse);

        // Act
        ResponseEntity<CarritoResponseDTO> result = carritoController.obtenerCarrito(cartId);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(1, result.getBody().getId());
        verify(carritoService).obtenerCarrito(cartId);
    }

    @Test
    void obtenerCarrito_DeberiaRetornarCarrito_CuandoCartIdEsNull() {
        // Arrange
        when(carritoService.obtenerCarrito(null)).thenReturn(carritoResponse);

        // Act
        ResponseEntity<CarritoResponseDTO> result = carritoController.obtenerCarrito(null);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(carritoService).obtenerCarrito(null);
    }

    @Test
    void agregarItemAlCarrito_DeberiaRetornarCarritoActualizado() {
        // Arrange
        when(carritoService.agregarItemAlCarrito(eq(cartId), any(AddItemRequestDTO.class))).thenReturn(carritoResponse);

        // Act
        ResponseEntity<CarritoResponseDTO> result = carritoController.agregarItemAlCarrito(cartId, addItemRequest);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        verify(carritoService).agregarItemAlCarrito(eq(cartId), any(AddItemRequestDTO.class));
    }

    @Test
    void agregarItemAlCarrito_DeberiaLlamarAlServicioConDatosCorrectos() {
        // Arrange
        when(carritoService.agregarItemAlCarrito(anyString(), any(AddItemRequestDTO.class))).thenReturn(carritoResponse);

        // Act
        carritoController.agregarItemAlCarrito(cartId, addItemRequest);

        // Assert
        verify(carritoService).agregarItemAlCarrito(cartId, addItemRequest);
    }

    @Test
    void actualizarItemDelCarrito_DeberiaRetornarCarritoActualizado() {
        // Arrange
        when(carritoService.actualizarItemDelCarrito(eq(cartId), eq(1), any(UpdateItemRequestDTO.class)))
                .thenReturn(carritoResponse);

        // Act
        ResponseEntity<CarritoResponseDTO> result = carritoController.actualizarItemDelCarrito(cartId, 1, updateItemRequest);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        verify(carritoService).actualizarItemDelCarrito(eq(cartId), eq(1), any(UpdateItemRequestDTO.class));
    }

    @Test
    void eliminarItemDelCarrito_DeberiaRetornarNoContent() {
        // Arrange
        doNothing().when(carritoService).eliminarItemDelCarrito(cartId, 1);

        // Act
        ResponseEntity<Void> result = carritoController.eliminarItemDelCarrito(cartId, 1);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
        assertNull(result.getBody());
        verify(carritoService).eliminarItemDelCarrito(cartId, 1);
    }

    @Test
    void eliminarItemDelCarrito_DeberiaLlamarAlServicioConParametrosCorrectos() {
        // Arrange
        doNothing().when(carritoService).eliminarItemDelCarrito(anyString(), anyInt());

        // Act
        carritoController.eliminarItemDelCarrito(cartId, 5);

        // Assert
        verify(carritoService).eliminarItemDelCarrito(cartId, 5);
    }
}
