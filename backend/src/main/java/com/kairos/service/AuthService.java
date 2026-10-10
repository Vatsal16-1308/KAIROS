package com.kairos.service;

import com.kairos.dto.request.LoginRequest;
import com.kairos.dto.request.RegisterRequest;
import com.kairos.dto.response.AuthResponse;
import com.kairos.dto.response.UserResponse;
import com.kairos.entity.User;

public interface AuthService {

    AuthResponse login(LoginRequest loginRequest);

    AuthResponse register(RegisterRequest registerRequest);

    UserResponse getCurrentUser(String email);

    User getAuthenticatedUser(String email);
}
