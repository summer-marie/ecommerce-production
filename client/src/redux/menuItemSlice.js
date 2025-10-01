import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import menuItemService from "./menuItemService";
import { logger } from "../utils/logger.js";

// Get All
export const menuItemGetAll = createAsyncThunk(
  "menuItem/getAll",
  async (filters = {}) => {
    logger.debug("menuItemGetAll start");
    const response = await menuItemService.menuItemGetAll(filters);
    logger.debug("menuItemGetAll success", response?.data?.count);
    return response.data;
  }
);

// Create
export const menuItemCreate = createAsyncThunk(
  "menuItem/create",
  async (menuItem, thunkAPI) => {
    try {
      logger.debug("menuItemCreate", menuItem?.itemName);
      const response = await menuItemService.menuItemCreate(menuItem);
      logger.debug(
        "menuItemCreate response",
        response?.menuItem?.id || response?.menuItem?._id
      );
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.message);
      }
      return response;
    } catch (error) {
      logger.error("menuItemCreate error", error?.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Get One
export const menuItemGetOne = createAsyncThunk(
  "menuItem/getOne",
  async (id) => {
    const response = await menuItemService.menuItemGetOne(id);
    return response.data.menuItem; // just the menuItem object
  }
);

// Update
export const menuItemUpdate = createAsyncThunk(
  "menuItem/updateOne",
  async (formData, thunkAPI) => {
    try {
      const response = await menuItemService.menuItemUpdate(formData);
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

// Delete
export const menuItemDelete = createAsyncThunk(
  "menuItem/deleteOne",
  async (id) => {
    const response = await menuItemService.menuItemDelete(id);
    return response.id; // Just return the id
  }
);

const initialState = {
  loading: false,
  menuItem: {
    itemName: "",
    itemType: "",
    itemPrice: 0,
    description: "",
    base: {},
    sauce: {},
    meatTopping: [],
    veggieTopping: [],
    herbs: [],
    otherAdditions: [],
    image: null,
    isAvailable: true,
    isFeatured: false,
    sortOrder: 0,
  },
  menuItems: [],
};

export const menuItemSlice = createSlice({
  name: "menuItem",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(menuItemCreate.pending, (state) => {
        logger.debug("menuItemCreate.pending");
        state.loading = true;
      })
      .addCase(menuItemCreate.fulfilled, (state, action) => {
        logger.debug("menuItemCreate.fulfilled");
        state.loading = false;
        // Optimistically add new menu item to list if returned shape matches
        if (action.payload?.menuItem) {
          // Normalize id field
          const newMenuItem = action.payload.menuItem;
          if (
            !state.menuItems.find(
              (item) =>
                item.id === newMenuItem.id || item._id === newMenuItem._id
            )
          ) {
            state.menuItems.push(newMenuItem);
          }
        }
      })
      .addCase(menuItemCreate.rejected, (state, action) => {
        logger.warn("menuItemCreate.rejected", action.payload);
        state.loading = false;
      })

      // Get All
      .addCase(menuItemGetAll.pending, (state) => {
        logger.debug("menuItemGetAll.pending");
        state.loading = true;
      })
      .addCase(menuItemGetAll.fulfilled, (state, action) => {
        logger.debug("menuItemGetAll.fulfilled", action.payload?.count);
        state.loading = false;
        // Updates state
        state.menuItems = action.payload.menuItems;
      })
      .addCase(menuItemGetAll.rejected, (state, action) => {
        logger.warn("menuItemGetAll.rejected", action.payload);
        state.loading = false;
      })

      // Get one
      .addCase(menuItemGetOne.pending, (state) => {
        logger.debug("menuItemGetOne.pending");
        state.loading = true;
      })
      .addCase(menuItemGetOne.fulfilled, (state, action) => {
        if (!action.payload) {
          logger.error("menuItemGetOne.fulfilled missing payload");
          state.loading = false;
          state.menuItem = null;
          return;
        }
        const menuItemData = action.payload; // action.payload IS the menuItem object
        logger.debug("menuItemGetOne.fulfilled", menuItemData?.id);
        state.loading = false;
        state.menuItem = menuItemData;
      })
      .addCase(menuItemGetOne.rejected, (state, action) => {
        logger.warn("menuItemGetOne.rejected", action.payload);
        state.loading = false;
      })

      // Update
      .addCase(menuItemUpdate.pending, (state) => {
        logger.debug("menuItemUpdate.pending");
        state.loading = true;
      })
      .addCase(menuItemUpdate.fulfilled, (state, action) => {
        logger.debug("menuItemUpdate.fulfilled", action.payload);
        state.loading = false;
        // Update the menuItem in the list
        const index = state.menuItems.findIndex(
          (item) =>
            item.id === action.payload.menuItem?.id ||
            item._id === action.payload.menuItem?._id
        );
        if (index !== -1) {
          state.menuItems[index] = action.payload.menuItem;
        }
        state.menuItem = action.payload.menuItem;
      })
      .addCase(menuItemUpdate.rejected, (state, action) => {
        logger.warn("menuItemUpdate.rejected", action.payload);
        state.loading = false;
      })

      // Delete
      .addCase(menuItemDelete.pending, (state) => {
        logger.debug("menuItemDelete.pending");
        state.loading = true;
      })
      .addCase(menuItemDelete.fulfilled, (state, action) => {
        logger.debug("menuItemDelete.fulfilled", action.payload);
        state.loading = false;
        // Remove from list
        state.menuItems = state.menuItems.filter(
          (item) => item.id !== action.payload && item._id !== action.payload
        );
        // Clear current if it was deleted
        if (
          state.menuItem?.id === action.payload ||
          state.menuItem?._id === action.payload
        ) {
          state.menuItem = null;
        }
      })
      .addCase(menuItemDelete.rejected, (state, action) => {
        logger.warn("menuItemDelete.rejected", action.payload);
        state.loading = false;
      });
  },
});

export default menuItemSlice.reducer;
