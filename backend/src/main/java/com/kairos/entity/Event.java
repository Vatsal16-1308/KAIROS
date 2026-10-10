package com.kairos.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events", indexes = {
    @Index(name = "idx_event_category", columnList = "category"),
    @Index(name = "idx_event_status", columnList = "status"),
    @Index(name = "idx_event_date", columnList = "eventDate")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EventCategory category;

    @Column(nullable = false)
    private String date; // Formatted date display, e.g. "24 Aug 2026"

    private LocalDateTime eventDate; // For precise chronological sorting

    @Column(nullable = false)
    private String location;

    private String venueDetails;

    @Column(nullable = false)
    private String price; // e.g. "Free", "₹199", "₹99"

    @Builder.Default
    private Double priceAmount = 0.0;

    @Builder.Default
    private Integer capacity = 100;

    @Builder.Default
    private Integer remainingTickets = 100;

    private String imageUrl;

    @Column(nullable = false)
    private String organizerName; // e.g. "IEEE Student Chapter"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id")
    private User organizer;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(length = 20)
    private EventStatus status = EventStatus.PUBLISHED;

    @Builder.Default
    private Boolean isFeatured = false;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "event_schedules", joinColumns = @JoinColumn(name = "event_id"))
    @Builder.Default
    private List<ScheduleItem> schedule = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Booking> bookings = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
