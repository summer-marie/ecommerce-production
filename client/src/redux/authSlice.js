import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { logger } from "../utils/logger";

const initialState = {
  authUser: JSON.parse(localStorage.getItem("userOn") || "null"),
  token: localStorage.getItem("token"),
  loading: true,
};

// Login
export const login = createAsyncThunk("auth/authUser", async (loginForm, { rejectWithValue }) => {
  try {
    logger.debug("authUser THUNK start");
    const response = await authService.login(loginForm);
    logger.debug("authUser THUNK response", response?.user);
    return response;
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || err.message || "Login failed");
  }
});

// Status
export const status = createAsyncThunk("auth/authStatus", async (_, { rejectWithValue }) => {
  try {
    logger.debug("STATUS authUser THUNK start");
    const response = await authService.status();
    logger.debug("STATUS authUser THUNK response", response);
    return response.data;
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || err.message || "Status check failed");
  }
});

// Logout
export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    logger.debug("logout authUser THUNK start");
    const response = await authService.logout();
    logger.debug("logout authUser THUNK response", response);
    return response.data;
  } catch (err) {
    return rejectWithValue(err?.response?.data?.message || err.message || "Logout failed");
  }
});

// Change password
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const data = await authService.changePassword({ currentPassword, newPassword });
      if (data?.requireRelogin) {
        localStorage.removeItem("token");
        localStorage.removeItem("userOn");
      }
      return data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Request failed";
      if (/expired|unauthorized|auth/i.test(message)) {
        localStorage.removeItem("token");
        localStorage.removeItem("userOn");
      }
      return rejectWithValue(message);
    }
  }
);

// Change email
export const changeEmail = createAsyncThunk(
  "auth/changeEmail",
  async ({ newEmail, password }, { rejectWithValue }) => {
    try {
      const data = await authService.changeEmail({ newEmail, password });
      return data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Request failed";
      if (/expired|unauthorized|auth/i.test(message)) {
        localStorage.removeItem("token");
        localStorage.removeItem("userOn");
      }
      return rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthFromStorage: (state, action) => {
      state.token = action.payload.token;
      state.authUser = action.payload.user;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        logger.debug("login.pending");
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        logger.debug("login.fulfilled", action.payload?.user?.email);
        state.loading = false;
        state.authUser = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("userOn", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        logger.warn("login.rejected", action.payload);
        state.loading = false;
      })
      // status
      .addCase(status.pending, (state) => {
        logger.debug("status.pending");
        state.loading = true;
      })
      .addCase(status.fulfilled, (state, action) => {
        logger.debug("status.fulfilled", action.payload?.user?.email);
        state.loading = false;
        if (action.payload?.user) {
          state.authUser = { ...state.authUser, ...action.payload.user };
          localStorage.setItem("userOn", JSON.stringify(state.authUser));
        }
      })
      .addCase(status.rejected, (state, action) => {
        logger.warn("status.rejected", action.payload);
        state.loading = false;
      })
      // logout
      .addCase(logout.pending, (state) => {
        logger.debug("logout.pending");
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        logger.debug("logout.fulfilled");
        state.loading = false;
        state.authUser = {};
        state.token = null;
        localStorage.removeItem("userOn");
        localStorage.removeItem("token");
      })
      .addCase(logout.rejected, (state, action) => {
        logger.warn("logout.rejected", action.payload);
        state.loading = false;
      })
      // changePassword (no state change besides maybe future flags)
      .addCase(changePassword.pending, () => {})
      .addCase(changePassword.fulfilled, () => {})
      .addCase(changePassword.rejected, () => {})
      // changeEmail updates email
      .addCase(changeEmail.fulfilled, (state, action) => {
        if (state.authUser && action.payload?.newEmail) {
          state.authUser.email = action.payload.newEmail;
          localStorage.setItem("userOn", JSON.stringify(state.authUser));
        }
      });
  },
});

export default authSlice.reducer;
export const { setAuthFromStorage } = authSlice.actions;
