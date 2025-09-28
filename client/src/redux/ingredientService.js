import axios from "axios";
import { logger } from "../utils/logger";
import { API_BASE } from "../utils/apiBase.js";

const ingredientService = {
  createIngredient: async (ingredient) => {
    return await axios.post(`${API_BASE}/ingredients`, ingredient);
  },

  ingredientGetAll: async () => {
    return await axios.get(`${API_BASE}/ingredients`);
  },

  ingredientGetOne: async (id) => {
    return await axios.get(`${API_BASE}/ingredients/${id}`);
  },

  ingredientUpdateOne: async (ingredient) => {
    return await axios.put(
      `${API_BASE}/ingredients/${ingredient.id}`,
      ingredient
    );
  },

  ingredientsDeleteOne: async (id) => {
    logger.info("Deleting ingredient via API", { id });
    const response = await axios.delete(`${API_BASE}/ingredients/${id}`);
    logger.debug("Delete ingredient response", response.data);
    return response.data; // { success: true, id: ... }
  },
};

export default ingredientService;
