package com.kairos.controller;

import com.kairos.dto.response.ApiResponse;
import com.kairos.dto.response.BookingResponse;
import com.kairos.dto.response.OrganizerDashboardResponse;
import com.kairos.entity.User;
import com.kairos.service.AuthService;
import com.kairos.service.OrganizerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/organizer")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
public class OrganizerController {

    private final OrganizerService organizerService;
    private final AuthService authService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<OrganizerDashboardResponse>> getOrganizerDashboard(Authentication authentication) {
        User organizer = authService.getAuthenticatedUser(authentication.getName());
        OrganizerDashboardResponse dashboard = organizerService.getOrganizerDashboard(organizer);
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/events/{eventId}/attendees")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getEventAttendees(
            @PathVariable Long eventId,
            Authentication authentication) {
        User organizer = authService.getAuthenticatedUser(authentication.getName());
        List<BookingResponse> attendees = organizerService.getEventAttendees(eventId, organizer);
        return ResponseEntity.ok(ApiResponse.success(attendees));
    }
}
