import { useState, useEffect } from "react";
import "./EventDetails.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar/Navbar";
import eventService from "../../services/eventService";
import bookingService from "../../services/bookingService";
import { useAuth } from "../../context/AuthContext";
import { getEventImage } from "../../utils/imageHelper";
import staticEvents from "../../data/events";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaMapMarkerAlt, FaUserAlt, FaCheckCircle, FaTimes, FaTicketAlt, FaInfoCircle } from "react-icons/fa";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeePhone, setAttendeePhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await eventService.getEventById(id);
        if (isMounted && res.success && res.data) {
          setEvent(res.data);
        }
      } catch {
        if (isMounted) {
          const fallback = staticEvents.find((e) => e.id === Number(id));
          if (fallback) {
            setEvent({
              ...fallback,
              description:
                "Join us for an exciting campus experience filled with learning, networking, competitions, and collaborative activities. Organized by students for the community.",
              schedule: [
                { time: "10:00 AM", title: "Registration & Check-in", description: "Badge pickup" },
                { time: "11:00 AM", title: "Opening Ceremony", description: "Keynote address" },
                { time: "12:30 PM", title: "Technical Sessions & Tracks", description: "Hands-on labs" },
                { time: "02:00 PM", title: "Networking Lunch", description: "Student mixer" },
                { time: "04:00 PM", title: "Award Ceremony & Closing", description: "Prizes" },
              ],
              remainingTickets: 100,
            });
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (user) {
      setAttendeeName(user.name || "");
      setAttendeePhone(user.phone || "");
    }
  }, [user]);

  const handleOpenBooking = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book your ticket");
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await bookingService.createBooking({
        eventId: event.id,
        numberOfTickets: ticketQuantity,
        attendeeName: attendeeName.trim() || user.name,
        attendeeEmail: user.email,
        attendeePhone: attendeePhone.trim(),
        paymentMethod: event.priceAmount === 0 ? "FREE_PASS" : "ONLINE",
      });

      if (res.success && res.data) {
        setConfirmedBooking(res.data);
        toast.success("Ticket confirmed! See you at the event 🎉");
        // Update local remaining count
        if (event.remainingTickets) {
          setEvent((prev) => ({
            ...prev,
            remainingTickets: Math.max(0, prev.remainingTickets - ticketQuantity),
          }));
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Booking failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="event-details-loading">
          <div className="loading-spinner"></div>
          <p>Loading event details...</p>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="event-not-found">
          <h1>Event Not Found</h1>
          <p>The event you are looking for does not exist or has been removed.</p>
          <Link to="/events" className="back-btn">
            Browse All Events
          </Link>
        </div>
      </>
    );
  }

  const imageUrl = getEventImage(event);
  const unitPrice = event.priceAmount || 0;
  const totalPrice = unitPrice * ticketQuantity;

  return (
    <>
      <Navbar />

      <section className="event-details">
        <div className="event-banner">
          <img
            src={imageUrl}
            alt={event.title}
          />
        </div>

        <div className="event-content">
          <div className="event-left">
            <span className="event-category">
              {event.category}
            </span>

            <h1>{event.title}</h1>

            <div className="event-meta">
              <p><FaCalendarAlt /> {event.date}</p>
              <p><FaMapMarkerAlt /> {event.location}</p>
              <p><FaUserAlt /> {event.organizer || event.organizerName}</p>
            </div>

            <div className="event-description">
              <h2>About Event</h2>
              <p>
                {event.description ||
                  "Join us for an exciting experience filled with learning, networking, competitions, and fun. Connect with like-minded peers and industry mentors."}
              </p>
            </div>

            {event.schedule && event.schedule.length > 0 && (
              <div className="event-schedule">
                <h2>Schedule</h2>
                <ul>
                  {event.schedule.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.time}</strong> - {item.title}
                      {item.description && <span className="schedule-desc"> ({item.description})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="event-right">
            <div className="booking-card">
              <div className="booking-card-header">
                <span className="price-label">Ticket Price</span>
                <h2>{event.price}</h2>
              </div>

              {event.remainingTickets !== undefined && (
                <div className="ticket-availability">
                  <FaTicketAlt />
                  <span>
                    {event.remainingTickets > 0
                      ? `${event.remainingTickets} seats remaining`
                      : "Sold Out"}
                  </span>
                </div>
              )}

              <button
                className="book-btn"
                onClick={handleOpenBooking}
                disabled={event.remainingTickets === 0}
              >
                {event.remainingTickets === 0 ? "Sold Out" : "Book Ticket"}
              </button>

              <div className="booking-perks">
                <p><FaCheckCircle /> Instant Digital Ticket</p>
                <p><FaCheckCircle /> Free Cancellation Support</p>
                <p><FaCheckCircle /> QR Code Event Access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <button
              className="modal-close-btn"
              onClick={() => {
                setBookingModalOpen(false);
                setConfirmedBooking(null);
              }}
            >
              <FaTimes />
            </button>

            {!confirmedBooking ? (
              <form onSubmit={handleConfirmBooking} className="booking-modal-form">
                <h2>Confirm Ticket Booking</h2>
                <p className="modal-event-title">{event.title}</p>
                <p className="modal-event-meta">📅 {event.date} | 📍 {event.location}</p>

                <div className="form-group">
                  <label>Attendee Full Name</label>
                  <input
                    type="text"
                    required
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    placeholder="Your Name"
                  />
                </div>

                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="tel"
                    value={attendeePhone}
                    onChange={(e) => setAttendeePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-group">
                  <label>Number of Tickets</label>
                  <div className="ticket-stepper">
                    <button
                      type="button"
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                    >
                      -
                    </button>
                    <span>{ticketQuantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setTicketQuantity(
                          Math.min(
                            event.remainingTickets || 10,
                            ticketQuantity + 1
                          )
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="modal-summary">
                  <div className="summary-row">
                    <span>Ticket Price ({ticketQuantity}x)</span>
                    <span>{unitPrice === 0 ? "Free" : `₹${unitPrice * ticketQuantity}`}</span>
                  </div>
                  <div className="summary-row total-row">
                    <strong>Total Amount</strong>
                    <strong>{unitPrice === 0 ? "Free" : `₹${totalPrice}`}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="modal-confirm-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing Reservation..." : "Confirm & Reserve Ticket"}
                </button>
              </form>
            ) : (
              <div className="booking-success-view">
                <div className="success-icon-wrap">
                  <FaCheckCircle className="success-icon" />
                </div>
                <h2>Booking Confirmed!</h2>
                <p>Your ticket has been reserved and added to your dashboard.</p>

                <div className="ticket-pass-card">
                  <div className="pass-header">
                    <span className="pass-tag">OFFICIAL PASS</span>
                    <span className="pass-ref">{confirmedBooking.bookingReference}</span>
                  </div>
                  <h3>{confirmedBooking.eventTitle}</h3>
                  <div className="pass-details">
                    <p><strong>Attendee:</strong> {confirmedBooking.attendeeName}</p>
                    <p><strong>Date:</strong> {confirmedBooking.eventDate}</p>
                    <p><strong>Tickets:</strong> {confirmedBooking.numberOfTickets}</p>
                  </div>
                  <div className="qr-sim">
                    <code>{confirmedBooking.ticketQrCode?.substring(0, 24)}...</code>
                  </div>
                </div>

                <div className="success-actions">
                  <button
                    className="view-dashboard-btn"
                    onClick={() => {
                      setBookingModalOpen(false);
                      navigate("/user-dashboard");
                    }}
                  >
                    View in My Dashboard
                  </button>
                  <button
                    className="close-view-btn"
                    onClick={() => {
                      setBookingModalOpen(false);
                      setConfirmedBooking(null);
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default EventDetails;