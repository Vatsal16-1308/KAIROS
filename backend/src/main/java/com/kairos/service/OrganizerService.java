package com.kairos.service;

import com.kairos.dto.response.BookingResponse;
import com.kairos.dto.response.OrganizerDashboardResponse;
import com.kairos.entity.User;

import java.util.List;

public interface OrganizerService {

    OrganizerDashboardResponse getOrganizerDashboard(User organizer);

    List<BookingResponse> getEventAttendees(Long eventId, User organizer);
}
