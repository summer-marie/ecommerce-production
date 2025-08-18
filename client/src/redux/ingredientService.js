import axios from "axios";
import { API_BASE } from "../utils/apiBase.js";

const ingredientService = {
  createIngredient: async (ingredient) => {
    return await axios.post(
  `${API_BASE}/ingredients`,
      ingredient
    );
  },

  ingredientGetAll: async () => {
    return await axios.get(
  `${API_BASE}/ingredients`
    );
  },

  ingredientGetOne: async (id) => {
    return await axios.get(
  `${API_BASE}/ingredients/${id}`
    );
  },

  ingredientUpdateOne: async (ingredient) => {
    return await axios.put(
  `${API_BASE}/ingredients/${ingredient.id}`,
      ingredient
    );
  },

  ingredientsDeleteOne: async (id) => {
    console.log("API call to delete ingredient with ID:", id); // Log API call
    const response = await axios.delete(
  `${API_BASE}/ingredients/${id}`
    );
    console.log("API response for delete:", response.data); // Log API response
    return response.data; // { success: true, id: ... }
  },
};

export default ingredientService;
