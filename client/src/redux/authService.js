import axios from "axios";

const authService = {
  login: async ({ email, password }) => {
    console.log("NEW authService login", email, password);
    const response = await axios.post(
      `${import.meta.env.VITE_API_SERVER_URL}/auth/login`,
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
      `${import.meta.env.VITE_API_SERVER_URL}/auth/status`,
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
        `${import.meta.env.VITE_API_SERVER_URL}/auth/logout/`,
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
