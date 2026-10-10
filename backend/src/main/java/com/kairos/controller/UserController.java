package com.kairos.controller;

import com.kairos.dto.response.ApiResponse;
import com.kairos.dto.response.UserDashboardResponse;
import com.kairos.dto.response.UserResponse;
import com.kairos.entity.User;
import com.kairos.service.AuthService;
import com.kairos.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<UserDashboardResponse>> getUserDashboard(Authentication authentication) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        UserDashboardResponse dashboard = userService.getUserDashboard(user);
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        String name = body.get("name");
        String phone = body.get("phone");
        String avatarUrl = body.get("avatarUrl");
        UserResponse response = userService.updateUserProfile(user, name, phone, avatarUrl);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }
}
