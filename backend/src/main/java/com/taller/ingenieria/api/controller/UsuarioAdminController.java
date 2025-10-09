package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.AdminUsuarioCreateRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioPerfilResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

public interface UsuarioAdminController {

    ResponseEntity<UsuarioPerfilResponseDTO> crearUsuarioAdmin(@RequestBody AdminUsuarioCreateRequestDTO requestDTO);

}