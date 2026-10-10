import api from "./api";

export const dashboardService = {
  getUserDashboard: async () => {
    const response = await api.get("/users/dashboard");
    return response.data;
  },

  updateUserProfile: async (profileData) => {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  },

  getOrganizerDashboard: async () => {
    const response = await api.get("/organizer/dashboard");
    return response.data;
  },

  getEventAttendees: async (eventId) => {
    const response = await api.get(`/organizer/events/${eventId}/attendees`);
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getAllEventsAdmin: async () => {
    const response = await api.get("/admin/events");
    return response.data;
  },

  updateEventStatus: async (eventId, status) => {
    const response = await api.put(`/admin/events/${eventId}/status`, { status });
    return response.data;
  },

  getAllBookingsAdmin: async () => {
    const response = await api.get("/admin/bookings");
    return response.data;
  },
};

export default dashboardService;
