package com.kairos.service.impl;

import com.kairos.dto.request.CreateEventRequest;
import com.kairos.dto.request.UpdateEventRequest;
import com.kairos.dto.response.EventResponse;
import com.kairos.entity.*;
import com.kairos.exception.BadRequestException;
import com.kairos.exception.ResourceNotFoundException;
import com.kairos.exception.UnauthorizedException;
import com.kairos.repository.EventRepository;
import com.kairos.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents(String category, String search, String sortBy) {
        EventCategory eventCategory = null;
        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All")) {
            eventCategory = EventCategory.fromString(category);
        }

        String searchTerm = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        List<Event> events = eventRepository.searchEvents(EventStatus.PUBLISHED, eventCategory, searchTerm);

        // Sort based on sortBy param
        Comparator<Event> comparator;
        if ("low".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(Event::getPriceAmount, Comparator.nullsLast(Comparator.naturalOrder()));
        } else if ("high".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(Event::getPriceAmount, Comparator.nullsLast(Comparator.reverseOrder()));
        } else if ("oldest".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(Event::getEventDate, Comparator.nullsLast(Comparator.naturalOrder()));
        } else { // "latest" or default
            comparator = Comparator.comparing(Event::getEventDate, Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparing(Event::getId, Comparator.reverseOrder());
        }

        return events.stream()
                .sorted(comparator)
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> getFeaturedEvents() {
        List<Event> featured = eventRepository.findByStatusAndIsFeaturedTrue(EventStatus.PUBLISHED);
        if (featured.isEmpty()) {
            // fallback to top published events
            return eventRepository.findByStatus(EventStatus.PUBLISHED).stream()
                    .limit(3)
                    .map(this::mapToEventResponse)
                    .collect(Collectors.toList());
        }
        return featured.stream()
                .map(this::mapToEventResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        return mapToEventResponse(event);
    }

    @Override
    @Transactional
    public EventResponse createEvent(CreateEventRequest request, User organizer) {
        EventCategory category = EventCategory.fromString(request.getCategory());
        if (category == null) {
            throw new BadRequestException("Invalid event category: " + request.getCategory());
        }

        Double priceAmount = request.getPriceAmount();
        if (priceAmount == null) {
            priceAmount = parsePriceToDouble(request.getPrice());
        }

        int capacity = request.getCapacity() != null && request.getCapacity() > 0 ? request.getCapacity() : 100;

        LocalDateTime eventDateTime = request.getEventDate() != null ? request.getEventDate() : LocalDateTime.now().plusDays(14);

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .date(request.getDate())
                .eventDate(eventDateTime)
                .location(request.getLocation())
                .venueDetails(request.getVenueDetails())
                .price(request.getPrice())
                .priceAmount(priceAmount)
                .capacity(capacity)
                .remainingTickets(capacity)
                .imageUrl(request.getImageUrl())
                .organizerName(request.getOrganizerName() != null ? request.getOrganizerName() :
                        (organizer.getOrganizationName() != null ? organizer.getOrganizationName() : organizer.getName()))
                .organizer(organizer)
                .status(EventStatus.PUBLISHED)
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .schedule(request.getSchedule() != null ? request.getSchedule() : new ArrayList<>())
                .build();

        Event savedEvent = eventRepository.save(event);
        return mapToEventResponse(savedEvent);
    }

    @Override
    @Transactional
    public EventResponse updateEvent(Long id, UpdateEventRequest request, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        // Check ownership or admin
        boolean isOwner = event.getOrganizer() != null && event.getOrganizer().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to edit this event.");
        }

        if (request.getTitle() != null) event.setTitle(request.getTitle());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        if (request.getCategory() != null) {
            EventCategory category = EventCategory.fromString(request.getCategory());
            if (category != null) event.setCategory(category);
        }
        if (request.getDate() != null) event.setDate(request.getDate());
        if (request.getEventDate() != null) event.setEventDate(request.getEventDate());
        if (request.getLocation() != null) event.setLocation(request.getLocation());
        if (request.getVenueDetails() != null) event.setVenueDetails(request.getVenueDetails());
        if (request.getPrice() != null) {
            event.setPrice(request.getPrice());
            event.setPriceAmount(request.getPriceAmount() != null ? request.getPriceAmount() : parsePriceToDouble(request.getPrice()));
        }
        if (request.getCapacity() != null) event.setCapacity(request.getCapacity());
        if (request.getRemainingTickets() != null) event.setRemainingTickets(request.getRemainingTickets());
        if (request.getImageUrl() != null) event.setImageUrl(request.getImageUrl());
        if (request.getOrganizerName() != null) event.setOrganizerName(request.getOrganizerName());
        if (request.getIsFeatured() != null) event.setIsFeatured(request.getIsFeatured());
        if (request.getStatus() != null) {
            try {
                event.setStatus(EventStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException ignored) {}
        }
        if (request.getSchedule() != null) {
            event.getSchedule().clear();
            event.getSchedule().addAll(request.getSchedule());
        }

        Event updatedEvent = eventRepository.save(event);
        return mapToEventResponse(updatedEvent);
    }

    @Override
    @Transactional
    public void deleteEvent(Long id, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        boolean isOwner = event.getOrganizer() != null && event.getOrganizer().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to delete this event.");
        }

        eventRepository.delete(event);
    }

    @Override
    public Map<String, Long> getCategoriesWithCount() {
        Map<String, Long> counts = new HashMap<>();
        for (EventCategory c : EventCategory.values()) {
            counts.put(c.getDisplayName(), 0L);
        }
        List<Object[]> results = eventRepository.countEventsByCategory();
        for (Object[] r : results) {
            EventCategory cat = (EventCategory) r[0];
            Long count = (Long) r[1];
            counts.put(cat.getDisplayName(), count);
        }
        return counts;
    }

    private Double parsePriceToDouble(String priceStr) {
        if (priceStr == null || priceStr.trim().isEmpty() || priceStr.equalsIgnoreCase("Free")) {
            return 0.0;
        }
        String digits = priceStr.replaceAll("[^0-9.]", "");
        try {
            return Double.parseDouble(digits);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    public EventResponse mapToEventResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .category(event.getCategory().getDisplayName())
                .date(event.getDate())
                .eventDate(event.getEventDate())
                .location(event.getLocation())
                .venueDetails(event.getVenueDetails())
                .price(event.getPrice())
                .priceAmount(event.getPriceAmount())
                .capacity(event.getCapacity())
                .remainingTickets(event.getRemainingTickets())
                .image(event.getImageUrl())
                .imageUrl(event.getImageUrl())
                .organizer(event.getOrganizerName())
                .organizerId(event.getOrganizer() != null ? event.getOrganizer().getId() : null)
                .status(event.getStatus().name())
                .isFeatured(event.getIsFeatured())
                .schedule(event.getSchedule())
                .createdAt(event.getCreatedAt())
                .build();
    }
}
