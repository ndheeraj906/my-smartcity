package com.smartcity.ecommerce.service;

import com.smartcity.ecommerce.dto.AuthRequest;
import com.smartcity.ecommerce.dto.AuthResponse;
import com.smartcity.ecommerce.dto.RegisterRequest;
import com.smartcity.ecommerce.model.Role;
import com.smartcity.ecommerce.model.User;
import com.smartcity.ecommerce.repository.UserRepository;
import com.smartcity.ecommerce.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFullName("Test User");
        registerRequest.setPhone("555-1234");
        registerRequest.setRole("CUSTOMER");
    }

    @Test
    void register_successfulRegistration_returnsAuthResponse() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        User savedUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("encodedPassword")
                .role(Role.CUSTOMER)
                .blocked(false)
                .build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtUtil.generateToken("testuser", "CUSTOMER")).thenReturn("jwt-token");

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getUsername()).isEqualTo("testuser");
        assertThat(response.getRole()).isEqualTo("CUSTOMER");
        assertThat(response.getUserId()).isEqualTo(1L);
    }

    @Test
    void register_duplicateUsername_throwsException() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Username already exists");
        verify(userRepository, never()).save(any());
    }

    @Test
    void register_duplicateEmail_throwsException() {
        // Arrange
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Email already exists");
        verify(userRepository, never()).save(any());
    }

    @Test
    void register_adminRole_throwsException() {
        // Arrange
        registerRequest.setRole("ADMIN");
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Cannot register as admin");
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_validCredentials_returnsAuthResponse() {
        // Arrange
        AuthRequest authRequest = new AuthRequest();
        authRequest.setUsername("testuser");
        authRequest.setPassword("password123");

        User user = User.builder()
                .id(1L)
                .username("testuser")
                .role(Role.CUSTOMER)
                .blocked(false)
                .build();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken("testuser", "CUSTOMER")).thenReturn("jwt-token");

        // Act
        AuthResponse response = authService.login(authRequest);

        // Assert
        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getUsername()).isEqualTo("testuser");
        assertThat(response.getRole()).isEqualTo("CUSTOMER");
    }

    @Test
    void login_blockedUser_throwsException() {
        // Arrange
        AuthRequest authRequest = new AuthRequest();
        authRequest.setUsername("testuser");
        authRequest.setPassword("password123");

        User blockedUser = User.builder()
                .id(1L)
                .username("testuser")
                .role(Role.CUSTOMER)
                .blocked(true)
                .build();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(blockedUser));

        // Act & Assert
        assertThatThrownBy(() -> authService.login(authRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Account is blocked");
    }

    @Test
    void login_userNotFound_throwsException() {
        // Arrange
        AuthRequest authRequest = new AuthRequest();
        authRequest.setUsername("unknown");
        authRequest.setPassword("password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.login(authRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }
}
