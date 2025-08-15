import axios from "axios";

const ingredientService = {
  createIngredient: async (ingredient) => {
    return await axios.post(
      `${import.meta.env.VITE_API_SERVER_URL}/ingredients`,
      ingredient
    );
  },

  ingredientGetAll: async () => {
    return await axios.get(
      `${import.meta.env.VITE_API_SERVER_URL}/ingredients`
    );
  },

  ingredientGetOne: async (id) => {
    return await axios.get(
      `${import.meta.env.VITE_API_SERVER_URL}/ingredients/${id}`
    );
  },

  ingredientUpdateOne: async (ingredient) => {
    return await axios.put(
      `${import.meta.env.VITE_API_SERVER_URL}/ingredients/${ingredient.id}`,
      ingredient
    );
  },

  ingredientsDeleteOne: async (id) => {
    console.log("API call to delete ingredient with ID:", id); // Log API call
    const response = await axios.delete(
      `${import.meta.env.VITE_API_SERVER_URL}/ingredients/${id}`
    );
    console.log("API response for delete:", response.data); // Log API response
    return response.data; // { success: true, id: ... }
  },
};

export default ingredientService;
