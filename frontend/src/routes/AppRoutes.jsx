import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context
import { AuthProvider, useAuth } from "../context/AuthContext";

// Pages
import Home from "../pages/Home/Home";
import Events from "../pages/Events/Events";
import EventDetails from "../pages/EventDetails/EventDetails";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import UserDashboard from "../pages/UserDashboard/UserDashboard";
import OrganizerDashboard from "../pages/OrganizerDashboard/OrganizerDashboard";
import Admin from "../pages/Admin/Admin";
import NotFound from "../pages/NotFound/NotFound";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p>Loading session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "var(--bg-card, #1a1d24)",
              color: "var(--text-primary, #ffffff)",
              border: "1px solid var(--border, #2d333b)",
              borderRadius: "10px",
              fontSize: "14px",
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Protected Route */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute allowedRoles={["USER", "ORGANIZER", "ADMIN"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Organizer Protected Route */}
          <Route
            path="/organizer-dashboard"
            element={
              <ProtectedRoute allowedRoles={["ORGANIZER", "ADMIN"]}>
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;