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

  ingredientGetOne: async (ingredient) => {
    return await axios.get(
      `${import.meta.env.VITE_NODE_SERVER_URL}/ingredient/${ingredient.id}`
    );
  },

  ingredientUpdateOne: async (ingredient) => {
    return await axios.put(
      `${import.meta.env.VITE_API_SERVER_URL}/ingredients/${ingredient.id}`,
      ingredient
    );
  },

  ingredientsDeleteOne: async (id) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_SERVER_URL}/ingredients/${id}`
    );
    return response.data; // { success: true, id: ... }
  },
};

export default ingredientService;
