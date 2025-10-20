package com.taller.ingenieria.api.service;

import com.taller.ingenieria.api.dto.request.UsuarioLoginRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioLoginResponseDTO;
import com.taller.ingenieria.api.exception.InvalidCredentialsException;
import com.taller.ingenieria.api.model.InvalidatedToken;
import com.taller.ingenieria.api.model.Rol;
import com.taller.ingenieria.api.model.Usuario;
import com.taller.ingenieria.api.repository.InvalidatedTokenRepository;
import com.taller.ingenieria.api.repository.UsuarioRepository;
import com.taller.ingenieria.api.security.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private InvalidatedTokenRepository invalidatedTokenRepository;

    @Mock
    private Authentication authentication;

    @Mock
    private HttpServletRequest request;

    @Mock
    private Claims claims;

    @InjectMocks
    private AuthServiceImpl authService;

    private UsuarioLoginRequestDTO loginRequest;
    private Usuario usuario;
    private UserDetails userDetails;
    private String token;

    @BeforeEach
    void setUp() {
        // Configurar login request
        loginRequest = new UsuarioLoginRequestDTO();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("Password123!");

        // Configurar rol
        Rol rol = new Rol();
        rol.setId(1);
        rol.setDescripcion("ROLE_CUSTOMER");

        // Configurar usuario
        usuario = new Usuario();
        usuario.setId(1);
        usuario.setNombre("Test");
        usuario.setApellido("User");
        usuario.setEmail("test@example.com");
        usuario.setRol(rol);
        usuario.setTelefono("0981123456");

        // Configurar UserDetails
        userDetails = User.builder()
                .username("test@example.com")
                .password("encodedPassword")
                .roles("CUSTOMER")
                .build();

        // Configurar token
        token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token";
    }

    @Test
    void login_DeberiaRetornarUsuarioLoginResponseDTO_CuandoCredencialesSonValidas() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn(token);
        when(usuarioRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.of(usuario));

        // Act
        UsuarioLoginResponseDTO result = authService.login(loginRequest);

        // Assert
        assertNotNull(result);
        assertEquals(usuario.getId(), result.getId());
        assertEquals(usuario.getNombre(), result.getNombre());
        assertEquals(usuario.getApellido(), result.getApellido());
        assertEquals(usuario.getEmail(), result.getEmail());
        assertEquals(usuario.getRol().getDescripcion(), result.getRol());
        assertEquals(token, result.getToken());
        
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService).generateToken(userDetails);
        verify(usuarioRepository).findByEmail(userDetails.getUsername());
    }

    @Test
    void login_DeberiaLanzarInvalidCredentialsException_CuandoCredencialesSonInvalidas() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        InvalidCredentialsException exception = assertThrows(
                InvalidCredentialsException.class,
                () -> authService.login(loginRequest)
        );

        assertEquals("Email o contraseña inválidos.", exception.getMessage());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void logout_DeberiaInvalidarToken_CuandoTokenEsValido() {
        // Arrange
        String authHeader = "Bearer " + token;
        String jti = "test-jti-123";
        Date expiryDate = new Date(System.currentTimeMillis() + 3600000);

        when(request.getHeader("Authorization")).thenReturn(authHeader);
        when(jwtService.extractAllClaims(token)).thenReturn(claims);
        when(claims.getId()).thenReturn(jti);
        when(claims.getExpiration()).thenReturn(expiryDate);
        when(invalidatedTokenRepository.save(any(InvalidatedToken.class))).thenReturn(new InvalidatedToken());

        // Act
        authService.logout(request);

        // Assert
        verify(request).getHeader("Authorization");
        verify(jwtService).extractAllClaims(token);
        verify(invalidatedTokenRepository).save(any(InvalidatedToken.class));
    }

    @Test
    void logout_NoDeberiaHacerNada_CuandoNoHayAuthHeader() {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn(null);

        // Act
        authService.logout(request);

        // Assert
        verify(request).getHeader("Authorization");
        verify(jwtService, never()).extractAllClaims(any());
        verify(invalidatedTokenRepository, never()).save(any());
    }

    @Test
    void logout_NoDeberiaHacerNada_CuandoAuthHeaderNoTieneBearerPrefix() {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn("InvalidPrefix " + token);

        // Act
        authService.logout(request);

        // Assert
        verify(request).getHeader("Authorization");
        verify(jwtService, never()).extractAllClaims(any());
        verify(invalidatedTokenRepository, never()).save(any());
    }

    @Test
    void login_DeberiaRetornarTelefonoVacio_CuandoUsuarioNoTieneTelefono() {
        // Arrange
        usuario.setTelefono(null);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn(token);
        when(usuarioRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.of(usuario));

        // Act
        UsuarioLoginResponseDTO result = authService.login(loginRequest);

        // Assert
        assertNotNull(result);
        assertEquals("", result.getTelefono());
    }
}
