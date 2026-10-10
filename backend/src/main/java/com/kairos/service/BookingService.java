package com.kairos.service;

import com.kairos.dto.request.CreateBookingRequest;
import com.kairos.dto.response.BookingResponse;
import com.kairos.entity.User;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(CreateBookingRequest request, User user);

    List<BookingResponse> getUserBookings(User user);

    BookingResponse getBookingById(Long id, User user);

    BookingResponse cancelBooking(Long id, User user);
}
