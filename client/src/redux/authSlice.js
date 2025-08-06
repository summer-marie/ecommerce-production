import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const initialState = {
  authUser: JSON.parse(localStorage.getItem("userOn") || "null"),
  token: localStorage.getItem("token"),
  loading: true, // Add this
};
export const login = createAsyncThunk("auth/authUser", async (loginForm) => {
  console.log("authUser THUNK");
  const response = await authService.login(loginForm);
  console.log("authUser THUNK response", response.user);

  return response;
});

export const status = createAsyncThunk("auth/authStatus", async () => {
  console.log("STATUS authUser THUNK");
  const response = await authService.status();
  console.log("STATUS authUser THUNK response", response);
  return response.data;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  console.log("logout authUser THUNK");
  const response = await authService.logout();
  console.log("logout authUser THUNK response", response);
  return response.data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
// This action takes a payload containing the token and user data.
// It updates the token and authUser properties in the Redux state.
// It also sets loading to false to indicate that the authentication state has been restored.
  setAuthFromStorage: (state, action) => {
    state.token = action.payload.token;
    state.authUser = action.payload.user;
    state.loading = false;  
  },
  },
  extraReducers: (builder) => {
    builder
      // auth login
      .addCase(login.pending, (state, action) => {
        console.log("pending authSlice action.payload", action.payload);
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("login.fulfilled payload:", action.payload);
        state.loading = false;
        state.authUser = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("userOn", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        console.log("rejected authSlice action.payload", action.payload);
        state.loading = false;
      })
      // auth status
      .addCase(status.pending, (state, action) => {
        console.log("pending authSlice action.payload", action.payload);
        state.loading = true;
      })
      .addCase(status.fulfilled, (state, action) => {
        console.log("authSlice action.payload", action.payload);
        state.loading = false;
        // state.authUser = action.payload.;
      })
      .addCase(status.rejected, (state, action) => {
        console.log("rejected authSlice action.payload", action.payload);
        state.loading = false;
      })
      // logout but what does this really do
      .addCase(logout.pending, (state, action) => {
        console.log("LOGOUT pending authSlice action.payload", action.payload);
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        console.log("LOGOUT authSlice action.payload", action.payload);
        state.loading = false;
        state.authUser = {};
        state.token = null;
        localStorage.removeItem("userOn");
        localStorage.removeItem("token");
      })
      .addCase(logout.rejected, (state, action) => {
        console.log("LOGOUT rejected authSlice action.payload", action.payload);
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
export const { setAuthFromStorage } = authSlice.actions;
