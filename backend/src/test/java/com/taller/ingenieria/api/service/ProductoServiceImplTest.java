package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.ProductoRequestDTO;
import com.taller.ingenieria.api.dto.response.ProductoCatalogoDTO;
import com.taller.ingenieria.api.dto.response.ProductoDetalleDTO;
import com.taller.ingenieria.api.dto.response.ProductoResponseDTO;
import com.taller.ingenieria.api.exception.ResourceNotFoundException;
import com.taller.ingenieria.api.model.Producto;
import com.taller.ingenieria.api.model.ProductoDetalleView;
import com.taller.ingenieria.api.model.ProductoSimpleView;
import com.taller.ingenieria.api.repository.*;
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

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceImplTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private ImagenRepository imagenRepository;

    @Mock
    private ProductoCategoriaRepository productoCategoriaRepository;

    @Mock
    private ProductoSimpleViewRepository productoSimpleViewRepository;

    @Mock
    private ProductoDetalleViewRepository productoDetalleViewRepository;

    @InjectMocks
    private ProductoServiceImpl productoService;

    private Producto producto;
    private ProductoRequestDTO productoRequest;
    private ProductoSimpleView productoSimpleView;
    private ProductoDetalleView productoDetalleView;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        producto = new Producto();
        producto.setId(1);
        producto.setNombre("Producto Test");
        producto.setDescripcion("Descripción del producto");
        producto.setPrecio(BigDecimal.valueOf(100.00));
        producto.setActivo(true);

        productoRequest = new ProductoRequestDTO();
        productoRequest.setNombre("Producto Test");
        productoRequest.setDescripcion("Descripción del producto");
        productoRequest.setPrecio(BigDecimal.valueOf(100.00));
        productoRequest.setActivo(true);
        productoRequest.setImagenes(Arrays.asList("imagen1.jpg", "imagen2.jpg"));

        productoSimpleView = mock(ProductoSimpleView.class);

        productoDetalleView = mock(ProductoDetalleView.class);


        pageable = PageRequest.of(0, 10);
    }

    @Test
    void obtenerTodosLosProductos_DeberiaRetornarListaDeProductos() {
        // Arrange
        List<Producto> productos = Arrays.asList(producto);
        when(productoRepository.findAll()).thenReturn(productos);
        when(imagenRepository.findByIdProducto(any(Producto.class))).thenReturn(Arrays.asList());
        when(productoCategoriaRepository.findByProducto(any(Producto.class))).thenReturn(Arrays.asList());

        // Act
        List<ProductoResponseDTO> result = productoService.obtenerTodosLosProductos();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(productoRepository).findAll();
    }

    @Test
    void obtenerProductoPorId_DeberiaRetornarProducto_CuandoIdExiste() {
        // Arrange
        when(productoRepository.findById(1)).thenReturn(Optional.of(producto));
        when(imagenRepository.findByIdProducto(any(Producto.class))).thenReturn(Arrays.asList());
        when(productoCategoriaRepository.findByProducto(any(Producto.class))).thenReturn(Arrays.asList());

        // Act
        ProductoResponseDTO result = productoService.obtenerProductoPorId(1);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("Producto Test", result.getNombre());
        verify(productoRepository).findById(1);
    }

    @Test
    void obtenerProductoPorId_DeberiaLanzarExcepcion_CuandoIdNoExiste() {
        // Arrange
        when(productoRepository.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            productoService.obtenerProductoPorId(999);
        });
        verify(productoRepository).findById(999);
    }

    @Test
    void eliminarProducto_DeberiaEliminarProducto_CuandoIdExiste() {
        // Arrange
        when(productoRepository.existsById(1)).thenReturn(true);
        doNothing().when(productoRepository).deleteById(1);

        // Act
        productoService.eliminarProducto(1);

        // Assert
        verify(productoRepository).existsById(1);
        verify(productoRepository).deleteById(1);
    }

    @Test
    void eliminarProducto_DeberiaLanzarExcepcion_CuandoIdNoExiste() {
        // Arrange
        when(productoRepository.existsById(999)).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            productoService.eliminarProducto(999);
        });
        verify(productoRepository).existsById(999);
        verify(productoRepository, never()).deleteById(999);
    }

    @Test
    void obtenerCatalogo_DeberiaRetornarPaginaDeProductos_SinFiltros() {
        // Arrange
        List<ProductoSimpleView> productos = Arrays.asList(productoSimpleView);
        Page<ProductoSimpleView> page = new PageImpl<>(productos, pageable, productos.size());
        when(productoSimpleViewRepository.findAll(any(Pageable.class))).thenReturn(page);

        // Act
        Page<ProductoCatalogoDTO> result = productoService.obtenerCatalogo(pageable, null, null);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(productoSimpleViewRepository).findAll(any(Pageable.class));
    }




    @Test
    void obtenerProductoDetalle_DeberiaLanzarExcepcion_CuandoIdNoExiste() {
        // Arrange
        when(productoDetalleViewRepository.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            productoService.obtenerProductoDetalle(999);
        });
        verify(productoDetalleViewRepository).findById(999);
    }
}
