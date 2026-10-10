import api from "./api";

export const eventService = {
  getAllEvents: async (params = {}) => {
    const { category, search, sortBy } = params;
    const queryParams = new URLSearchParams();
    if (category && category !== "All") queryParams.append("category", category);
    if (search) queryParams.append("search", search);
    if (sortBy) queryParams.append("sortBy", sortBy);

    const response = await api.get(`/events?${queryParams.toString()}`);
    return response.data;
  },

  getFeaturedEvents: async () => {
    const response = await api.get("/events/featured");
    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get("/events/categories");
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post("/events", eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

export default eventService;
