package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.UsuarioLoginRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioLoginResponseDTO;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {
    UsuarioLoginResponseDTO login(UsuarioLoginRequestDTO loginRequest);
    void logout(HttpServletRequest request);
}