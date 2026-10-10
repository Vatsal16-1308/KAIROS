package com.kairos.repository;

import com.kairos.entity.Booking;
import com.kairos.entity.BookingStatus;
import com.kairos.entity.Event;
import com.kairos.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserOrderByBookedAtDesc(User user);

    List<Booking> findByUserIdOrderByBookedAtDesc(Long userId);

    List<Booking> findByEventOrderByBookedAtDesc(Event event);

    List<Booking> findByEventIdOrderByBookedAtDesc(Long eventId);

    Optional<Booking> findByBookingReference(String bookingReference);

    long countByStatus(BookingStatus status);

    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.status = 'CONFIRMED'")
    Double calculateTotalRevenue();

    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.event.organizer.id = :organizerId AND b.status = 'CONFIRMED'")
    Double calculateOrganizerRevenue(@Param("organizerId") Long organizerId);

    @Query("SELECT SUM(b.numberOfTickets) FROM Booking b WHERE b.event.organizer.id = :organizerId AND b.status = 'CONFIRMED'")
    Long calculateOrganizerTicketsSold(@Param("organizerId") Long organizerId);

    @Query("SELECT b FROM Booking b WHERE b.event.organizer.id = :organizerId ORDER BY b.bookedAt DESC")
    List<Booking> findBookingsByOrganizerId(@Param("organizerId") Long organizerId);
}
