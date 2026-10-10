package com.kairos.service.impl;

import com.kairos.dto.response.AdminDashboardResponse;
import com.kairos.dto.response.BookingResponse;
import com.kairos.dto.response.EventResponse;
import com.kairos.dto.response.UserResponse;
import com.kairos.entity.*;
import com.kairos.exception.BadRequestException;
import com.kairos.exception.ResourceNotFoundException;
import com.kairos.repository.BookingRepository;
import com.kairos.repository.EventRepository;
import com.kairos.repository.UserRepository;
import com.kairos.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final EventServiceImpl eventServiceImpl;
    private final BookingServiceImpl bookingServiceImpl;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        long totalUsers = userRepository.count();
        long totalOrganizers = userRepository.countByRole(Role.ROLE_ORGANIZER);
        long totalEvents = eventRepository.count();
        long totalBookings = bookingRepository.count();
        Double totalRevenue = bookingRepository.calculateTotalRevenue();
        if (totalRevenue == null) totalRevenue = 0.0;

        List<UserResponse> recentUsers = userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .limit(10)
                .map(AuthServiceImpl::mapToUserResponse)
                .collect(Collectors.toList());

        List<EventResponse> recentEvents = eventRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .limit(10)
                .map(eventServiceImpl::mapToEventResponse)
                .collect(Collectors.toList());

        List<BookingResponse> recentBookings = bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "bookedAt")).stream()
                .limit(10)
                .map(bookingServiceImpl::mapToBookingResponse)
                .collect(Collectors.toList());

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalOrganizers(totalOrganizers)
                .totalEvents(totalEvents)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .recentUsers(recentUsers)
                .recentEvents(recentEvents)
                .recentBookings(recentBookings)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(AuthServiceImpl::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponse updateUserRole(Long userId, String roleStr) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        try {
            String roleName = roleStr.toUpperCase();
            if (!roleName.startsWith("ROLE_")) {
                roleName = "ROLE_" + roleName;
            }
            Role role = Role.valueOf(roleName);
            user.setRole(role);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role specified: " + roleStr);
        }

        User updated = userRepository.save(user);
        return AuthServiceImpl.mapToUserResponse(updated);
    }

    @Override
    @Transactional
    public UserResponse toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setActive(!Boolean.TRUE.equals(user.getActive()));
        User updated = userRepository.save(user);
        return AuthServiceImpl.mapToUserResponse(updated);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        userRepository.delete(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(eventServiceImpl::mapToEventResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EventResponse updateEventStatus(Long eventId, String statusStr) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        try {
            EventStatus status = EventStatus.valueOf(statusStr.toUpperCase());
            event.setStatus(status);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid event status: " + statusStr);
        }

        Event updated = eventRepository.save(event);
        return eventServiceImpl.mapToEventResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "bookedAt")).stream()
                .map(bookingServiceImpl::mapToBookingResponse)
                .collect(Collectors.toList());
    }
}
