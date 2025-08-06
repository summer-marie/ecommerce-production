import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import builderService from "./builderService";

const initialState = {
  loading: false,
  builder: {
    pizzaName: "",
    pizzaPrice: 0,
    base: [],
    sauce: {},
    meatTopping: [],
    veggieTopping: [],
    image: [],
  },
  builders: [],
};

// Get Many
export const builderGetMany = createAsyncThunk("builder/getMany", async () => {
  console.log("redux builderGetMany builder");
  const response = await builderService.builderGetMany();
  console.log("redux builderGetMany builder response", response);
  return response.data;
});

// Create
export const builderCreate = createAsyncThunk(
  "builder/create",
  async (builder) => {
    console.log("redux builderCreate builder", builder);
    const response = await builderService.builderCreate(builder);
    console.log(response);
    return response.data;
  }
);

// Get One
export const pizzaGetOne = createAsyncThunk("builder/getOne", async (id) => {
  const response = await builderService.pizzaGetOne(id);
  return response.pizza; // just the pizza object
});

// Update
export const builderUpdateOne = createAsyncThunk(
  "builder/updateOne",
  async (formData, thunkAPI) => {
    try {
      const response = await builderService.builderUpdateOne(formData);
      if (!response.data.success) {
        return thunkAPI.rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Alternative Delete
export const builderDeleteOneAlt = createAsyncThunk(
  "builder/deleteOneAlt",
  async (id) => {
    const response = await builderService.builderDeleteOneAlt(id);
    return response.id; // Just return the id
  }
);

export const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(builderCreate.pending, (state, action) => {
        console.log("builderSlice builderCreate.pending", action.payload);
        state.loading = true;
      })
      .addCase(builderCreate.fulfilled, (state, action) => {
        console.log("builderSlice builderCreate.fulfilled", action.payload);
        state.loading = false;
      })
      .addCase(builderCreate.rejected, (state, action) => {
        console.log("builderSlice builderCreate.rejected", action.payload);
        state.loading = false;
      })

      // Get Many
      .addCase(builderGetMany.pending, (state, action) => {
        console.log("builderSlice builderGetMany.pending", action.payload);
        state.loading = true;
      })
      .addCase(builderGetMany.fulfilled, (state, action) => {
        console.log("builderSlice builderGetMany.fulfilled", action.payload);
        state.loading = false;
        // Updates state
        state.builders = action.payload.builders;
      })
      .addCase(builderGetMany.rejected, (state, action) => {
        console.log("builderSlice builderGetMany.rejected", action.payload);
        state.loading = false;
      })

      // Pizza get one
      .addCase(pizzaGetOne.pending, (state, action) => {
        console.log("builderSlice pizzaGetOne.pending", action.payload);
        state.loading = true;
      })
      .addCase(pizzaGetOne.fulfilled, (state, action) => {
        if (!action.payload) {
          console.error("pizzaGetOne.fulfilled: payload is undefined!", action);
          state.loading = false;
          state.builder = null;
          return;
        }
        const builderData = action.payload; // action.payload IS the pizza object
        console.log("builderSlice pizzaGetOne.fulfilled", builderData);
        state.loading = false;
        state.builder = builderData;
      })
      .addCase(pizzaGetOne.rejected, (state, action) => {
        console.log("builderSlice pizzaGetOne.rejected", action.payload);
        state.loading = false;
      })

      // Update
      .addCase(builderUpdateOne.pending, (state, action) => {
        console.log("builderSlice builderUpdateOne.pending", action.payload);
        state.loading = true;
      })
      .addCase(builderUpdateOne.fulfilled, (state, action) => {
        console.log(
          "builderSlice builderUpdateOne.fulfilled",
          action.payload.builder
        );
        state.loading = false;
        state.builder = action.payload.builder;
        // state.builders = state.builders.map((builder) =>
        //   builder.id === action.payload.builder.id
        //     ? action.payload.builder
        //     : builder
        // )
      })
      .addCase(builderUpdateOne.rejected, (state, action) => {
        console.log("builderSlice builderUpdateOne.rejected", action.payload);
        state.loading = false;
      })

      // Alternative Delete
      .addCase(builderDeleteOneAlt.fulfilled, (state, action) => {
        const index = state.builders.findIndex(
          (builder) => builder.id === action.payload
        );
        if (index !== -1) {
          state.builders.splice(index, 1);
        }
        state.loading = false;
      });
  },
});

export default builderSlice.reducer;

//
