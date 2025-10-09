package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.AdminUsuarioCreateRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import com.taller.ingenieria.api.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/users")
public class UsuarioAdminControllerImpl implements UsuarioAdminController {

    @Autowired
    private UsuarioService usuarioService;

    @Override
    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UsuarioPerfilResponseDTO> crearUsuarioAdmin(@RequestBody AdminUsuarioCreateRequestDTO requestDTO) {
        UsuarioPerfilResponseDTO nuevoUsuario = usuarioService.crearUsuarioAdmin(requestDTO);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }
}