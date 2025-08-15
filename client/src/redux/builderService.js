import axios from "axios";

const builderService = {
  builderGetMany: async () => {
    return await axios.get(`${import.meta.env.VITE_API_SERVER_URL}/builders`);
  },

  builderCreate: async (pizzaData) => {
    try {
      console.log("Sending pizza data to server...", pizzaData);
      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/builders`,
        pizzaData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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
    const response = await axios.get(
      `${import.meta.env.VITE_API_SERVER_URL}/builders/pizza-detail/${id}`
    );
    return response.data; // just the data, not the whole Axios response
  },

  builderUpdateOne(pizzaData) {
    const id = pizzaData.id;
    if (!id) {
      throw new Error("No ID provided in pizza data");
    }
    return axios.put(
      `${import.meta.env.VITE_API_SERVER_URL}/builders/${id}`,
      pizzaData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  },

  builderDeleteOneAlt: async (id) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_SERVER_URL}/builders/${id}`
    );
    return response.data; // { success: true, id: ... }
  },
};
export default builderService;
