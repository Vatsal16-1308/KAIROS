package com.kairos.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBookingRequest {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @Min(value = 1, message = "At least 1 ticket must be booked")
    @Builder.Default
    private Integer numberOfTickets = 1;

    private String attendeeName;

    private String attendeeEmail;

    private String attendeePhone;

    private String paymentMethod;
}
