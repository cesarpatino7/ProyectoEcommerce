package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UsuarioRegistroRequestDTO;
import com.taller.ingenieria.api.dto.request.UsuarioUpdateRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioRegistroResponseDTO;
import com.taller.ingenieria.api.model.Usuario;
import com.taller.ingenieria.api.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioControllerImpl implements UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Override
    @GetMapping
    public ResponseEntity<List<UsuarioPerfilResponseDTO>> obtenerTodosLosUsuarios() {
        List<UsuarioPerfilResponseDTO> responseDTO = usuarioService.obtenerTodosLosUsuarios();
        return ResponseEntity.ok(responseDTO);

    }

    @Override
    @PostMapping("/registro")
    public ResponseEntity<UsuarioRegistroResponseDTO> registrarUsuario(@RequestBody UsuarioRegistroRequestDTO requestDTO) {
        UsuarioRegistroResponseDTO usuarioDTO = usuarioService.registrarUsuario(requestDTO);
        return new ResponseEntity<>(usuarioDTO, HttpStatus.CREATED);
    }


    @Override
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioPerfilResponseDTO> obtenerUsuarioPorId(@PathVariable Integer id) {
        UsuarioPerfilResponseDTO usuarioDTO = usuarioService.obtenerUsuarioPorId(id);
        return ResponseEntity.ok(usuarioDTO);
    }

    @Override
    @GetMapping("by-email")
    public ResponseEntity<UsuarioPerfilResponseDTO> obtenerUsuarioPorEmail(@RequestParam String email) {
        UsuarioPerfilResponseDTO usuarioDTO = usuarioService.obtenerUsuarioPorEmail(email);
        return ResponseEntity.ok(usuarioDTO);
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioPerfilResponseDTO> actualizarUsuario(@PathVariable Integer id, @RequestBody UsuarioUpdateRequestDTO requestDTO) {
        UsuarioPerfilResponseDTO usuarioDTO = usuarioService.actualizarUsuario(id, requestDTO);
        return ResponseEntity.ok(usuarioDTO);
    }

}