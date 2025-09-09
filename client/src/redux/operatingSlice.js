import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE } from "../utils/apiBase";

// public
export const fetchOperatingStatus = createAsyncThunk(
  "operating/fetchStatus",
  async () => {
    const { data } = await axios.get(`${API_BASE}/operating-hours/status`);
    return data.status;
  }
);

// admin only
export const fetchOperatingConfig = createAsyncThunk(
  "operating/fetchConfig",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      console.log('Fetching operating config. Auth token present:', !!auth.token);
      console.log('API_BASE:', API_BASE);
      
      const { data } = await axios.get(`${API_BASE}/operating-hours`, {
        headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
        withCredentials: true,
      });
      
      console.log('Operating config response:', data);
      return data.config;
    } catch (error) {
      console.error('Operating config fetch error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to fetch config");
    }
  }
);

// admin only
export const updateOperatingConfig = createAsyncThunk(
  "operating/updateConfig",
  async (configData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await axios.put(`${API_BASE}/operating-hours`, configData, {
        headers: {
          "Content-Type": "application/json",
          ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
        },
        withCredentials: true,
      });
      return configData; // Return the sent data as the new config
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update config");
    }
  }
);

const operatingSlice = createSlice({
  name: "operating",
  initialState: {
    status: null,
    config: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    // admin only
    updateConfigField: (state, action) => {
      const { field, value } = action.payload;
      if (state.config) {
        state.config[field] = value;
      }
    },
    // admin only
    updateWeeklyHours: (state, action) => {
      const { day, hours } = action.payload;
      if (state.config) {
        state.config.weeklyHours = state.config.weeklyHours || {};
        state.config.weeklyHours[day] = hours;
      }
    },
    // admin only
    updateSpecialWindows: (state, action) => {
      if (state.config) {
        state.config.specialOpenWindows = action.payload;
      }
    },
  },
  // admin only
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
      })
      .addCase(fetchOperatingConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOperatingConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = {
          devForceOpen: false,
          forceClosed: false,
          adminAlertEmails: [],
          bannerMessageClosed:
            "We're closed right now. Please check back soon.",
          bannerMessageOpen: "We're open and accepting orders!",
          weeklyHours: {},
          specialOpenWindows: [],
          ...action.payload, // Spread server data
          timezone: "America/Phoenix", // Always force Arizona timezone
        };
      })
      .addCase(fetchOperatingConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch config";
      })
      .addCase(updateOperatingConfig.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateOperatingConfig.fulfilled, (state, action) => {
        state.saving = false;
        state.config = { ...action.payload, timezone: "America/Phoenix" };
      })
      .addCase(updateOperatingConfig.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to update config";
      });
  },
});

// admin only
export const { updateConfigField, updateWeeklyHours, updateSpecialWindows } =
  operatingSlice.actions;
export default operatingSlice.reducer;
