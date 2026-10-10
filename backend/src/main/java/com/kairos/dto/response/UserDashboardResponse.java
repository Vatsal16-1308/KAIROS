package com.kairos.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDashboardResponse {

    private UserResponse user;
    private long totalBookings;
    private long upcomingEventsCount;
    private long pastEventsCount;
    private List<BookingResponse> recentBookings;
}
