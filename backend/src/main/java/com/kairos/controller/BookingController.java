package com.kairos.controller;

import com.kairos.dto.request.CreateBookingRequest;
import com.kairos.dto.response.ApiResponse;
import com.kairos.dto.response.BookingResponse;
import com.kairos.entity.User;
import com.kairos.service.AuthService;
import com.kairos.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            Authentication authentication) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        BookingResponse booking = bookingService.createBooking(request, user);
        return new ResponseEntity<>(ApiResponse.success("Ticket booked successfully!", booking), HttpStatus.CREATED);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(Authentication authentication) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        List<BookingResponse> bookings = bookingService.getUserBookings(user);
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable Long id,
            Authentication authentication) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        BookingResponse booking = bookingService.getBookingById(id, user);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {
        User user = authService.getAuthenticatedUser(authentication.getName());
        BookingResponse booking = bookingService.cancelBooking(id, user);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", booking));
    }
}
