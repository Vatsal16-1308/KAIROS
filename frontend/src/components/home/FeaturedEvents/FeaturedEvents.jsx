import { useState, useEffect } from "react";
import "./FeaturedEvents.css";
import EventCard from "../../event/EventCard/EventCard";
import eventService from "../../../services/eventService";
import staticEvents from "../../../data/events";

function FeaturedEvents() {
  const [events, setEvents] = useState(staticEvents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await eventService.getFeaturedEvents();
        if (res.success && res.data && res.data.length > 0) {
          setEvents(res.data);
        }
      } catch {
        // Fallback to static events
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="featured-events">
      <div className="section-title">
        <h2>Featured Events</h2>
        <p>Don't miss the biggest events happening on campus.</p>
      </div>

      <div className="events-grid">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedEvents;