import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("kairos_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("kairos_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("kairos_token");
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem("kairos_user", JSON.stringify(res.data));
          }
        } catch {
          // Token expired or invalid
          logout(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      if (res.success && res.data) {
        const { token: jwtToken, user: userData } = res.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem("kairos_token", jwtToken);
        localStorage.setItem("kairos_user", JSON.stringify(userData));
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      }
      return { success: false, message: res.message };
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (res.success && res.data) {
        const { token: jwtToken, user: newUser } = res.data;
        setToken(jwtToken);
        setUser(newUser);
        localStorage.setItem("kairos_token", jwtToken);
        localStorage.setItem("kairos_user", JSON.stringify(newUser));
        toast.success(`Account created successfully! Welcome, ${newUser.name}.`);
        return { success: true, user: newUser };
      }
      return { success: false, message: res.message };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.validationErrors
        ? Object.values(err.response?.data?.validationErrors || {}).join(", ")
        : "Registration failed. Please check your inputs.";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = (showToast = true) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("kairos_token");
    localStorage.removeItem("kairos_user");
    if (showToast) {
      toast.success("Logged out successfully");
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("kairos_user", JSON.stringify(updatedUser));
  };

  const role = user?.role || "";
  const isOrganizer = role === "ORGANIZER" || role === "ADMIN";
  const isAdmin = role === "ADMIN";
  const isUser = role === "USER";
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        role,
        isOrganizer,
        isAdmin,
        isUser,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
