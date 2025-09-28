import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logger } from "../utils/logger";
import ingredientService from "./ingredientService";

const initialState = {
  loading: false,
  ingredient: {
    name: "",
    description: "",
    itemType: "",
    price: 0,
  },
  ingredients: [],
};

// Order create
export const createIngredient = createAsyncThunk(
  "ingredient/create",
  async (ingredient) => {
    const response = await ingredientService.createIngredient(ingredient);
    return response.data.ingredient; // Return the full ingredient object
  }
);

// Get ALL
export const ingredientGetAll = createAsyncThunk(
  "ingredient/getAll",
  async () => {
    logger.debug("ingredientGetAll thunk start");
    const response = await ingredientService.ingredientGetAll();
    logger.debug("ingredientGetAll thunk response", response);
    return response.data;
  }
);

// Get One
export const ingredientGetOne = createAsyncThunk(
  "ingredient/getOne",
  async (id) => {
    logger.debug("ingredientGetOne thunk start", { id });
    const response = await ingredientService.ingredientGetOne(id);
    logger.debug("ingredientGetOne thunk response", response);
    return response.data;
  }
);

// Update One
export const ingredientUpdateOne = createAsyncThunk(
  "ingredient/updateOne",
  async (ingredient) => {
    logger.debug("ingredientUpdateOne thunk start", ingredient);
    const response = await ingredientService.ingredientUpdateOne(ingredient);
    logger.debug("ingredientUpdateOne thunk response", response);
    return response.data;
  }
);

// Delete One
export const ingredientDeleteOne = createAsyncThunk(
  "ingredient/deleteOne",
  async (id) => {
    const response = await ingredientService.ingredientsDeleteOne(id);
    logger.debug("ingredientDeleteOne thunk response", response);
    return response.id; // Just return the id
  }
);

export const ingredientSlice = createSlice({
  name: "ingredient",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Orders create one
      .addCase(createIngredient.pending, (state, action) => {
        logger.debug(
          "ingredientSlice createIngredient.pending",
          action.payload
        );
        state.loading = true;
      })
      .addCase(createIngredient.fulfilled, (state, action) => {
        state.ingredients.push(action.payload);
        logger.debug(
          "ingredientSlice createIngredient.fulfilled",
          action.payload?.name || action.payload?.id
        );
        state.loading = false;
      })
      .addCase(createIngredient.rejected, (state, action) => {
        logger.warn(
          "ingredientSlice createIngredient.rejected",
          action.payload
        );
        state.loading = false;
      })

      // Orders get all/No Validation
      .addCase(ingredientGetAll.pending, (state, action) => {
        logger.debug(
          "ingredientSlice ingredientGetAll.pending",
          action.payload
        );
        state.loading = true;
      })
      .addCase(ingredientGetAll.fulfilled, (state, action) => {
        logger.debug(
          "ingredientSlice ingredientGetAll.fulfilled count",
          Array.isArray(action.payload?.ingredients)
            ? action.payload.ingredients.length
            : Array.isArray(action.payload)
            ? action.payload.length
            : 0
        );
        state.loading = false;
        if (Array.isArray(action.payload?.ingredients)) {
          state.ingredients = action.payload.ingredients;
        } else if (Array.isArray(action.payload)) {
          // Fallback in case API returned raw array (corrupted earlier code)
          state.ingredients = action.payload;
        } else {
          state.ingredients = [];
        }
      })
      .addCase(ingredientGetAll.rejected, (state, action) => {
        logger.warn(
          "ingredientSlice ingredientGetAll.rejected",
          action.payload
        );
        state.loading = false;
      })

      // Get One
      .addCase(ingredientGetOne.pending, (state, action) => {
        logger.debug(
          "ingredientSlice ingredientGetOne.pending",
          action.payload
        );
        state.loading = true;
      })
      .addCase(ingredientGetOne.fulfilled, (state, action) => {
        logger.debug(
          "ingredientSlice ingredientGetOne.fulfilled",
          action.payload.ingredient?.name
        );
        state.loading = false;
        // Updates state
        state.ingredient = action.payload.ingredient;
      })
      .addCase(ingredientGetOne.rejected, (state, action) => {
        logger.warn(
          "ingredientSlice ingredientGetOne.rejected",
          action.payload
        );
        state.loading = false;
      })

      // Update One
      .addCase(ingredientUpdateOne.pending, (state, action) => {
        logger.debug(
          "ingredientSlice ingredientUpdateOne.pending",
          action.payload
        );
        state.loading = true;
      })
      .addCase(ingredientUpdateOne.fulfilled, (state, action) => {
        logger.debug(
          "ingredientSlice ingredientUpdateOne.fulfilled",
          action.payload?.ingredient?.name
        );
        state.loading = false;
        state.ingredients = state.ingredients.map((ingredient) =>
          ingredient.id === action.payload.ingredient.id
            ? action.payload.ingredient
            : ingredient
        );
      })
      .addCase(ingredientUpdateOne.rejected, (state, action) => {
        logger.warn(
          "ingredientSlice ingredientUpdateOne.rejected",
          action.payload
        );
        state.loading = false;
      })

      // Delete One
      .addCase(ingredientDeleteOne.pending, (state, action) => {
        logger.debug(
          "ingredientSlice ingredientDeleteOne.pending",
          action.payload
        );
        state.loading = true;
      })
      .addCase(ingredientDeleteOne.fulfilled, (state, action) => {
        logger.debug(
          "ingredientSlice ingredientDeleteOne.fulfilled",
          action.payload
        );
        state.loading = false;
        // Remove the ingredient from the state
        state.ingredients = state.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
      })

      .addCase(ingredientDeleteOne.rejected, (state, action) => {
        logger.warn(
          "ingredientSlice ingredientDeleteOne.rejected",
          action.payload
        );
        state.loading = false;
      });
  },
});

export default ingredientSlice.reducer;
