import axios from "axios";
// If we later rename env var to VITE_API_BASE we won't need to touch below template literals
import { API_BASE } from "../utils/apiBase.js";

const builderService = {
  builderGetMany: async () => {
    return await axios.get(`${API_BASE}/builders`);
  },

  builderCreate: async (pizzaData) => {
    try {
      console.log("Sending pizza data to server...", pizzaData);
      const response = await axios.post(`${API_BASE}/builders`, pizzaData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Server response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Builder create error details:", {
        message: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },

  pizzaGetOne: async (id) => {
    const response = await axios.get(`${API_BASE}/builders/pizza-detail/${id}`);
    return response.data; // just the data, not the whole Axios response
  },

  builderUpdateOne(pizzaData) {
    const id = pizzaData.id;
    if (!id) {
      throw new Error("No ID provided in pizza data");
    }
    return axios.put(`${API_BASE}/builders/${id}`, pizzaData, {
      headers: { "Content-Type": "application/json" },
    });
  },

  builderDeleteOneAlt: async (id) => {
    const response = await axios.delete(`${API_BASE}/builders/${id}`);
    return response.data; // { success: true, id: ... }
  },
};
export default builderService;
