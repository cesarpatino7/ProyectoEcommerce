package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.ProductoRequestDTO;
import com.taller.ingenieria.api.dto.response.ProductoResponseDTO;
import com.taller.ingenieria.api.exception.ResourceNotFoundException;
import com.taller.ingenieria.api.model.*;
import com.taller.ingenieria.api.model.id.ProductoCategoriaId;
import com.taller.ingenieria.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoServiceImpl implements ProductoService {

    @Autowired private ProductoRepository productoRepository;
    @Autowired private CategoriaRepository categoriaRepository;
    @Autowired private ImagenRepository imagenRepository;
    @Autowired private ProductoCategoriaRepository productoCategoriaRepository;

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

        // Lógica para asignar categorías
        asignarCategorias(productoGuardado, productoDTO);

        // Lógica para guardar imágenes
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

}