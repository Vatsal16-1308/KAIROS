package com.kairos.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Long id;
    private String bookingReference;
    private Long eventId;
    private String eventTitle;
    private String eventCategory;
    private String eventDate;
    private String eventLocation;
    private String eventImageUrl;
    private Long userId;
    private String userName;
    private String userEmail;
    private Integer numberOfTickets;
    private Double totalAmount;
    private String attendeeName;
    private String attendeeEmail;
    private String attendeePhone;
    private String status;
    private String paymentStatus;
    private String paymentMethod;
    private String ticketQrCode;
    private LocalDateTime bookedAt;
}
