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
import com.taller.ingenieria.api.service.ResenasProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.CONFLICT;

@Service
public class ResenasProductoServiceImpl implements ResenasProductoService {

    private final ResenasProductoViewRepository resenasProductoViewRepository;
    private final ResenaRepository resenaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;


    public ResenasProductoServiceImpl(ResenasProductoViewRepository repository,
                                      ResenaRepository resenaRepository,
                                      UsuarioRepository usuarioRepository,
                                      ProductoRepository productoRepository
    ) {
        this.resenasProductoViewRepository = repository;
        this.resenaRepository = resenaRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    public List<ResenaResponseDTO> obtenerResenasPorProducto(Long idProducto) {
        List<ResenasProductoView> resenas = resenasProductoViewRepository.findByIdProductoOrderByFechaPublicacionDesc(idProducto);
        return resenas.stream()
                .map(ResenasProductoView -> new ResenaResponseDTO(
                        ResenasProductoView.getProducto(),
                        ResenasProductoView.getUsuario(),
                        ResenasProductoView.getCalificacion(),
                        ResenasProductoView.getComentario(),
                        ResenasProductoView.getFechaPublicacion()
                ))
                .collect(Collectors.toList());
    }


    @Override
    public void publicarResena(ResenaRequestDTO request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Producto producto = productoRepository.findById(request.getIdProducto())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        boolean yaExiste = resenaRepository.existsByIdUsuarioAndIdProducto(usuario, producto);
        if (yaExiste) {
            throw new ResponseStatusException(CONFLICT, "El usuario ya ha publicado una reseña para este producto.");
        }


        Resena resena = new Resena();
        resena.setIdUsuario(usuario);
        resena.setIdProducto(producto);
        resena.setCalificacion(request.getCalificacion());
        resena.setComentario(request.getComentario());
        resena.setFechaPublicacion(Instant.now());

        resenaRepository.save(resena);
    }

}