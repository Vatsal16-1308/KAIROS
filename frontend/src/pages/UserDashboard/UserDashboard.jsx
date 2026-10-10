import { useState, useEffect } from "react";
import "./UserDashboard.css";
import Navbar from "../../components/layout/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import dashboardService from "../../services/dashboardService";
import bookingService from "../../services/bookingService";
import { getEventImage } from "../../utils/imageHelper";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaCalendarCheck,
  FaHistory,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTimes,
  FaQrcode,
  FaUserEdit,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

function UserDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" or "profile"
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getUserDashboard();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error("Failed to load user dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboard();
      if (user) {
        setEditName(user.name || "");
        setEditPhone(user.phone || "");
      }
    }
  }, [isAuthenticated, user]);

  const handleCancelBooking = async (bookingId) => {
    try {
      const res = await bookingService.cancelBooking(bookingId);
      if (res.success) {
        toast.success("Booking cancelled successfully");
        setCancellingBookingId(null);
        fetchDashboard();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to cancel booking";
      toast.error(msg);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await dashboardService.updateUserProfile({
        name: editName,
        phone: editPhone,
      });
      if (res.success) {
        toast.success("Profile updated successfully!");
        fetchDashboard();
      }
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (authLoading || (loading && !dashboardData)) {
    return (
      <>
        <Navbar />
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </>
    );
  }

  const bookings = dashboardData?.recentBookings || [];

  return (
    <>
      <Navbar />
      <div className="user-dashboard">
        <div className="dashboard-container">
          {/* Header */}
          <div className="dashboard-header-card">
            <div className="user-info">
              <div className="avatar-circle">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <h1>{user?.name || "Student Attendee"}</h1>
                <p>{user?.email} • <span className="role-tag">STUDENT / ATTENDEE</span></p>
              </div>
            </div>
            <div className="header-actions">
              <Link to="/events" className="browse-events-btn">
                + Discover More Events
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="dashboard-stats-grid">
            <div className="stat-card">
              <div className="stat-icon stat-icon--purple">
                <FaTicketAlt />
              </div>
              <div>
                <h3>{dashboardData?.totalBookings ?? bookings.length}</h3>
                <p>Total Bookings</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon--green">
                <FaCalendarCheck />
              </div>
              <div>
                <h3>{dashboardData?.upcomingEventsCount ?? bookings.filter(b => b.status === "CONFIRMED").length}</h3>
                <p>Active Passes</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon--blue">
                <FaHistory />
              </div>
              <div>
                <h3>{dashboardData?.pastEventsCount ?? 0}</h3>
                <p>Past Events</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="dashboard-tabs">
            <button
              className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              🎟️ My Tickets & Passes ({bookings.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              👤 Profile Settings
            </button>
          </div>

          {/* Tab Content: Bookings */}
          {activeTab === "bookings" && (
            <div className="bookings-section">
              {bookings.length > 0 ? (
                <div className="tickets-grid">
                  {bookings.map((booking) => {
                    const isCancelled = booking.status === "CANCELLED";
                    return (
                      <div className={`ticket-card ${isCancelled ? "ticket-card--cancelled" : ""}`} key={booking.id}>
                        <div className="ticket-card-top">
                          <span className="ticket-ref">{booking.bookingReference}</span>
                          <span className={`status-badge status-badge--${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="ticket-body">
                          <h3>{booking.eventTitle}</h3>
                          <p className="ticket-category-tag">{booking.eventCategory}</p>

                          <div className="ticket-meta">
                            <p><FaCalendarAlt /> {booking.eventDate}</p>
                            <p><FaMapMarkerAlt /> {booking.eventLocation}</p>
                          </div>

                          <div className="ticket-footer-info">
                            <div>
                              <span className="info-label">Tickets</span>
                              <strong>{booking.numberOfTickets} Pass{booking.numberOfTickets > 1 ? "es" : ""}</strong>
                            </div>
                            <div>
                              <span className="info-label">Amount</span>
                              <strong>{booking.totalAmount === 0 ? "Free" : `₹${booking.totalAmount}`}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="ticket-actions">
                          <button
                            className="view-ticket-pass-btn"
                            onClick={() => setSelectedTicket(booking)}
                          >
                            <FaQrcode /> View Digital Pass
                          </button>

                          {!isCancelled && (
                            <button
                              className="cancel-ticket-btn"
                              onClick={() => setCancellingBookingId(booking.id)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-data-card">
                  <FaTicketAlt className="no-data-icon" />
                  <h2>No Event Passes Yet</h2>
                  <p>Explore exciting campus hackathons, workshops, music fests and book your free or paid seat.</p>
                  <Link to="/events" className="primary-link-btn">
                    Explore Events
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Profile Settings */}
          {activeTab === "profile" && (
            <div className="profile-section-card">
              <h2>Profile Details</h2>
              <p className="section-sub">Manage your personal information and event attendee profile.</p>

              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="disabled-input"
                  />
                  <small>Email address cannot be changed.</small>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <button type="submit" className="save-profile-btn" disabled={updatingProfile}>
                  {updatingProfile ? "Saving Changes..." : "Save Profile"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Digital Ticket Modal */}
      {selectedTicket && (
        <div className="modal-backdrop" onClick={() => setSelectedTicket(null)}>
          <div className="ticket-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTicket(null)}>
              <FaTimes />
            </button>

            <div className="ticket-modal-header">
              <div className="modal-logo">KAIROS EVENT PASS</div>
              <span className={`status-badge status-badge--${selectedTicket.status.toLowerCase()}`}>
                {selectedTicket.status}
              </span>
            </div>

            <h2 className="modal-ticket-title">{selectedTicket.eventTitle}</h2>
            <p className="modal-ticket-ref">Ref: {selectedTicket.bookingReference}</p>

            <div className="modal-ticket-grid">
              <div>
                <span className="info-label">Attendee Name</span>
                <strong>{selectedTicket.attendeeName}</strong>
              </div>
              <div>
                <span className="info-label">Date & Time</span>
                <strong>{selectedTicket.eventDate}</strong>
              </div>
              <div>
                <span className="info-label">Venue</span>
                <strong>{selectedTicket.eventLocation}</strong>
              </div>
              <div>
                <span className="info-label">Admit Count</span>
                <strong>{selectedTicket.numberOfTickets} Person(s)</strong>
              </div>
            </div>

            <div className="modal-qr-section">
              <div className="qr-box">
                <FaQrcode className="qr-graphic" />
              </div>
              <code>{selectedTicket.ticketQrCode || selectedTicket.bookingReference}</code>
              <p className="qr-hint">Scan at event gate for instant check-in</p>
            </div>

            <div className="modal-actions">
              <button className="print-ticket-btn" onClick={() => window.print()}>
                🖨️ Print Ticket
              </button>
              <button className="close-ticket-btn" onClick={() => setSelectedTicket(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingBookingId && (
        <div className="modal-backdrop" onClick={() => setCancellingBookingId(null)}>
          <div className="confirm-modal-card" onClick={(e) => e.stopPropagation()}>
            <FaExclamationTriangle className="warn-icon" />
            <h2>Cancel Reservation?</h2>
            <p>
              Are you sure you want to cancel this booking? The reserved seat will be returned to the event pool.
            </p>
            <div className="modal-confirm-actions">
              <button
                className="confirm-danger-btn"
                onClick={() => handleCancelBooking(cancellingBookingId)}
              >
                Yes, Cancel Pass
              </button>
              <button
                className="confirm-cancel-btn"
                onClick={() => setCancellingBookingId(null)}
              >
                Keep Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserDashboard;