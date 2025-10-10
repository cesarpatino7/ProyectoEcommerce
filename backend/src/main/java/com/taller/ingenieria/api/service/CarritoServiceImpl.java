package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.AddItemRequestDTO;
import com.taller.ingenieria.api.dto.request.UpdateItemRequestDTO;
import com.taller.ingenieria.api.dto.response.CarritoResponseDTO;
import com.taller.ingenieria.api.dto.response.ItemCarritoResponseDTO;
import com.taller.ingenieria.api.exception.ResourceNotFoundException;
import com.taller.ingenieria.api.model.*;
import com.taller.ingenieria.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarritoServiceImpl implements CarritoService {

    @Autowired private CarritoRepository carritoRepository;
    @Autowired private ItemCarritoRepository itemCarritoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private ProductoRepository productoRepository;

    @Override
    @Transactional(readOnly = true)
    public CarritoResponseDTO obtenerCarrito(String cartId) {
        Carrito carrito = obtenerOCrearCarrito(cartId);
        return convertirADTO(carrito);
    }

    @Override
    @Transactional
    public CarritoResponseDTO agregarItemAlCarrito(String cartId, AddItemRequestDTO addItemDTO) {
        Carrito carrito = obtenerOCrearCarrito(cartId);
        Producto producto = productoRepository.findById(addItemDTO.getIdProducto())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + addItemDTO.getIdProducto()));

        Optional<ItemCarrito> itemExistenteOpt = carrito.getItems().stream()
                .filter(item -> item.getIdProducto().getId().equals(addItemDTO.getIdProducto()))
                .findFirst();

        if (itemExistenteOpt.isPresent()) {
            ItemCarrito itemExistente = itemExistenteOpt.get();
            itemExistente.setCantidad(itemExistente.getCantidad() + addItemDTO.getCantidad());
            itemCarritoRepository.save(itemExistente);
        } else {
            ItemCarrito nuevoItem = new ItemCarrito();
            nuevoItem.setIdCarrito(carrito);
            nuevoItem.setIdProducto(producto);
            nuevoItem.setCantidad(addItemDTO.getCantidad());
            carrito.getItems().add(nuevoItem);
            itemCarritoRepository.save(nuevoItem);
        }

        return convertirADTO(carrito);
    }

    @Override
    @Transactional
    public CarritoResponseDTO actualizarItemDelCarrito(String cartId, Integer itemId, UpdateItemRequestDTO updateItemDTO) {
        Carrito carrito = obtenerCarritoExistente(cartId);
        ItemCarrito item = validarItemPerteneceAlCarrito(itemId, carrito);

        if (updateItemDTO.getCantidad() <= 0) {
            carrito.getItems().remove(item);
            itemCarritoRepository.delete(item);
        } else {
            item.setCantidad(updateItemDTO.getCantidad());
            itemCarritoRepository.save(item);
        }

        return convertirADTO(carrito);
    }

    @Override
    @Transactional
    public void eliminarItemDelCarrito(String cartId, Integer itemId) {
        Carrito carrito = obtenerCarritoExistente(cartId);
        ItemCarrito item = validarItemPerteneceAlCarrito(itemId, carrito);
        carrito.getItems().remove(item);
        itemCarritoRepository.delete(item);
    }


    private Carrito obtenerOCrearCarrito(String cartId) {
        Optional<Usuario> usuarioOpt = obtenerUsuarioAutenticadoSiExiste();

        if (usuarioOpt.isPresent()) {
            return carritoRepository.findByIdUsuario_Id(usuarioOpt.get().getId())
                    .orElseGet(() -> crearCarritoParaUsuario(usuarioOpt.get()));
        }

        if (StringUtils.hasText(cartId)) {
            return carritoRepository.findById(Integer.parseInt(cartId))
                    .filter(carrito -> carrito.getIdUsuario() == null)
                    .orElseGet(this::crearCarritoAnonimo);
        } else {
            return crearCarritoAnonimo();
        }
    }

    private Carrito obtenerCarritoExistente(String cartId) {
        Optional<Usuario> usuarioOpt = obtenerUsuarioAutenticadoSiExiste();

        if (usuarioOpt.isPresent()) {
            return carritoRepository.findByIdUsuario_Id(usuarioOpt.get().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("No se encontró un carrito para el usuario."));
        }

        if (StringUtils.hasText(cartId)) {
            return carritoRepository.findById(Integer.parseInt(cartId))
                    .filter(c -> c.getIdUsuario() == null)
                    .orElseThrow(() -> new ResourceNotFoundException("No se encontró un carrito anónimo con el ID proporcionado."));
        }

        throw new ResourceNotFoundException("No se encontró un carrito asociado a esta sesión.");
    }

    private Optional<Usuario> obtenerUsuarioAutenticadoSiExiste() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return Optional.empty();
        }
        String userEmail = authentication.getName();
        return usuarioRepository.findByEmail(userEmail);
    }

    private Carrito crearCarritoParaUsuario(Usuario usuario) {
        Carrito nuevoCarrito = new Carrito();
        nuevoCarrito.setIdUsuario(usuario);
        return carritoRepository.save(nuevoCarrito);
    }

    private Carrito crearCarritoAnonimo() {
        Carrito nuevoCarrito = new Carrito();
        nuevoCarrito.setIdUsuario(null);
        return carritoRepository.save(nuevoCarrito);
    }

    private ItemCarrito validarItemPerteneceAlCarrito(Integer itemId, Carrito carrito) {
        return itemCarritoRepository.findById(itemId)
                .filter(item -> item.getIdCarrito().getId().equals(carrito.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("El item con id " + itemId + " no pertenece al carrito actual."));
        }


    private CarritoResponseDTO convertirADTO(Carrito carrito) {
        CarritoResponseDTO dto = new CarritoResponseDTO();
        dto.setId(carrito.getId());

        List<ItemCarrito> items = Optional.ofNullable(carrito.getItems()).orElse(Collections.emptyList());

        List<ItemCarritoResponseDTO> itemDTOs = items.stream()
                .map(this::convertirItemADTO)
                .collect(Collectors.toList());
        dto.setItems(itemDTOs);

        BigDecimal total = itemDTOs.stream()
                .map(ItemCarritoResponseDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotal(total);

        return dto;
    }

    private ItemCarritoResponseDTO convertirItemADTO(ItemCarrito item) {
        ItemCarritoResponseDTO dto = new ItemCarritoResponseDTO();
        dto.setId(item.getId());
        dto.setIdProducto(item.getIdProducto().getId());
        dto.setNombreProducto(item.getIdProducto().getNombre());
        dto.setCantidad(item.getCantidad());
        dto.setPrecioUnitario(item.getIdProducto().getPrecio());
        dto.setSubtotal(item.getIdProducto().getPrecio().multiply(new BigDecimal(item.getCantidad())));
        return dto;
    }
}