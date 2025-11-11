package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.ResenaRequestDTO;
import com.taller.ingenieria.api.dto.response.ResenaResponseDTO;
import com.taller.ingenieria.api.model.Producto;
import com.taller.ingenieria.api.model.Resena;
import com.taller.ingenieria.api.model.ResenasProductoView;
import com.taller.ingenieria.api.model.Usuario;
import com.taller.ingenieria.api.repository.ProductoRepository;
import com.taller.ingenieria.api.repository.ResenaRepository;
import com.taller.ingenieria.api.repository.ResenasProductoViewRepository;
import com.taller.ingenieria.api.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.http.HttpStatus.CONFLICT;

@ExtendWith(MockitoExtension.class)
class ResenasProductoServiceImplTest {

    @Mock
    private ResenasProductoViewRepository resenasProductoViewRepository;

    @Mock
    private ResenaRepository resenaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ResenasProductoServiceImpl resenasProductoService;

    private Usuario usuario;
    private Producto producto;
    private ResenaRequestDTO resenaRequest;
    private ResenasProductoView resenasProductoView;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1);
        usuario.setNombre("Juan Pérez");

        producto = new Producto();
        producto.setId(1);
        producto.setNombre("Perfume Océano Fresco");

        resenaRequest = new ResenaRequestDTO();
        resenaRequest.setIdUsuario(1);
        resenaRequest.setIdProducto(1);
        resenaRequest.setCalificacion(5);
        resenaRequest.setComentario("Excelente producto");

        // Crear el mock (la configuración se hará en cada test según necesidad)
        resenasProductoView = mock(ResenasProductoView.class);
    }

    @Test
    void obtenerResenasPorProducto_DeberiaRetornarListaDeResenas() {
        // Arrange
        Long idProducto = 1L;
        
        // Configurar el mock ANTES de usarlo
        when(resenasProductoView.getProducto()).thenReturn("Perfume Océano Fresco");
        when(resenasProductoView.getUsuario()).thenReturn("Juan Pérez");
        when(resenasProductoView.getCalificacion()).thenReturn(5);
        when(resenasProductoView.getComentario()).thenReturn("Excelente producto");
        when(resenasProductoView.getFechaPublicacion()).thenReturn(LocalDateTime.now());
        
        List<ResenasProductoView> resenas = Arrays.asList(resenasProductoView);
        when(resenasProductoViewRepository.findByIdProductoOrderByFechaPublicacionDesc(idProducto))
                .thenReturn(resenas);

        // Act
        List<ResenaResponseDTO> result = resenasProductoService.obtenerResenasPorProducto(idProducto);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Perfume Océano Fresco", result.get(0).getProducto());
        assertEquals("Juan Pérez", result.get(0).getUsuario());
        assertEquals(5, result.get(0).getCalificacion());
        assertEquals("Excelente producto", result.get(0).getComentario());
        
        verify(resenasProductoViewRepository).findByIdProductoOrderByFechaPublicacionDesc(idProducto);
    }

    @Test
    void obtenerResenasPorProducto_DeberiaRetornarListaVacia_CuandoNoHayResenas() {
        // Arrange
        Long idProducto = 1L;
        when(resenasProductoViewRepository.findByIdProductoOrderByFechaPublicacionDesc(idProducto))
                .thenReturn(Arrays.asList());

        // Act
        List<ResenaResponseDTO> result = resenasProductoService.obtenerResenasPorProducto(idProducto);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.size());
        
        verify(resenasProductoViewRepository).findByIdProductoOrderByFechaPublicacionDesc(idProducto);
    }

    @Test
    void obtenerResenasPorProducto_DeberiaRetornarMultiplesResenas() {
        // Arrange
        Long idProducto = 1L;
        
        // Crear y configurar el primer mock
        ResenasProductoView resena1 = mock(ResenasProductoView.class);
        when(resena1.getProducto()).thenReturn("Perfume Océano Fresco");
        when(resena1.getUsuario()).thenReturn("Juan Pérez");
        when(resena1.getCalificacion()).thenReturn(5);
        when(resena1.getComentario()).thenReturn("Excelente producto");
        when(resena1.getFechaPublicacion()).thenReturn(LocalDateTime.now());
        
        // Crear y configurar el segundo mock
        ResenasProductoView resena2 = mock(ResenasProductoView.class);
        when(resena2.getProducto()).thenReturn("Perfume Océano Fresco");
        when(resena2.getUsuario()).thenReturn("María García");
        when(resena2.getCalificacion()).thenReturn(4);
        when(resena2.getComentario()).thenReturn("Muy buen producto");
        when(resena2.getFechaPublicacion()).thenReturn(LocalDateTime.now());

        List<ResenasProductoView> resenas = Arrays.asList(resena1, resena2);
        when(resenasProductoViewRepository.findByIdProductoOrderByFechaPublicacionDesc(idProducto))
                .thenReturn(resenas);

        // Act
        List<ResenaResponseDTO> result = resenasProductoService.obtenerResenasPorProducto(idProducto);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Juan Pérez", result.get(0).getUsuario());
        assertEquals("María García", result.get(1).getUsuario());
        
        verify(resenasProductoViewRepository).findByIdProductoOrderByFechaPublicacionDesc(idProducto);
    }

    @Test
    void publicarResena_DeberiaGuardarResenaExitosamente() {
        // Arrange
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));
        when(productoRepository.findById(1)).thenReturn(Optional.of(producto));
        when(resenaRepository.existsByIdUsuarioAndIdProducto(usuario, producto)).thenReturn(false);
        when(resenaRepository.save(any(Resena.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        assertDoesNotThrow(() -> resenasProductoService.publicarResena(resenaRequest));

        // Assert
        verify(usuarioRepository).findById(1);
        verify(productoRepository).findById(1);
        verify(resenaRepository).existsByIdUsuarioAndIdProducto(usuario, producto);
        verify(resenaRepository).save(any(Resena.class));
    }

    @Test
    void publicarResena_DeberiaLanzarExcepcion_CuandoUsuarioNoExiste() {
        // Arrange
        when(usuarioRepository.findById(1)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> resenasProductoService.publicarResena(resenaRequest));
        
        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(usuarioRepository).findById(1);
        verify(productoRepository, never()).findById(any());
        verify(resenaRepository, never()).save(any());
    }

    @Test
    void publicarResena_DeberiaLanzarExcepcion_CuandoProductoNoExiste() {
        // Arrange
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));
        when(productoRepository.findById(1)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> resenasProductoService.publicarResena(resenaRequest));
        
        assertEquals("Producto no encontrado", exception.getMessage());
        verify(usuarioRepository).findById(1);
        verify(productoRepository).findById(1);
        verify(resenaRepository, never()).save(any());
    }

    @Test
    void publicarResena_DeberiaLanzarExcepcion_CuandoResenaYaExiste() {
        // Arrange
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));
        when(productoRepository.findById(1)).thenReturn(Optional.of(producto));
        when(resenaRepository.existsByIdUsuarioAndIdProducto(usuario, producto)).thenReturn(true);

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, 
            () -> resenasProductoService.publicarResena(resenaRequest));
        
        assertEquals(CONFLICT, exception.getStatusCode());
        assertEquals("El usuario ya ha publicado una reseña para este producto.", exception.getReason());
        verify(usuarioRepository).findById(1);
        verify(productoRepository).findById(1);
        verify(resenaRepository).existsByIdUsuarioAndIdProducto(usuario, producto);
        verify(resenaRepository, never()).save(any());
    }

    @Test
    void publicarResena_DeberiaGuardarResenaConDatosCorrectos() {
        // Arrange
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));
        when(productoRepository.findById(1)).thenReturn(Optional.of(producto));
        when(resenaRepository.existsByIdUsuarioAndIdProducto(usuario, producto)).thenReturn(false);
        
        // Capturar la reseña guardada
        Resena[] resenaGuardada = new Resena[1];
        when(resenaRepository.save(any(Resena.class))).thenAnswer(invocation -> {
            resenaGuardada[0] = invocation.getArgument(0);
            return resenaGuardada[0];
        });

        // Act
        resenasProductoService.publicarResena(resenaRequest);

        // Assert
        assertNotNull(resenaGuardada[0]);
        assertEquals(usuario, resenaGuardada[0].getIdUsuario());
        assertEquals(producto, resenaGuardada[0].getIdProducto());
        assertEquals(5, resenaGuardada[0].getCalificacion());
        assertEquals("Excelente producto", resenaGuardada[0].getComentario());
        assertNotNull(resenaGuardada[0].getFechaPublicacion());
        
        verify(resenaRepository).save(any(Resena.class));
    }

    @Test
    void publicarResena_DeberiaAsignarFechaActual() {
        // Arrange
        when(usuarioRepository.findById(1)).thenReturn(Optional.of(usuario));
        when(productoRepository.findById(1)).thenReturn(Optional.of(producto));
        when(resenaRepository.existsByIdUsuarioAndIdProducto(usuario, producto)).thenReturn(false);
        
        Instant beforePublish = Instant.now();
        
        Resena[] resenaGuardada = new Resena[1];
        when(resenaRepository.save(any(Resena.class))).thenAnswer(invocation -> {
            resenaGuardada[0] = invocation.getArgument(0);
            return resenaGuardada[0];
        });

        // Act
        resenasProductoService.publicarResena(resenaRequest);

        // Assert
        Instant afterPublish = Instant.now();
        assertNotNull(resenaGuardada[0].getFechaPublicacion());
        assertTrue(resenaGuardada[0].getFechaPublicacion().equals(beforePublish) || 
                   resenaGuardada[0].getFechaPublicacion().isAfter(beforePublish));
        assertTrue(resenaGuardada[0].getFechaPublicacion().equals(afterPublish) || 
                   resenaGuardada[0].getFechaPublicacion().isBefore(afterPublish));
    }
}
