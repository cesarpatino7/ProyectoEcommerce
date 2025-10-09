package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.response.ProductoCatalogoDTO;
import com.taller.ingenieria.api.dto.response.ProductoDetalleDTO;
import com.taller.ingenieria.api.dto.request.ProductoRequestDTO;
import com.taller.ingenieria.api.dto.response.ProductoResponseDTO;
import com.taller.ingenieria.api.exception.ResourceNotFoundException;
import com.taller.ingenieria.api.model.*;
import com.taller.ingenieria.api.model.id.ProductoCategoriaId;
import com.taller.ingenieria.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoServiceImpl implements ProductoService {

    // --- Repositorios de Administración ---
    @Autowired private ProductoRepository productoRepository;
    @Autowired private CategoriaRepository categoriaRepository;
    @Autowired private ImagenRepository imagenRepository;
    @Autowired private ProductoCategoriaRepository productoCategoriaRepository;

    // --- Repositorios de Vistas (Cliente) ---
    @Autowired private ProductoSimpleViewRepository productoSimpleViewRepository;
    @Autowired private ProductoDetalleViewRepository productoDetalleViewRepository;


    @Override
    @Transactional
    public ProductoResponseDTO crearProducto(ProductoRequestDTO productoDTO) {
        Producto producto = new Producto();
        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setPrecio(productoDTO.getPrecio());
        producto.setActivo(productoDTO.getActivo() != null ? productoDTO.getActivo() : true);
        producto.setCreatedAt(Instant.now());

        Producto productoGuardado = productoRepository.save(producto);

        asignarCategorias(productoGuardado, productoDTO);

        guardarImagenes(productoGuardado, productoDTO);

        return obtenerProductoPorId(productoGuardado.getId());
    }

    @Override
    public List<ProductoResponseDTO> obtenerTodosLosProductos() {
        return productoRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductoResponseDTO obtenerProductoPorId(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));
        return convertirADTO(producto);
    }

    @Override
    @Transactional
    public ProductoResponseDTO actualizarProducto(Integer id, ProductoRequestDTO productoDTO) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));

        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setPrecio(productoDTO.getPrecio());
        producto.setActivo(productoDTO.getActivo());

        productoCategoriaRepository.deleteAll(productoCategoriaRepository.findByProducto(producto));
        asignarCategorias(producto, productoDTO);

        imagenRepository.deleteAll(imagenRepository.findByIdProducto(producto));
        guardarImagenes(producto, productoDTO);

        Producto productoActualizado = productoRepository.save(producto);
        return convertirADTO(productoActualizado);
    }

    @Override
    public void eliminarProducto(Integer id) {
        if (!productoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto no encontrado con id: " + id);
        }
        productoRepository.deleteById(id);
    }

    @Override
    public Page<ProductoCatalogoDTO> obtenerCatalogo(Pageable pageable, String busqueda, String categoria) {
        Page<ProductoSimpleView> paginaDeProductos;

        if (StringUtils.hasText(busqueda)) {
            paginaDeProductos = productoSimpleViewRepository.findByNombreContainingIgnoreCase(busqueda, pageable);
        } else if (StringUtils.hasText(categoria)) {
            paginaDeProductos = productoSimpleViewRepository.findByCategoria(categoria, pageable);
        } else {
            paginaDeProductos = productoSimpleViewRepository.findAll(pageable);
        }

        return paginaDeProductos.map(this::convertirAProductoCatalogoDTO);
    }

    @Override
    public ProductoDetalleDTO obtenerProductoDetalle(Integer id) {
        ProductoDetalleView productoView = productoDetalleViewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));
        return convertirAProductoDetalleDTO(productoView);
    }


    private void asignarCategorias(Producto producto, ProductoRequestDTO productoDTO) {
        if (productoDTO.getCategoriaIds() != null) {
            productoDTO.getCategoriaIds().forEach(idCat -> {
                Categoria categoria = categoriaRepository.findById(idCat)
                        .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con id: " + idCat));

                ProductoCategoriaId pk = new ProductoCategoriaId();
                pk.setIdProducto(producto.getId());
                pk.setIdCategoria(categoria.getId());

                ProductoCategoria productoCategoria = new ProductoCategoria();
                productoCategoria.setId(pk);
                productoCategoria.setProducto(producto);
                productoCategoria.setCategoria(categoria);

                productoCategoriaRepository.save(productoCategoria);
            });
        }
    }

    private void guardarImagenes(Producto producto, ProductoRequestDTO productoDTO) {
        if (productoDTO.getImagenes() != null) {
            productoDTO.getImagenes().forEach(url -> {
                Imagen imagen = new Imagen();
                imagen.setPathImagen(url);
                imagen.setIdProducto(producto);
                imagenRepository.save(imagen);
            });
        }
    }

    private ProductoResponseDTO convertirADTO(Producto producto) {
        ProductoResponseDTO dto = new ProductoResponseDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setPrecio(producto.getPrecio());
        dto.setActivo(producto.getActivo());
        dto.setCreatedAt(producto.getCreatedAt());

        List<String> nombresCategorias = productoCategoriaRepository.findByProducto(producto).stream()
                .map(pc -> pc.getCategoria().getNombre())
                .collect(Collectors.toList());
        dto.setCategorias(nombresCategorias);

        List<String> urlsImagenes = imagenRepository.findByIdProducto(producto).stream()
                .map(Imagen::getPathImagen)
                .collect(Collectors.toList());
        dto.setImagenes(urlsImagenes);

        return dto;
    }

    private ProductoCatalogoDTO convertirAProductoCatalogoDTO(ProductoSimpleView view) {
        ProductoCatalogoDTO dto = new ProductoCatalogoDTO();
        dto.setId(view.getIdProducto());
        dto.setNombre(view.getNombre());
        dto.setPrecio(view.getPrecio());
        dto.setCalificacionPromedio(view.getCalificacionPromedio());
        dto.setImagen(view.getImagen());
        return dto;
    }

    private ProductoDetalleDTO convertirAProductoDetalleDTO(ProductoDetalleView view) {
        ProductoDetalleDTO dto = new ProductoDetalleDTO();
        dto.setId(view.getIdProducto());
        dto.setNombre(view.getNombre());
        dto.setDescripcion(view.getDescripcion());
        dto.setPrecio(view.getPrecio());
        dto.setStockActual(view.getStockActual());
        dto.setCategorias(view.getCategorias());
        dto.setImagenes(view.getImagenes());
        return dto;
    }

}