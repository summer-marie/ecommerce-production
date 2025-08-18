import axios from "axios";
import { API_BASE } from "../utils/apiBase.js";

const authService = {
  login: async ({ email, password }) => {
    console.log("NEW authService login", email, password);
    const response = await axios.post(
  `${API_BASE}/auth/login`,
      { email, password }
    );
    console.log(" NEW response", response.data);
    return response.data;
  },

  status: async () => {
    // Get and parse token from localStorage
    const token = JSON.parse(localStorage.getItem("token"));
    console.log("NEW authService status token", token);
    const response = await axios.get(
  `${API_BASE}/auth/status`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("NEW response", response.data);
    return response.data;
  },

  logout: async () => {
    try {
      const token = localStorage.getItem("token");

      // Make logout request
      const response = await axios.post(
  `${API_BASE}/auth/logout/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userOn");

      return response.data;
    } catch (error) {
      // Still clear localStorage even if request fails
      localStorage.removeItem("token");
      localStorage.removeItem("userOn");
      throw error;
    }
  },
};

export default authService;
