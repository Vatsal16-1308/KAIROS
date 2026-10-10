import { useState, useEffect } from "react";
import "./OrganizerDashboard.css";
import Navbar from "../../components/layout/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import dashboardService from "../../services/dashboardService";
import eventService from "../../services/eventService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaTicketAlt,
  FaMoneyBillWave,
  FaPlus,
  FaUsers,
  FaEdit,
  FaTrash,
  FaTimes,
  FaChartBar,
  FaExclamationCircle,
} from "react-icons/fa";

function OrganizerDashboard() {
  const { user, isAuthenticated, loading: authLoading, isOrganizer } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingAttendeesEventId, setViewingAttendeesEventId] = useState(null);
  const [attendeesList, setAttendeesList] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form states
  const [eventForm, setEventForm] = useState({
    title: "",
    category: "Workshop",
    date: "",
    location: "",
    venueDetails: "",
    price: "Free",
    priceAmount: 0,
    capacity: 100,
    description: "",
    imageUrl: "",
    schedule: [
      { time: "10:00 AM", title: "Opening & Welcome", description: "Registration & Intro" },
      { time: "01:00 PM", title: "Main Session", description: "Keynote & Workshop" },
    ],
  });
  const [submittingForm, setSubmittingForm] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (!isOrganizer) {
        toast.error("Organizer access required");
        navigate("/user-dashboard");
      }
    }
  }, [authLoading, isAuthenticated, isOrganizer, navigate]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getOrganizerDashboard();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch organizer dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isOrganizer) {
      fetchDashboard();
    }
  }, [isAuthenticated, isOrganizer]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setEventForm({
      title: "",
      category: "Workshop",
      date: "",
      location: "",
      venueDetails: "",
      price: "Free",
      priceAmount: 0,
      capacity: 100,
      description: "",
      imageUrl: "",
      schedule: [
        { time: "10:00 AM", title: "Registration & Welcome", description: "Badge pickup" },
        { time: "01:00 PM", title: "Keynote & Hands-on Lab", description: "Interactive session" },
      ],
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title || "",
      category: event.category || "Workshop",
      date: event.date || "",
      location: event.location || "",
      venueDetails: event.venueDetails || "",
      price: event.price || "Free",
      priceAmount: event.priceAmount || 0,
      capacity: event.capacity || 100,
      description: event.description || "",
      imageUrl: event.imageUrl || "",
      schedule: event.schedule && event.schedule.length > 0 ? event.schedule : [
        { time: "10:00 AM", title: "Registration", description: "" }
      ],
    });
    setCreateModalOpen(true);
  };

  const handleAddScheduleItem = () => {
    setEventForm({
      ...eventForm,
      schedule: [...eventForm.schedule, { time: "", title: "", description: "" }],
    });
  };

  const handleRemoveScheduleItem = (index) => {
    const updated = eventForm.schedule.filter((_, i) => i !== index);
    setEventForm({ ...eventForm, schedule: updated });
  };

  const handleScheduleChange = (index, field, value) => {
    const updated = [...eventForm.schedule];
    updated[index][field] = value;
    setEventForm({ ...eventForm, schedule: updated });
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setSubmittingForm(true);

    const priceText = eventForm.priceAmount > 0 ? `₹${eventForm.priceAmount}` : "Free";
    const payload = {
      ...eventForm,
      price: priceText,
      priceAmount: Number(eventForm.priceAmount) || 0,
      capacity: Number(eventForm.capacity) || 100,
      organizerName: user?.organizationName || user?.name,
    };

    try {
      if (editingEvent) {
        const res = await eventService.updateEvent(editingEvent.id, payload);
        if (res.success) {
          toast.success("Event updated successfully!");
        }
      } else {
        const res = await eventService.createEvent(payload);
        if (res.success) {
          toast.success("Event published successfully! 🎉");
        }
      }
      setCreateModalOpen(false);
      fetchDashboard();
    } catch (err) {
      const msg = err.response?.data?.message || "Operation failed";
      toast.error(msg);
    } finally {
      setSubmittingForm(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const res = await eventService.deleteEvent(id);
      if (res.success) {
        toast.success("Event deleted");
        setDeleteConfirmId(null);
        fetchDashboard();
      }
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  const handleViewAttendees = async (eventId) => {
    setViewingAttendeesEventId(eventId);
    setLoadingAttendees(true);
    try {
      const res = await dashboardService.getEventAttendees(eventId);
      if (res.success && res.data) {
        setAttendeesList(res.data);
      }
    } catch (err) {
      toast.error("Failed to load attendees");
    } finally {
      setLoadingAttendees(false);
    }
  };

  if (authLoading || (loading && !dashboardData)) {
    return (
      <>
        <Navbar />
        <div className="organizer-loading">
          <div className="loading-spinner"></div>
          <p>Loading Organizer Workspace...</p>
        </div>
      </>
    );
  }

  const events = dashboardData?.events || [];

  return (
    <>
      <Navbar />
      <div className="organizer-dashboard">
        <div className="dashboard-container">
          {/* Header */}
          <div className="organizer-header-card">
            <div>
              <span className="badge-org">ORGANIZER PORTAL</span>
              <h1>{user?.organizationName || user?.name}</h1>
              <p>Manage campus event listings, track ticket sales, and view registered attendee rosters.</p>
            </div>
            <button className="create-event-btn" onClick={handleOpenCreate}>
              <FaPlus /> Host New Event
            </button>
          </div>

          {/* Stats Grid */}
          <div className="organizer-stats-grid">
            <div className="org-stat-card">
              <div className="stat-icon stat-icon--purple">
                <FaCalendarAlt />
              </div>
              <div>
                <h3>{dashboardData?.totalEvents ?? events.length}</h3>
                <p>Events Hosted</p>
              </div>
            </div>

            <div className="org-stat-card">
              <div className="stat-icon stat-icon--green">
                <FaTicketAlt />
              </div>
              <div>
                <h3>{dashboardData?.totalTicketsSold ?? 0}</h3>
                <p>Tickets Reserved</p>
              </div>
            </div>

            <div className="org-stat-card">
              <div className="stat-icon stat-icon--blue">
                <FaMoneyBillWave />
              </div>
              <div>
                <h3>₹{dashboardData?.totalRevenue?.toLocaleString() ?? 0}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
          </div>

          {/* Events List Table */}
          <div className="events-table-card">
            <div className="table-header">
              <h2>My Managed Events ({events.length})</h2>
              <span className="table-sub">Live status of your campus listings</span>
            </div>

            {events.length > 0 ? (
              <div className="table-responsive">
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>Event Details</th>
                      <th>Category</th>
                      <th>Date & Location</th>
                      <th>Price</th>
                      <th>Tickets Left</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => {
                      const remaining = event.remainingTickets ?? event.capacity;
                      const sold = (event.capacity || 100) - remaining;
                      const percent = Math.round((sold / (event.capacity || 100)) * 100);

                      return (
                        <tr key={event.id}>
                          <td>
                            <div className="event-cell-info">
                              <strong>{event.title}</strong>
                              <small>ID: #{event.id}</small>
                            </div>
                          </td>
                          <td>
                            <span className="category-pill">{event.category}</span>
                          </td>
                          <td>
                            <div>{event.date}</div>
                            <small className="loc-text">{event.location}</small>
                          </td>
                          <td>
                            <strong>{event.price}</strong>
                          </td>
                          <td>
                            <div className="capacity-bar-wrap">
                              <div className="capacity-bar">
                                <div
                                  className="capacity-fill"
                                  style={{ width: `${Math.min(100, percent)}%` }}
                                ></div>
                              </div>
                              <small>{remaining} of {event.capacity} left</small>
                            </div>
                          </td>
                          <td>
                            <div className="action-btn-group">
                              <button
                                className="act-btn act-btn--view"
                                onClick={() => handleViewAttendees(event.id)}
                                title="View Attendees"
                              >
                                <FaUsers />
                              </button>
                              <button
                                className="act-btn act-btn--edit"
                                onClick={() => handleOpenEdit(event)}
                                title="Edit Event"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="act-btn act-btn--delete"
                                onClick={() => setDeleteConfirmId(event.id)}
                                title="Delete Event"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-events-box">
                <FaCalendarAlt className="no-events-icon" />
                <h3>No Events Created Yet</h3>
                <p>Click "Host New Event" above to publish your first college hackathon or workshop.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create / Edit Event Modal */}
      {createModalOpen && (
        <div className="modal-backdrop" onClick={() => setCreateModalOpen(false)}>
          <div className="event-form-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setCreateModalOpen(false)}>
              <FaTimes />
            </button>

            <h2>{editingEvent ? "Edit Event" : "Host a New Campus Event"}</h2>
            <p className="modal-sub">Fill out the details below to publish your event on Kairos.</p>

            <form onSubmit={handleSubmitEvent} className="event-modal-form">
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Event Title *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="e.g. AI Innovation Summit"
                  />
                </div>

                <div className="form-group flex-1">
                  <label>Category *</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Cultural Fest">Cultural Fest</option>
                    <option value="Seminars">Seminars</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Display Date *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    placeholder="e.g. 24 Aug 2026"
                  />
                </div>

                <div className="form-group flex-1">
                  <label>Location / Hall *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="e.g. Main Auditorium"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Ticket Price (₹) - Set 0 for Free *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={eventForm.priceAmount}
                    onChange={(e) => setEventForm({ ...eventForm, priceAmount: e.target.value })}
                  />
                </div>

                <div className="form-group flex-1">
                  <label>Capacity (Total Seats) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={eventForm.capacity}
                    onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Describe your event agenda, rules, and benefits for attendees..."
                ></textarea>
              </div>

              {/* Schedule Builder */}
              <div className="schedule-builder">
                <div className="builder-top">
                  <label>Event Schedule Timeline</label>
                  <button type="button" className="add-schedule-btn" onClick={handleAddScheduleItem}>
                    + Add Time Slot
                  </button>
                </div>

                {eventForm.schedule.map((slot, index) => (
                  <div className="schedule-slot-row" key={index}>
                    <input
                      type="text"
                      placeholder="e.g. 10:00 AM"
                      value={slot.time}
                      onChange={(e) => handleScheduleChange(index, "time", e.target.value)}
                      className="slot-time-input"
                    />
                    <input
                      type="text"
                      placeholder="Session Title"
                      value={slot.title}
                      onChange={(e) => handleScheduleChange(index, "title", e.target.value)}
                      className="slot-title-input"
                    />
                    <button
                      type="button"
                      className="remove-slot-btn"
                      onClick={() => handleRemoveScheduleItem(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>

              <div className="modal-actions-row">
                <button type="submit" className="publish-event-btn" disabled={submittingForm}>
                  {submittingForm ? "Saving..." : editingEvent ? "Update Event" : "Publish Event"}
                </button>
                <button
                  type="button"
                  className="cancel-modal-btn"
                  onClick={() => setCreateModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendees Modal */}
      {viewingAttendeesEventId && (
        <div className="modal-backdrop" onClick={() => setViewingAttendeesEventId(null)}>
          <div className="attendees-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setViewingAttendeesEventId(null)}>
              <FaTimes />
            </button>

            <h2>Registered Attendees</h2>
            <p className="modal-sub">List of tickets confirmed for Event #{viewingAttendeesEventId}</p>

            {loadingAttendees ? (
              <div className="modal-loading">
                <div className="loading-spinner"></div>
                <p>Loading attendee list...</p>
              </div>
            ) : attendeesList.length > 0 ? (
              <div className="attendees-table-wrap">
                <table className="attendees-table">
                  <thead>
                    <tr>
                      <th>Attendee</th>
                      <th>Contact</th>
                      <th>Passes</th>
                      <th>Ref Code</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendeesList.map((att) => (
                      <tr key={att.id}>
                        <td>
                          <strong>{att.attendeeName}</strong>
                        </td>
                        <td>
                          <div>{att.attendeeEmail}</div>
                          <small>{att.attendeePhone || "N/A"}</small>
                        </td>
                        <td>{att.numberOfTickets}</td>
                        <td>
                          <code>{att.bookingReference}</code>
                        </td>
                        <td>
                          <span className={`status-badge status-badge--${att.status.toLowerCase()}`}>
                            {att.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-attendees">
                <p>No tickets booked for this event yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirmId(null)}>
          <div className="confirm-modal-card" onClick={(e) => e.stopPropagation()}>
            <FaExclamationCircle className="warn-icon" />
            <h2>Delete Event Listing?</h2>
            <p>Are you sure you want to permanently delete this event? This action cannot be undone.</p>
            <div className="modal-confirm-actions">
              <button
                className="confirm-danger-btn"
                onClick={() => handleDeleteEvent(deleteConfirmId)}
              >
                Yes, Delete
              </button>
              <button
                className="confirm-cancel-btn"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrganizerDashboard;