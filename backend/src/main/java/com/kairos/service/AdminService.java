package com.kairos.service;

import com.kairos.dto.response.*;

import java.util.List;

public interface AdminService {

    AdminDashboardResponse getAdminDashboard();

    List<UserResponse> getAllUsers();

    UserResponse updateUserRole(Long userId, String role);

    UserResponse toggleUserStatus(Long userId);

    void deleteUser(Long userId);

    List<EventResponse> getAllEvents();

    EventResponse updateEventStatus(Long eventId, String status);

    List<BookingResponse> getAllBookings();
}
