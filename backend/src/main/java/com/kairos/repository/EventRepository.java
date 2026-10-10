package com.kairos.repository;

import com.kairos.entity.Event;
import com.kairos.entity.EventCategory;
import com.kairos.entity.EventStatus;
import com.kairos.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatus(EventStatus status);

    List<Event> findByStatusAndIsFeaturedTrue(EventStatus status);

    List<Event> findByOrganizer(User organizer);

    List<Event> findByOrganizerId(Long organizerId);

    long countByStatus(EventStatus status);

    @Query("SELECT e FROM Event e WHERE e.status = :status " +
           "AND (:category IS NULL OR e.category = :category) " +
           "AND (:search IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(e.location) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(e.organizerName) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Event> searchEvents(
            @Param("status") EventStatus status,
            @Param("category") EventCategory category,
            @Param("search") String search
    );

    @Query("SELECT e.category, COUNT(e) FROM Event e WHERE e.status = 'PUBLISHED' GROUP BY e.category")
    List<Object[]> countEventsByCategory();
}
