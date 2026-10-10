package com.kairos.controller;

import com.kairos.dto.request.UpdateUserRoleRequest;
import com.kairos.dto.response.*;
import com.kairos.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getAdminDashboard() {
        AdminDashboardResponse dashboard = adminService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserRoleRequest request) {
        UserResponse response = adminService.updateUserRole(userId, request.getRole());
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", response));
    }

    @PutMapping("/users/{userId}/toggle-status")
    public ResponseEntity<ApiResponse<UserResponse>> toggleUserStatus(@PathVariable Long userId) {
        UserResponse response = adminService.toggleUserStatus(userId);
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", response));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllEvents() {
        List<EventResponse> events = adminService.getAllEvents();
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @PutMapping("/events/{eventId}/status")
    public ResponseEntity<ApiResponse<EventResponse>> updateEventStatus(
            @PathVariable Long eventId,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        EventResponse event = adminService.updateEventStatus(eventId, status);
        return ResponseEntity.ok(ApiResponse.success("Event status updated successfully", event));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        List<BookingResponse> bookings = adminService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }
}
