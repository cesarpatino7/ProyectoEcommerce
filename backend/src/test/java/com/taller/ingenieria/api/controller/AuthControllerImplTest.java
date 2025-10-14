package com.taller.ingenieria.api.controller;

import com.taller.ingenieria.api.dto.request.UsuarioLoginRequestDTO;
import com.taller.ingenieria.api.dto.response.UsuarioLoginResponseDTO;
import com.taller.ingenieria.api.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerImplTest {

    @Mock
    private AuthService authService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private AuthControllerImpl authController;

    private UsuarioLoginRequestDTO loginRequest;
    private UsuarioLoginResponseDTO loginResponse;

    @BeforeEach
    void setUp() {
        // Configurar datos de prueba para login
        loginRequest = new UsuarioLoginRequestDTO();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("Password123!");

        loginResponse = new UsuarioLoginResponseDTO();
        loginResponse.setId(1);
        loginResponse.setNombre("Test");
        loginResponse.setApellido("User");
        loginResponse.setEmail("test@example.com");
        loginResponse.setRol("ROLE_CUSTOMER");
        loginResponse.setTelefono("0981123456");
        loginResponse.setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token");
    }

    @Test
    void login_DeberiaRetornarUsuarioLoginResponseDTO_CuandoCredencialesSonValidas() {
        // Arrange
        when(authService.login(any(UsuarioLoginRequestDTO.class))).thenReturn(loginResponse);

        // Act
        ResponseEntity<UsuarioLoginResponseDTO> result = authController.login(loginRequest);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(loginResponse.getId(), result.getBody().getId());
        assertEquals(loginResponse.getEmail(), result.getBody().getEmail());
        assertEquals(loginResponse.getNombre(), result.getBody().getNombre());
        assertEquals(loginResponse.getApellido(), result.getBody().getApellido());
        assertEquals(loginResponse.getRol(), result.getBody().getRol());
        assertEquals(loginResponse.getTelefono(), result.getBody().getTelefono());
        assertEquals(loginResponse.getToken(), result.getBody().getToken());
        
        // Verificar que el servicio fue llamado
        verify(authService, times(1)).login(any(UsuarioLoginRequestDTO.class));
    }

    @Test
    void login_DeberiaLlamarAlServicioConElRequestCorrecto() {
        // Arrange
        when(authService.login(loginRequest)).thenReturn(loginResponse);

        // Act
        authController.login(loginRequest);

        // Assert
        verify(authService).login(loginRequest);
    }

    @Test
    void login_DeberiaRetornarTokenEnLaRespuesta() {
        // Arrange
        when(authService.login(any(UsuarioLoginRequestDTO.class))).thenReturn(loginResponse);

        // Act
        ResponseEntity<UsuarioLoginResponseDTO> result = authController.login(loginRequest);

        // Assert
        assertNotNull(result.getBody());
        assertNotNull(result.getBody().getToken());
        assertFalse(result.getBody().getToken().isEmpty());
    }

    @Test
    void logout_DeberiaRetornarMensajeExitoso_CuandoLogoutEsExitoso() {
        // Arrange
        doNothing().when(authService).logout(any(HttpServletRequest.class));

        // Act
        ResponseEntity<String> result = authController.logout(request, response);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("Logout exitoso. El token ha sido invalidado.", result.getBody());
        
        // Verificar que el servicio fue llamado
        verify(authService, times(1)).logout(request);
    }

    @Test
    void logout_DeberiaLlamarAlServicioConElRequestCorrecto() {
        // Arrange
        doNothing().when(authService).logout(request);

        // Act
        authController.logout(request, response);

        // Assert
        verify(authService).logout(request);
    }

    @Test
    void logout_DeberiaInteractuarConElServicioUnaVez() {
        // Arrange
        doNothing().when(authService).logout(any(HttpServletRequest.class));

        // Act
        authController.logout(request, response);

        // Assert
        verify(authService, times(1)).logout(any(HttpServletRequest.class));
    }

    @Test
    void login_DeberiaRetornarRolCorrecto_CuandoUsuarioEsCustomer() {
        // Arrange
        loginResponse.setRol("ROLE_CUSTOMER");
        when(authService.login(any(UsuarioLoginRequestDTO.class))).thenReturn(loginResponse);

        // Act
        ResponseEntity<UsuarioLoginResponseDTO> result = authController.login(loginRequest);

        // Assert
        assertNotNull(result.getBody());
        assertEquals("ROLE_CUSTOMER", result.getBody().getRol());
    }

    @Test
    void login_DeberiaRetornarRolCorrecto_CuandoUsuarioEsAdmin() {
        // Arrange
        loginResponse.setRol("ROLE_ADMIN");
        when(authService.login(any(UsuarioLoginRequestDTO.class))).thenReturn(loginResponse);

        // Act
        ResponseEntity<UsuarioLoginResponseDTO> result = authController.login(loginRequest);

        // Assert
        assertNotNull(result.getBody());
        assertEquals("ROLE_ADMIN", result.getBody().getRol());
    }

    @Test
    void login_DeberiaRetornarTodosLosDatosDelUsuario() {
        // Arrange
        when(authService.login(any(UsuarioLoginRequestDTO.class))).thenReturn(loginResponse);

        // Act
        ResponseEntity<UsuarioLoginResponseDTO> result = authController.login(loginRequest);

        // Assert
        assertNotNull(result.getBody());
        assertAll("Verificar todos los datos del usuario",
            () -> assertNotNull(result.getBody().getId()),
            () -> assertNotNull(result.getBody().getNombre()),
            () -> assertNotNull(result.getBody().getApellido()),
            () -> assertNotNull(result.getBody().getEmail()),
            () -> assertNotNull(result.getBody().getRol()),
            () -> assertNotNull(result.getBody().getTelefono()),
            () -> assertNotNull(result.getBody().getToken())
        );
    }
}
