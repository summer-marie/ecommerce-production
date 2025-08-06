import axios from "axios";

const builderService = {
  builderGetMany: async () => {
    return await axios.get(`${import.meta.env.VITE_API_SERVER_URL}/builders`);
  },

  builderCreate: async (formData) => {
    try {
      console.log("Sending FormData to server...");
      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/builders`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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

  builderUpdateOne(formData) {
    const id = formData.get("id");
    if (!id) {
      throw new Error("No ID provided in formData");
    }
    return axios.put(
      `${import.meta.env.VITE_API_SERVER_URL}/builders/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
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
