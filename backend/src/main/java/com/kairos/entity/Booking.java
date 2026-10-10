package com.kairos.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings", indexes = {
    @Index(name = "idx_booking_reference", columnList = "bookingReference", unique = true),
    @Index(name = "idx_booking_user", columnList = "user_id"),
    @Index(name = "idx_booking_event", columnList = "event_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String bookingReference;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    @Builder.Default
    private Integer numberOfTickets = 1;

    @Column(nullable = false)
    @Builder.Default
    private Double totalAmount = 0.0;

    private String attendeeName;

    private String attendeeEmail;

    private String attendeePhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private BookingStatus status = BookingStatus.CONFIRMED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.FREE;

    private String paymentMethod;

    private String ticketQrCode;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime bookedAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
