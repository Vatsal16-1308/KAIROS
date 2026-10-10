package com.kairos.service.impl;

import com.kairos.dto.request.CreateBookingRequest;
import com.kairos.dto.response.BookingResponse;
import com.kairos.entity.*;
import com.kairos.exception.BadRequestException;
import com.kairos.exception.ResourceNotFoundException;
import com.kairos.exception.UnauthorizedException;
import com.kairos.repository.BookingRepository;
import com.kairos.repository.EventRepository;
import com.kairos.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;

    @Override
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request, User user) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        if (event.getStatus() != EventStatus.PUBLISHED) {
            throw new BadRequestException("This event is not open for bookings.");
        }

        int ticketsToBook = (request.getNumberOfTickets() != null && request.getNumberOfTickets() > 0)
                ? request.getNumberOfTickets() : 1;

        if (event.getRemainingTickets() != null && event.getRemainingTickets() < ticketsToBook) {
            throw new BadRequestException("Not enough tickets available. Only " + event.getRemainingTickets() + " remaining.");
        }

        // Calculate amount
        double unitPrice = event.getPriceAmount() != null ? event.getPriceAmount() : 0.0;
        double totalAmount = unitPrice * ticketsToBook;
        PaymentStatus paymentStatus = (totalAmount == 0.0) ? PaymentStatus.FREE : PaymentStatus.PAID;

        // Decrement remaining tickets
        if (event.getRemainingTickets() != null) {
            event.setRemainingTickets(event.getRemainingTickets() - ticketsToBook);
            eventRepository.save(event);
        }

        // Generate Reference and QR ticket code
        String randomSuffix = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String bookingRef = "KAIROS-" + event.getId() + "-" + randomSuffix;
        String qrToken = "KAIROS-TICKET-" + UUID.randomUUID().toString();

        String attendeeName = request.getAttendeeName() != null && !request.getAttendeeName().trim().isEmpty()
                ? request.getAttendeeName() : user.getName();
        String attendeeEmail = request.getAttendeeEmail() != null && !request.getAttendeeEmail().trim().isEmpty()
                ? request.getAttendeeEmail() : user.getEmail();
        String attendeePhone = request.getAttendeePhone() != null ? request.getAttendeePhone() : user.getPhone();

        Booking booking = Booking.builder()
                .bookingReference(bookingRef)
                .user(user)
                .event(event)
                .numberOfTickets(ticketsToBook)
                .totalAmount(totalAmount)
                .attendeeName(attendeeName)
                .attendeeEmail(attendeeEmail)
                .attendeePhone(attendeePhone)
                .status(BookingStatus.CONFIRMED)
                .paymentStatus(paymentStatus)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : (totalAmount == 0.0 ? "FREE_PASS" : "ONLINE"))
                .ticketQrCode(qrToken)
                .bookedAt(LocalDateTime.now())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        return mapToBookingResponse(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(User user) {
        return bookingRepository.findByUserOrderByBookedAtDesc(user).stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id, User user) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        boolean isOwner = booking.getUser().getId().equals(user.getId());
        boolean isOrganizer = booking.getEvent().getOrganizer() != null && booking.getEvent().getOrganizer().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

        if (!isOwner && !isOrganizer && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to view this booking.");
        }

        return mapToBookingResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long id, User user) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        boolean isOwner = booking.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to cancel this booking.");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            booking.setPaymentStatus(PaymentStatus.REFUNDED);
        }

        // Return tickets to event capacity
        Event event = booking.getEvent();
        if (event.getRemainingTickets() != null) {
            event.setRemainingTickets(Math.min(event.getCapacity(), event.getRemainingTickets() + booking.getNumberOfTickets()));
            eventRepository.save(event);
        }

        Booking updated = bookingRepository.save(booking);
        return mapToBookingResponse(updated);
    }

    public BookingResponse mapToBookingResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .eventId(booking.getEvent().getId())
                .eventTitle(booking.getEvent().getTitle())
                .eventCategory(booking.getEvent().getCategory().getDisplayName())
                .eventDate(booking.getEvent().getDate())
                .eventLocation(booking.getEvent().getLocation())
                .eventImageUrl(booking.getEvent().getImageUrl())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getName())
                .userEmail(booking.getUser().getEmail())
                .numberOfTickets(booking.getNumberOfTickets())
                .totalAmount(booking.getTotalAmount())
                .attendeeName(booking.getAttendeeName())
                .attendeeEmail(booking.getAttendeeEmail())
                .attendeePhone(booking.getAttendeePhone())
                .status(booking.getStatus().name())
                .paymentStatus(booking.getPaymentStatus().name())
                .paymentMethod(booking.getPaymentMethod())
                .ticketQrCode(booking.getTicketQrCode())
                .bookedAt(booking.getBookedAt())
                .build();
    }
}
