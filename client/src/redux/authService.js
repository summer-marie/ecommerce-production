import axios from "axios";
import { API_BASE } from "../utils/apiBase.js";

const authService = {
  login: async ({ email, password }) => {
    console.log("NEW authService login", email, password);
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password,
    });
    console.log(" NEW response", response.data);
    return response.data;
  },

  changePassword: async ({ currentPassword, newPassword }) => {
    const token = localStorage.getItem("token");
    console.log("NEW authService changePassword token", token?.slice(0, 12) + "...");
    const response = await axios.post(
      `${API_BASE}/auth/change-password`,
      { currentPassword, newPassword },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    console.log("NEW changePassword response", response.data);
    return response.data;
  },

  status: async () => {
    const token = localStorage.getItem("token");
    console.log("NEW authService status token", token);
    const response = await axios.get(`${API_BASE}/auth/status`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    console.log("NEW response", response.data);
    return response.data;
  },

  logout: async () => {
    try {
      const token = localStorage.getItem("token");

      // If there's no token, skip network call and just clear local state
      if (!token) {
        localStorage.removeItem("token");
        localStorage.removeItem("userOn");
        return { message: "Logged out locally" };
      }

      // Make logout request
      const response = await axios.post(`${API_BASE}/auth/logout`, {}, {
        withCredentials: true,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userOn");

      return response.data;
  } catch {
      // Still clear localStorage even if request fails
      localStorage.removeItem("token");
      localStorage.removeItem("userOn");
      // Resolve gracefully so UI can proceed without refresh
      return { message: "Logged out locally" };
    }
  },
};

export default authService;
