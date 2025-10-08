package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UsuarioUpdateRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import com.taller.ingenieria.api.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/me")
public class ProfileControllerImpl implements ProfileController {

    @Autowired
    private UsuarioService usuarioService;

    @Override
    @GetMapping("/profile")
    public ResponseEntity<UsuarioPerfilResponseDTO> obtenerMiPerfil() {
        return ResponseEntity.ok(usuarioService.obtenerMiPerfil());
    }

    @Override
    @PutMapping("/profile")
    public ResponseEntity<UsuarioPerfilResponseDTO> actualizarMiPerfil(@RequestBody UsuarioUpdateRequestDTO requestDTO) {
        UsuarioPerfilResponseDTO perfilActualizado = usuarioService.actualizarMiPerfil(requestDTO);
        return ResponseEntity.ok(perfilActualizado);
    }
}