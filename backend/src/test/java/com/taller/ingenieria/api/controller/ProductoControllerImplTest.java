package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.response.ProductoCatalogoDTO;
import com.taller.ingenieria.api.dto.response.ProductoDetalleDTO;
import com.taller.ingenieria.api.service.ProductoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoControllerImplTest {

    @Mock
    private ProductoService productoService;

    @InjectMocks
    private ProductoControllerImpl productoController;

    private ProductoCatalogoDTO productoCatalogo;
    private ProductoDetalleDTO productoDetalle;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        productoCatalogo = new ProductoCatalogoDTO();
        productoCatalogo.setId(1);
        productoCatalogo.setNombre("Producto Test");
        productoCatalogo.setPrecio(BigDecimal.valueOf(100.00));

        productoDetalle = new ProductoDetalleDTO();
        productoDetalle.setId(1);
        productoDetalle.setNombre("Producto Test");
        productoDetalle.setDescripcion("Descripción del producto");
        productoDetalle.setPrecio(BigDecimal.valueOf(100.00));

        pageable = PageRequest.of(0, 10);
    }

    @Test
    void obtenerCatalogo_DeberiaRetornarPaginaDeProductos() {
        // Arrange
        List<ProductoCatalogoDTO> productos = Arrays.asList(productoCatalogo);
        Page<ProductoCatalogoDTO> page = new PageImpl<>(productos, pageable, productos.size());
        when(productoService.obtenerCatalogo(any(Pageable.class), isNull(), isNull())).thenReturn(page);

        // Act
        ResponseEntity<Page<ProductoCatalogoDTO>> result = productoController.obtenerCatalogo(pageable, null, null);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(1, result.getBody().getTotalElements());
        verify(productoService).obtenerCatalogo(any(Pageable.class), isNull(), isNull());
    }

    @Test
    void obtenerCatalogo_DeberiaRetornarProductosConBusqueda() {
        // Arrange
        List<ProductoCatalogoDTO> productos = Arrays.asList(productoCatalogo);
        Page<ProductoCatalogoDTO> page = new PageImpl<>(productos, pageable, productos.size());
        when(productoService.obtenerCatalogo(any(Pageable.class), eq("test"), isNull())).thenReturn(page);

        // Act
        ResponseEntity<Page<ProductoCatalogoDTO>> result = productoController.obtenerCatalogo(pageable, "test", null);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(productoService).obtenerCatalogo(any(Pageable.class), eq("test"), isNull());
    }

    @Test
    void obtenerCatalogo_DeberiaRetornarProductosPorCategoria() {
        // Arrange
        List<ProductoCatalogoDTO> productos = Arrays.asList(productoCatalogo);
        Page<ProductoCatalogoDTO> page = new PageImpl<>(productos, pageable, productos.size());
        when(productoService.obtenerCatalogo(any(Pageable.class), isNull(), eq("Electrónica"))).thenReturn(page);

        // Act
        ResponseEntity<Page<ProductoCatalogoDTO>> result = productoController.obtenerCatalogo(pageable, null, "Electrónica");

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(productoService).obtenerCatalogo(any(Pageable.class), isNull(), eq("Electrónica"));
    }

    @Test
    void obtenerProductoDetalle_DeberiaRetornarProducto_CuandoIdExiste() {
        // Arrange
        when(productoService.obtenerProductoDetalle(1)).thenReturn(productoDetalle);

        // Act
        ResponseEntity<ProductoDetalleDTO> result = productoController.obtenerProductoDetalle(1);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(1, result.getBody().getId());
        assertEquals("Producto Test", result.getBody().getNombre());
        verify(productoService).obtenerProductoDetalle(1);
    }

    @Test
    void obtenerProductoDetalle_DeberiaLlamarAlServicioConIdCorrecto() {
        // Arrange
        when(productoService.obtenerProductoDetalle(anyInt())).thenReturn(productoDetalle);

        // Act
        productoController.obtenerProductoDetalle(5);

        // Assert
        verify(productoService).obtenerProductoDetalle(5);
    }
}
