package com.kairos.service;

import com.kairos.config.JwtTokenProvider;
import com.kairos.dto.request.LoginRequest;
import com.kairos.dto.request.RegisterRequest;
import com.kairos.dto.response.AuthResponse;
import com.kairos.entity.Role;
import com.kairos.entity.User;
import com.kairos.exception.BadRequestException;
import com.kairos.repository.UserRepository;
import com.kairos.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Alex Johnson")
                .email("student@kairos.com")
                .password("encoded_password")
                .role(Role.ROLE_USER)
                .active(true)
                .build();
    }

    @Test
    void testSuccessfulLogin() {
        LoginRequest request = new LoginRequest("student@kairos.com", "student123");
        Authentication auth = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");
        when(userRepository.findByEmail("student@kairos.com")).thenReturn(Optional.of(sampleUser));

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock.jwt.token", response.getToken());
        assertEquals("student@kairos.com", response.getUser().getEmail());
        assertEquals("USER", response.getUser().getRole());
    }

    @Test
    void testSuccessfulRegistration() {
        RegisterRequest request = RegisterRequest.builder()
                .name("New User")
                .email("newuser@kairos.com")
                .password("secret123")
                .confirmPassword("secret123")
                .role("USER")
                .build();

        when(userRepository.existsByEmail("newuser@kairos.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded_secret");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateTokenForUsername(sampleUser.getEmail())).thenReturn("new.jwt.token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("new.jwt.token", response.getToken());
    }

    @Test
    void testDuplicateEmailRegistrationThrowsException() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Duplicate")
                .email("student@kairos.com")
                .password("secret123")
                .confirmPassword("secret123")
                .build();

        when(userRepository.existsByEmail("student@kairos.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
    }
}
