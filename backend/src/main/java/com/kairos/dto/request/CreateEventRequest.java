package com.kairos.dto.request;

import com.kairos.entity.ScheduleItem;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateEventRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Category is required")
    private String category; // e.g. "Hackathon", "Workshop", etc.

    @NotBlank(message = "Date is required")
    private String date; // e.g. "24 Aug 2026"

    private LocalDateTime eventDate;

    @NotBlank(message = "Location is required")
    private String location;

    private String venueDetails;

    @NotBlank(message = "Price is required")
    private String price; // e.g. "Free" or "₹199"

    private Double priceAmount;

    private Integer capacity;

    private String imageUrl;

    private String organizerName;

    private Boolean isFeatured;

    @Builder.Default
    private List<ScheduleItem> schedule = new ArrayList<>();
}
