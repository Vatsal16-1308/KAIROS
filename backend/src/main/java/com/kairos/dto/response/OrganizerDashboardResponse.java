package com.kairos.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizerDashboardResponse {

    private long totalEvents;
    private long activeEvents;
    private long totalTicketsSold;
    private double totalRevenue;
    private List<EventResponse> events;
    private List<BookingResponse> recentBookings;
}
