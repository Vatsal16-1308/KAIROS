package com.kairos.service;

import com.kairos.dto.request.CreateBookingRequest;
import com.kairos.dto.response.BookingResponse;
import com.kairos.entity.*;
import com.kairos.exception.BadRequestException;
import com.kairos.repository.BookingRepository;
import com.kairos.repository.EventRepository;
import com.kairos.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private User sampleUser;
    private Event sampleEvent;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Alex Johnson")
                .email("student@kairos.com")
                .role(Role.ROLE_USER)
                .build();

        sampleEvent = Event.builder()
                .id(100L)
                .title("AI Innovation Summit")
                .category(EventCategory.WORKSHOP)
                .date("24 Aug 2026")
                .location("Main Auditorium")
                .price("Free")
                .priceAmount(0.0)
                .capacity(100)
                .remainingTickets(50)
                .status(EventStatus.PUBLISHED)
                .build();
    }

    @Test
    void testCreateBookingSuccess() {
        CreateBookingRequest request = CreateBookingRequest.builder()
                .eventId(100L)
                .numberOfTickets(2)
                .attendeeName("Alex Johnson")
                .attendeeEmail("student@kairos.com")
                .build();

        when(eventRepository.findById(100L)).thenReturn(Optional.of(sampleEvent));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking b = invocation.getArgument(0);
            b.setId(500L);
            return b;
        });

        BookingResponse response = bookingService.createBooking(request, sampleUser);

        assertNotNull(response);
        assertEquals(2, response.getNumberOfTickets());
        assertEquals("CONFIRMED", response.getStatus());
        assertEquals(48, sampleEvent.getRemainingTickets()); // 50 - 2
        verify(eventRepository).save(sampleEvent);
    }

    @Test
    void testCreateBookingExceedingCapacityThrowsException() {
        CreateBookingRequest request = CreateBookingRequest.builder()
                .eventId(100L)
                .numberOfTickets(60) // greater than 50 remaining
                .build();

        when(eventRepository.findById(100L)).thenReturn(Optional.of(sampleEvent));

        assertThrows(BadRequestException.class, () -> bookingService.createBooking(request, sampleUser));
    }
}
