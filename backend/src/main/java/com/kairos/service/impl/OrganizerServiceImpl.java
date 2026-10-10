package com.kairos.service.impl;

import com.kairos.dto.response.BookingResponse;
import com.kairos.dto.response.EventResponse;
import com.kairos.dto.response.OrganizerDashboardResponse;
import com.kairos.entity.Booking;
import com.kairos.entity.Event;
import com.kairos.entity.EventStatus;
import com.kairos.entity.Role;
import com.kairos.entity.User;
import com.kairos.exception.ResourceNotFoundException;
import com.kairos.exception.UnauthorizedException;
import com.kairos.repository.BookingRepository;
import com.kairos.repository.EventRepository;
import com.kairos.service.OrganizerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganizerServiceImpl implements OrganizerService {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final EventServiceImpl eventServiceImpl;
    private final BookingServiceImpl bookingServiceImpl;

    @Override
    @Transactional(readOnly = true)
    public OrganizerDashboardResponse getOrganizerDashboard(User organizer) {
        List<Event> events = eventRepository.findByOrganizerId(organizer.getId());

        long totalEvents = events.size();
        long activeEvents = events.stream()
                .filter(e -> e.getStatus() == EventStatus.PUBLISHED)
                .count();

        Double totalRevenue = bookingRepository.calculateOrganizerRevenue(organizer.getId());
        if (totalRevenue == null) totalRevenue = 0.0;

        Long totalTickets = bookingRepository.calculateOrganizerTicketsSold(organizer.getId());
        if (totalTickets == null) totalTickets = 0L;

        List<EventResponse> eventResponses = events.stream()
                .map(eventServiceImpl::mapToEventResponse)
                .collect(Collectors.toList());

        List<Booking> bookings = bookingRepository.findBookingsByOrganizerId(organizer.getId());
        List<BookingResponse> recentBookings = bookings.stream()
                .limit(20)
                .map(bookingServiceImpl::mapToBookingResponse)
                .collect(Collectors.toList());

        return OrganizerDashboardResponse.builder()
                .totalEvents(totalEvents)
                .activeEvents(activeEvents)
                .totalTicketsSold(totalTickets)
                .totalRevenue(totalRevenue)
                .events(eventResponses)
                .recentBookings(recentBookings)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getEventAttendees(Long eventId, User organizer) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        boolean isOwner = event.getOrganizer() != null && event.getOrganizer().getId().equals(organizer.getId());
        boolean isAdmin = organizer.getRole() == Role.ROLE_ADMIN;

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to view attendees for this event.");
        }

        return bookingRepository.findByEventIdOrderByBookedAtDesc(eventId).stream()
                .map(bookingServiceImpl::mapToBookingResponse)
                .collect(Collectors.toList());
    }
}
