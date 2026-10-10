import "./EventCard.css";
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getEventImage } from "../../../utils/imageHelper";

function EventCard({ event }) {
  const imageUrl = getEventImage(event);
  const remaining = event?.remainingTickets ?? event?.capacity ?? 100;
  const isFree = !event?.price || event?.price === "Free" || event?.price === "0" || event?.price === "₹0";

  return (
    <div className="event-card">
      <div className="event-image-wrap">
        <img
          src={imageUrl}
          alt={event.title}
          loading="lazy"
          className="event-card-img"
        />
        <div className="event-card-overlay"></div>

        <span className={`event-category-badge category-badge--${(event.category || "").toLowerCase().replace(/[^a-z]/g, "")}`}>
          {event.category}
        </span>

        {event.organizerName || event.organizer ? (
          <span className="event-organizer-pill">
            {event.organizerName || event.organizer}
          </span>
        ) : null}
      </div>

      <div className="event-body">
        <h3 className="event-title" title={event.title}>{event.title}</h3>

        <div className="event-meta-group">
          <div className="event-detail">
            <FaCalendarAlt className="meta-icon meta-icon--purple" />
            <span>{event.date}</span>
          </div>

          <div className="event-detail">
            <FaMapMarkerAlt className="meta-icon meta-icon--pink" />
            <span>{event.location}</span>
          </div>
        </div>

        {remaining ? (
          <div className="event-seats-row">
            <div className="seats-info">
              <FaTicketAlt className="seats-icon" />
              <span>{remaining} seats left</span>
            </div>
          </div>
        ) : null}

        <div className="event-footer">
          <div className={`event-price-tag ${isFree ? "price-tag--free" : ""}`}>
            {event.price}
          </div>

          <Link to={`/events/${event.id}`} className="event-card-link">
            <button className="view-details-btn">
              <span>View Details</span>
              <FaArrowRight className="btn-arrow" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;