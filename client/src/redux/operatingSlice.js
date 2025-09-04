import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE } from "../utils/apiBase";

export const fetchOperatingStatus = createAsyncThunk(
  "operating/fetchStatus",
  async () => {
    const { data } = await axios.get(`${API_BASE}/operating-hours/status`);
    return data.status;
  }
);

const operatingSlice = createSlice({
  name: "operating",
  initialState: { status: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOperatingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOperatingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
      })
      .addCase(fetchOperatingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to fetch";
      });
  },
});

export default operatingSlice.reducer;
