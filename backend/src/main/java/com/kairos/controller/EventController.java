package com.kairos.controller;

import com.kairos.dto.request.CreateEventRequest;
import com.kairos.dto.request.UpdateEventRequest;
import com.kairos.dto.response.ApiResponse;
import com.kairos.dto.response.EventResponse;
import com.kairos.entity.User;
import com.kairos.service.AuthService;
import com.kairos.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "latest") String sortBy) {
        List<EventResponse> events = eventService.getAllEvents(category, search, sortBy);
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getFeaturedEvents() {
        List<EventResponse> events = eventService.getFeaturedEvents();
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getCategories() {
        Map<String, Long> categories = eventService.getCategoriesWithCount();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(@PathVariable Long id) {
        EventResponse event = eventService.getEventById(id);
        return ResponseEntity.ok(ApiResponse.success(event));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(
            @Valid @RequestBody CreateEventRequest request,
            Authentication authentication) {
        User organizer = authService.getAuthenticatedUser(authentication.getName());
        EventResponse event = eventService.createEvent(request, organizer);
        return new ResponseEntity<>(ApiResponse.success("Event created successfully", event), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable Long id,
            @RequestBody UpdateEventRequest request,
            Authentication authentication) {
        User currentUser = authService.getAuthenticatedUser(authentication.getName());
        EventResponse event = eventService.updateEvent(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", event));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @PathVariable Long id,
            Authentication authentication) {
        User currentUser = authService.getAuthenticatedUser(authentication.getName());
        eventService.deleteEvent(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }
}
