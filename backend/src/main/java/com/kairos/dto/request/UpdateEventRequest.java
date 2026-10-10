package com.kairos.dto.request;

import com.kairos.entity.ScheduleItem;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateEventRequest {

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
    private String imageUrl;
    private String organizerName;
    private String status; // PUBLISHED, DRAFT, CANCELLED, COMPLETED
    private Boolean isFeatured;
    private List<ScheduleItem> schedule;
}
