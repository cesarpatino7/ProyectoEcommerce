package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.CheckoutRequestDTO;
import com.taller.ingenieria.api.dto.request.UpdateEstadoPedidoRequestDTO;
import com.taller.ingenieria.api.dto.response.DireccionResponseDTO;
import com.taller.ingenieria.api.dto.response.PedidoAdminDTO;
import com.taller.ingenieria.api.dto.response.PedidoHistorialDTO;
import com.taller.ingenieria.api.dto.response.PedidoResponseDTO;
import com.taller.ingenieria.api.exception.BusinessValidationException;
import com.taller.ingenieria.api.exception.ResourceNotFoundException;
import com.taller.ingenieria.api.exception.StockConflictException;
import com.taller.ingenieria.api.model.*;
import com.taller.ingenieria.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoServiceImpl implements PedidoService {

    @Autowired private PedidoRepository pedidoRepository;
    @Autowired private DetallePedidoRepository detallePedidoRepository;
    @Autowired private CarritoRepository carritoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private DireccionRepository direccionRepository;
    @Autowired private EstadoRepository estadoRepository;
    @Autowired private ItemCarritoRepository itemCarritoRepository;


    @Override
    @Transactional
    public PedidoResponseDTO crearPedido(CheckoutRequestDTO checkoutDTO) {
        Usuario usuario = obtenerUsuarioAutenticado();


        if (usuario.getTelefono() == null || usuario.getTelefono().trim().isEmpty()) {
            throw new BusinessValidationException("Es necesario que agregues un número de teléfono a tu perfil antes de poder realizar un pedido.");
        }

        Carrito carrito = obtenerCarritoDelUsuario(usuario);
        Direccion direccion = validarDireccion(checkoutDTO.getIdDireccion(), usuario);

        Pedido nuevoPedido = crearPedidoPrincipal(usuario, direccion);

        List<DetallePedido> detalles = transferirItemsACarrito(carrito, nuevoPedido);

        try {
            pedidoRepository.save(nuevoPedido);
            detallePedidoRepository.saveAll(detalles);

            limpiarCarrito(carrito);

            return convertirADTO(nuevoPedido, detalles);

        } catch (org.springframework.dao.DataAccessException e) {
            Throwable rootCause = e.getRootCause();
            if (rootCause != null && rootCause.getMessage().contains("Stock insuficiente para el producto seleccionado.")) {
                throw new StockConflictException("No hay suficiente stock para uno de los productos en el pedido.");
            }
            throw e;
        }
    }


    private Usuario obtenerUsuarioAutenticado() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado para la sesión actual. No se puede crear el pedido."));
    }

    private Carrito obtenerCarritoDelUsuario(Usuario usuario) {
        Carrito carrito = carritoRepository.findByIdUsuario_Id(usuario.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró un carrito para el usuario."));

        if (carrito.getItems() == null || carrito.getItems().isEmpty()) {
            throw new BusinessValidationException("El carrito está vacío. No se puede crear un pedido.");
        }

        return carrito;
    }

    private Direccion validarDireccion(Integer idDireccion, Usuario usuario) {
        Direccion direccion = direccionRepository.findById(idDireccion)
                .orElseThrow(() -> new ResourceNotFoundException("La dirección de envío seleccionada con ID " + idDireccion + " no existe."));

        if (!direccion.getIdUsuario().getId().equals(usuario.getId())) {
            throw new SecurityException("La dirección de envío seleccionada no pertenece al usuario actual.");
        }

        return direccion;
    }

    private Pedido crearPedidoPrincipal(Usuario usuario, Direccion direccion) {
        Pedido nuevoPedido = new Pedido();
        nuevoPedido.setIdUsuario(usuario);
        nuevoPedido.setIdDireccion(direccion);

        nuevoPedido.setFechaPedido(Instant.now());

        // Asignamos un estado inicial. Asumimos que el estado "Pendiente" para pedidos tiene ID = 1.
        // Una mejora futura sería buscar el estado por su descripción.
        Estado estadoInicial = estadoRepository.findById(1)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el estado inicial 'Pendiente' para el pedido."));
        nuevoPedido.setIdEstado(estadoInicial);

        // El total se calculará automáticamente por el trigger de la base de datos,
        // por lo que lo inicializamos en cero.
        nuevoPedido.setTotal(BigDecimal.ZERO);

        return nuevoPedido;
    }

    private List<DetallePedido> transferirItemsACarrito(Carrito carrito, Pedido nuevoPedido) {
        List<DetallePedido> detalles = new ArrayList<>();

        for (ItemCarrito item : carrito.getItems()) {
            DetallePedido detalle = new DetallePedido();
            detalle.setIdPedido(nuevoPedido);
            detalle.setIdProducto(item.getIdProducto());
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(item.getIdProducto().getPrecio());
            detalles.add(detalle);
        }

        return detalles;
    }

    private void limpiarCarrito(Carrito carrito) {
        itemCarritoRepository.deleteAll(carrito.getItems());

        carrito.getItems().clear();
    }



    private PedidoResponseDTO convertirADTO(Pedido pedido, List<DetallePedido> detalles) {
        PedidoResponseDTO responseDTO = new PedidoResponseDTO();

        responseDTO.setId(pedido.getId());
        responseDTO.setFechaPedido(pedido.getFechaPedido());
        responseDTO.setEstado(pedido.getIdEstado().getDescripcion());


        BigDecimal totalCalculado = detalles.stream()
                .map(detalle -> detalle.getPrecioUnitario().multiply(new BigDecimal(detalle.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        responseDTO.setTotal(totalCalculado);

        DireccionResponseDTO direccionDTO = new DireccionResponseDTO();
        Direccion direccion = pedido.getIdDireccion();
        direccionDTO.setId(direccion.getId());
        direccionDTO.setDescripcionCalle(direccion.getDescripcionCalle());
        direccionDTO.setNombreCiudad(direccion.getIdCiudad().getNombre());
        direccionDTO.setNombreDepartamento(direccion.getIdCiudad().getIdDepartamento().getNombre());
        responseDTO.setDireccionEnvio(direccionDTO);

        List<PedidoResponseDTO.ItemPedidoResponseDTO> itemsDTO = detalles.stream().map(detalle -> {
            PedidoResponseDTO.ItemPedidoResponseDTO itemDTO = new PedidoResponseDTO.ItemPedidoResponseDTO();
            itemDTO.setNombreProducto(detalle.getIdProducto().getNombre());
            itemDTO.setCantidad(detalle.getCantidad());
            itemDTO.setPrecioUnitario(detalle.getPrecioUnitario());
            return itemDTO;
        }).collect(Collectors.toList());

        responseDTO.setItems(itemsDTO);

        return responseDTO;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoHistorialDTO> obtenerMisPedidos() {
        Usuario usuario = obtenerUsuarioAutenticado();

        List<Pedido> pedidos = pedidoRepository.findByIdUsuario_Id(usuario.getId());

        return pedidos.stream()
                .map(this::convertirAPedidoHistorialDTO)
                .collect(Collectors.toList());
    }


    private PedidoHistorialDTO convertirAPedidoHistorialDTO(Pedido pedido) {
        PedidoHistorialDTO dto = new PedidoHistorialDTO();
        dto.setId(pedido.getId());
        dto.setFechaPedido(pedido.getFechaPedido());
        dto.setEstado(pedido.getIdEstado().getDescripcion());
        dto.setTotal(pedido.getTotal());
        List<PedidoHistorialDTO.ItemHistorialDTO> itemsDTO = pedido.getDetalles().stream()
                .map(detalle -> {
                    PedidoHistorialDTO.ItemHistorialDTO itemDTO = new PedidoHistorialDTO.ItemHistorialDTO();
                    itemDTO.setNombreProducto(detalle.getIdProducto().getNombre());
                    itemDTO.setCantidad(detalle.getCantidad());
                    return itemDTO;
                })
                .collect(Collectors.toList());

        dto.setItems(itemsDTO);

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PedidoAdminDTO> obtenerTodosLosPedidos(Pageable pageable) {
        Page<Pedido> paginaPedidos = pedidoRepository.findAll(pageable);

        return paginaPedidos.map(this::convertirAPedidoAdminDTO);
    }

    @Override
    @Transactional
    public PedidoAdminDTO actualizarEstadoPedido(Integer idPedido, UpdateEstadoPedidoRequestDTO updateDTO) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado con ID: " + idPedido));

        Estado nuevoEstado = estadoRepository.findById(updateDTO.getIdEstado())
                .orElseThrow(() -> new ResourceNotFoundException("Estado no encontrado con ID: " + updateDTO.getIdEstado()));

        pedido.setIdEstado(nuevoEstado);

        if (nuevoEstado.getId().equals(4)) {
            pedido.setFechaEntrega(Instant.now());
        }

        Pedido pedidoActualizado = pedidoRepository.save(pedido);

        return convertirAPedidoAdminDTO(pedidoActualizado);
    }


    private PedidoAdminDTO convertirAPedidoAdminDTO(Pedido pedido) {
        PedidoAdminDTO dto = new PedidoAdminDTO();
        dto.setId(pedido.getId());
        dto.setFechaPedido(pedido.getFechaPedido());
        dto.setEstado(pedido.getIdEstado().getDescripcion());
        dto.setTotal(pedido.getTotal());

        Usuario usuario = pedido.getIdUsuario();
        dto.setIdUsuario(usuario.getId());
        dto.setNombreUsuario(usuario.getNombre() + " " + usuario.getApellido());
        dto.setEmailUsuario(usuario.getEmail());

        dto.setTelefonoUsuario(usuario.getTelefono());

        Direccion direccion = pedido.getIdDireccion();
        String direccionFormateada = String.format("%s, %s, %s",
                direccion.getDescripcionCalle(),
                direccion.getIdCiudad().getNombre(),
                direccion.getIdCiudad().getIdDepartamento().getNombre()
        );
        dto.setDireccionEnvio(direccionFormateada);

        return dto;
    }
}