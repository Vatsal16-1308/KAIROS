package com.kairos.service.impl;

import com.kairos.dto.response.BookingResponse;
import com.kairos.dto.response.UserDashboardResponse;
import com.kairos.dto.response.UserResponse;
import com.kairos.entity.Booking;
import com.kairos.entity.BookingStatus;
import com.kairos.entity.User;
import com.kairos.repository.BookingRepository;
import com.kairos.repository.UserRepository;
import com.kairos.service.BookingService;
import com.kairos.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final BookingServiceImpl bookingServiceImpl;

    @Override
    @Transactional(readOnly = true)
    public UserDashboardResponse getUserDashboard(User user) {
        List<Booking> bookings = bookingRepository.findByUserOrderByBookedAtDesc(user);

        long totalBookings = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .count();

        LocalDateTime now = LocalDateTime.now();

        long upcomingCount = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .filter(b -> b.getEvent().getEventDate() == null || b.getEvent().getEventDate().isAfter(now))
                .count();

        long pastCount = bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .filter(b -> b.getEvent().getEventDate() != null && b.getEvent().getEventDate().isBefore(now))
                .count();

        List<BookingResponse> recentBookings = bookings.stream()
                .map(bookingServiceImpl::mapToBookingResponse)
                .collect(Collectors.toList());

        return UserDashboardResponse.builder()
                .user(AuthServiceImpl.mapToUserResponse(user))
                .totalBookings(totalBookings)
                .upcomingEventsCount(upcomingCount)
                .pastEventsCount(pastCount)
                .recentBookings(recentBookings)
                .build();
    }

    @Override
    @Transactional
    public UserResponse updateUserProfile(User user, String name, String phone, String avatarUrl) {
        if (name != null && !name.trim().isEmpty()) user.setName(name);
        if (phone != null) user.setPhone(phone);
        if (avatarUrl != null) user.setAvatarUrl(avatarUrl);

        User saved = userRepository.save(user);
        return AuthServiceImpl.mapToUserResponse(saved);
    }
}
