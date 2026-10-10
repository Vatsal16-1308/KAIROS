package com.kairos.dto.response;

import com.kairos.entity.ScheduleItem;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String date;
    private LocalDateTime eventDate;
    private String location;
    private String venueDetails;
    private String price;
    private Double priceAmount;
    private Integer capacity;
    private Integer remainingTickets;
    private String image; // for frontend backwards compatibility
    private String imageUrl;
    private String organizer; // organizer display name
    private Long organizerId;
    private String status;
    private Boolean isFeatured;
    private List<ScheduleItem> schedule;
    private LocalDateTime createdAt;
}
