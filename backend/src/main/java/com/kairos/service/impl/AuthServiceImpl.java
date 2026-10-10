package com.kairos.service.impl;

import com.kairos.config.JwtTokenProvider;
import com.kairos.dto.request.LoginRequest;
import com.kairos.dto.request.RegisterRequest;
import com.kairos.dto.response.AuthResponse;
import com.kairos.dto.response.UserResponse;
import com.kairos.entity.Role;
import com.kairos.entity.User;
import com.kairos.exception.BadRequestException;
import com.kairos.exception.ResourceNotFoundException;
import com.kairos.repository.UserRepository;
import com.kairos.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + loginRequest.getEmail()));

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToUserResponse(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email is already registered. Please login or use another email.");
        }

        if (registerRequest.getConfirmPassword() != null &&
                !registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new BadRequestException("Password and Confirm Password do not match.");
        }

        Role userRole = Role.ROLE_USER;
        if (registerRequest.getRole() != null &&
                (registerRequest.getRole().equalsIgnoreCase("ORGANIZER") ||
                 registerRequest.getRole().equalsIgnoreCase("ROLE_ORGANIZER"))) {
            userRole = Role.ROLE_ORGANIZER;
        }

        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(userRole)
                .organizationName(registerRequest.getOrganizationName())
                .phone(registerRequest.getPhone())
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        String token = tokenProvider.generateTokenForUsername(savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToUserResponse(savedUser))
                .build();
    }

    @Override
    public UserResponse getCurrentUser(String email) {
        User user = getAuthenticatedUser(email);
        return mapToUserResponse(user);
    }

    @Override
    public User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public static UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name().replace("ROLE_", ""))
                .organizationName(user.getOrganizationName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
