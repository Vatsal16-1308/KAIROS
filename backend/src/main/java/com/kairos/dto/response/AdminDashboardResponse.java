package com.kairos.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {

    private long totalUsers;
    private long totalOrganizers;
    private long totalEvents;
    private long totalBookings;
    private double totalRevenue;
    private List<UserResponse> recentUsers;
    private List<EventResponse> recentEvents;
    private List<BookingResponse> recentBookings;
}
