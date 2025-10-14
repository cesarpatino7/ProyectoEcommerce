package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.DireccionRequestDTO;
import com.taller.ingenieria.api.dto.response.DireccionResponseDTO;
import com.taller.ingenieria.api.exception.ResourceNotFoundException;
import com.taller.ingenieria.api.model.Ciudad;
import com.taller.ingenieria.api.model.Direccion;
import com.taller.ingenieria.api.model.Usuario;
import com.taller.ingenieria.api.repository.CiudadRepository;
import com.taller.ingenieria.api.repository.DireccionRepository;
import com.taller.ingenieria.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DireccionServiceImpl implements DireccionService {

    @Autowired
    private DireccionRepository direccionRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private CiudadRepository ciudadRepository;

    @Override
    public List<DireccionResponseDTO> obtenerMisDirecciones() {
        Usuario usuario = obtenerUsuarioAutenticado();
        return direccionRepository.findByIdUsuario_Id(usuario.getId()).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    public DireccionResponseDTO crearDireccion(DireccionRequestDTO requestDTO) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Ciudad ciudad = ciudadRepository.findById(requestDTO.getIdCiudad())
                .orElseThrow(() -> new ResourceNotFoundException("Ciudad no encontrada con id: " + requestDTO.getIdCiudad()));

        Direccion nuevaDireccion = new Direccion();
        nuevaDireccion.setIdUsuario(usuario);
        nuevaDireccion.setDescripcionCalle(requestDTO.getDescripcionCalle());
        nuevaDireccion.setIdCiudad(ciudad);

        Direccion direccionGuardada = direccionRepository.save(nuevaDireccion);
        return convertirADTO(direccionGuardada);
    }

    @Override
    public DireccionResponseDTO actualizarDireccion(Integer idDireccion, DireccionRequestDTO requestDTO) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Direccion direccion = direccionRepository.findById(idDireccion)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada con id: " + idDireccion));

        if (!direccion.getIdUsuario().getId().equals(usuario.getId())) {
            throw new SecurityException("No tiene permiso para modificar esta dirección.");
        }

        Ciudad ciudad = ciudadRepository.findById(requestDTO.getIdCiudad())
                .orElseThrow(() -> new ResourceNotFoundException("Ciudad no encontrada con id: " + requestDTO.getIdCiudad()));

        direccion.setDescripcionCalle(requestDTO.getDescripcionCalle());
        direccion.setIdCiudad(ciudad);

        Direccion direccionActualizada = direccionRepository.save(direccion);
        return convertirADTO(direccionActualizada);
    }

    @Override
    public void eliminarDireccion(Integer idDireccion) {
        Usuario usuario = obtenerUsuarioAutenticado();
        Direccion direccion = direccionRepository.findById(idDireccion)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada con id: " + idDireccion));

        if (!direccion.getIdUsuario().getId().equals(usuario.getId())) {
            throw new SecurityException("No tiene permiso para eliminar esta dirección.");
        }

        try {
            direccionRepository.delete(direccion);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("No se puede eliminar la dirección porque está siendo utilizada en uno o más pedidos.");
        }
    }

    private Usuario obtenerUsuarioAutenticado() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado en la sesión."));
    }

    private DireccionResponseDTO convertirADTO(Direccion direccion) {
        DireccionResponseDTO dto = new DireccionResponseDTO();
        dto.setId(direccion.getId());
        dto.setDescripcionCalle(direccion.getDescripcionCalle());
        dto.setNombreCiudad(direccion.getIdCiudad().getNombre());
        dto.setNombreDepartamento(direccion.getIdCiudad().getIdDepartamento().getNombre());
        return dto;
    }
}