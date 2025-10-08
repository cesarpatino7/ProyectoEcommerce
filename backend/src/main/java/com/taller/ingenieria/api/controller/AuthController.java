package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UsuarioLoginRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioLoginResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

public interface AuthController {

    ResponseEntity<UsuarioLoginResponseDTO> login(UsuarioLoginRequestDTO loginRequest);

    ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response);

}
