import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import aboutService from "./aboutService";

export const fetchAbout = createAsyncThunk("about/fetch", async (_, thunkAPI) => {
  try {
    return await aboutService.get();
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message || "Failed to load about");
  }
});

export const updateAbout = createAsyncThunk("about/update", async (payload, thunkAPI) => {
  try {
    return await aboutService.update(payload);
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message || "Failed to update about");
  }
});

const initialState = {
  data: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  updating: false,
};

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAbout.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchAbout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load";
      })
      .addCase(updateAbout.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateAbout.fulfilled, (state, action) => {
        state.updating = false;
        state.data = action.payload;
      })
      .addCase(updateAbout.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Failed to update";
      });
  },
});

export default aboutSlice.reducer;
