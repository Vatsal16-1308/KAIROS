package com.kairos.service;

import com.kairos.dto.request.CreateEventRequest;
import com.kairos.dto.request.UpdateEventRequest;
import com.kairos.dto.response.EventResponse;
import com.kairos.entity.User;

import java.util.List;
import java.util.Map;

public interface EventService {

    List<EventResponse> getAllEvents(String category, String search, String sortBy);

    List<EventResponse> getFeaturedEvents();

    EventResponse getEventById(Long id);

    EventResponse createEvent(CreateEventRequest request, User organizer);

    EventResponse updateEvent(Long id, UpdateEventRequest request, User currentUser);

    void deleteEvent(Long id, User currentUser);

    Map<String, Long> getCategoriesWithCount();
}
