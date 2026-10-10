import { useState, useEffect } from "react";
import "./Admin.css";
import Navbar from "../../components/layout/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import dashboardService from "../../services/dashboardService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaCalendarAlt,
  FaTicketAlt,
  FaMoneyBillWave,
  FaShieldAlt,
  FaTrash,
  FaCheck,
  FaBan,
  FaExchangeAlt,
} from "react-icons/fa";

function Admin() {
  const { user, isAuthenticated, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "users", "events", "bookings"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (!isAdmin) {
        toast.error("Admin privileges required");
        navigate("/");
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [dashRes, usersRes, eventsRes, bookingsRes] = await Promise.all([
        dashboardService.getAdminDashboard(),
        dashboardService.getAllUsers(),
        dashboardService.getAllEventsAdmin(),
        dashboardService.getAllBookingsAdmin(),
      ]);

      if (dashRes.success) setDashboardData(dashRes.data);
      if (usersRes.success) setUsersList(usersRes.data);
      if (eventsRes.success) setEventsList(eventsRes.data);
      if (bookingsRes.success) setBookingsList(bookingsRes.data);
    } catch (err) {
      console.error("Failed to load admin panel", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchAdminData();
    }
  }, [isAuthenticated, isAdmin]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await dashboardService.updateUserRole(userId, newRole);
      if (res.success) {
        toast.success("User role updated successfully");
        fetchAdminData();
      }
    } catch (err) {
      toast.error("Failed to update user role");
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await dashboardService.toggleUserStatus(userId);
      if (res.success) {
        toast.success("User status changed");
        fetchAdminData();
      }
    } catch (err) {
      toast.error("Failed to change user status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user permanently?")) {
      try {
        const res = await dashboardService.deleteUser(userId);
        if (res.success) {
          toast.success("User deleted");
          fetchAdminData();
        }
      } catch (err) {
        toast.error("Failed to delete user");
      }
    }
  };

  const handleEventStatusChange = async (eventId, newStatus) => {
    try {
      const res = await dashboardService.updateEventStatus(eventId, newStatus);
      if (res.success) {
        toast.success(`Event status changed to ${newStatus}`);
        fetchAdminData();
      }
    } catch (err) {
      toast.error("Failed to update event status");
    }
  };

  if (authLoading || (loading && !dashboardData)) {
    return (
      <>
        <Navbar />
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Loading Admin Dashboard...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-page">
        <div className="admin-container">
          {/* Header */}
          <div className="admin-header-card">
            <div>
              <span className="badge-admin"><FaShieldAlt /> SYSTEM ADMINISTRATION</span>
              <h1>Kairos Control Center</h1>
              <p>Platform monitoring, user role authorization, and event catalog moderation.</p>
            </div>
            <div className="admin-user-pill">
              Logged in as <strong>{user?.name}</strong>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="stat-icon stat-icon--purple">
                <FaUsers />
              </div>
              <div>
                <h3>{dashboardData?.totalUsers ?? usersList.length}</h3>
                <p>Registered Users</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon stat-icon--green">
                <FaCalendarAlt />
              </div>
              <div>
                <h3>{dashboardData?.totalEvents ?? eventsList.length}</h3>
                <p>Total Events</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon stat-icon--blue">
                <FaTicketAlt />
              </div>
              <div>
                <h3>{dashboardData?.totalBookings ?? bookingsList.length}</h3>
                <p>Passes Booked</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon stat-icon--yellow">
                <FaMoneyBillWave />
              </div>
              <div>
                <h3>₹{dashboardData?.totalRevenue?.toLocaleString() ?? 0}</h3>
                <p>Platform Volume</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              📊 System Overview
            </button>
            <button
              className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              👥 Users Directory ({usersList.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "events" ? "active" : ""}`}
              onClick={() => setActiveTab("events")}
            >
              📅 Events Moderation ({eventsList.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              🎟️ Transactions ({bookingsList.length})
            </button>
          </div>

          {/* Tab: Overview */}
          {activeTab === "overview" && (
            <div className="admin-overview-grid">
              <div className="overview-card">
                <h2>Recent Platform Activity</h2>
                <div className="activity-list">
                  {bookingsList.slice(0, 5).map((b) => (
                    <div className="activity-item" key={b.id}>
                      <div className="activity-icon">🎟️</div>
                      <div className="activity-text">
                        <strong>{b.attendeeName}</strong> reserved {b.numberOfTickets} ticket(s) for <em>{b.eventTitle}</em>
                        <small>{b.bookingReference} • {b.totalAmount === 0 ? "Free" : `₹${b.totalAmount}`}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overview-card">
                <h2>Platform Health & Stack Status</h2>
                <div className="health-metrics">
                  <div className="metric-row">
                    <span>Backend Runtime</span>
                    <strong className="badge-green">Java 17 LTS + Spring Boot 3</strong>
                  </div>
                  <div className="metric-row">
                    <span>Database Engine</span>
                    <strong className="badge-green">MySQL + Hibernate JPA</strong>
                  </div>
                  <div className="metric-row">
                    <span>Frontend Client</span>
                    <strong className="badge-green">React + Vite + Axios</strong>
                  </div>
                  <div className="metric-row">
                    <span>Security Engine</span>
                    <strong className="badge-green">BCrypt + JWT Bearer Auth</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Users */}
          {activeTab === "users" && (
            <div className="admin-table-card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Organization</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <strong>{u.name}</strong>
                          <small>ID: #{u.id}</small>
                        </td>
                        <td>{u.email}</td>
                        <td>{u.organizationName || "—"}</td>
                        <td>
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="role-select"
                            disabled={u.email === user?.email}
                          >
                            <option value="USER">USER</option>
                            <option value="ORGANIZER">ORGANIZER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className={`status-toggle-btn ${u.active ? "active" : "inactive"}`}
                            onClick={() => handleToggleStatus(u.id)}
                            disabled={u.email === user?.email}
                          >
                            {u.active ? "Active" : "Disabled"}
                          </button>
                        </td>
                        <td>
                          {u.email !== user?.email && (
                            <button
                              className="act-btn act-btn--delete"
                              onClick={() => handleDeleteUser(u.id)}
                              title="Delete User"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Events */}
          {activeTab === "events" && (
            <div className="admin-table-card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Organizer</th>
                      <th>Date</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Moderate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsList.map((ev) => (
                      <tr key={ev.id}>
                        <td>
                          <strong>{ev.title}</strong>
                        </td>
                        <td>
                          <span className="category-pill">{ev.category}</span>
                        </td>
                        <td>{ev.organizer || "—"}</td>
                        <td>{ev.date}</td>
                        <td>{ev.price}</td>
                        <td>
                          <span className={`status-badge status-badge--${ev.status?.toLowerCase()}`}>
                            {ev.status}
                          </span>
                        </td>
                        <td>
                          <div className="status-btn-group">
                            <button
                              className="mod-btn mod-btn--publish"
                              onClick={() => handleEventStatusChange(ev.id, "PUBLISHED")}
                              title="Publish"
                            >
                              <FaCheck />
                            </button>
                            <button
                              className="mod-btn mod-btn--cancel"
                              onClick={() => handleEventStatusChange(ev.id, "CANCELLED")}
                              title="Cancel Event"
                            >
                              <FaBan />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Bookings */}
          {activeTab === "bookings" && (
            <div className="admin-table-card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ref Code</th>
                      <th>Event</th>
                      <th>Attendee</th>
                      <th>Passes</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingsList.map((bk) => (
                      <tr key={bk.id}>
                        <td>
                          <code>{bk.bookingReference}</code>
                        </td>
                        <td>
                          <strong>{bk.eventTitle}</strong>
                        </td>
                        <td>
                          <div>{bk.attendeeName}</div>
                          <small>{bk.attendeeEmail}</small>
                        </td>
                        <td>{bk.numberOfTickets}</td>
                        <td>{bk.totalAmount === 0 ? "Free" : `₹${bk.totalAmount}`}</td>
                        <td>
                          <span className={`status-badge status-badge--${bk.status?.toLowerCase()}`}>
                            {bk.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Admin;