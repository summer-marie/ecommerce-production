import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "./paymentService";

// Mirror style of orderSlice: verbose logging & standard state keys
const initialState = {
  loading: false,
  lastResult: null,
  error: null,
};

// Create payment
export const createSquarePayment = createAsyncThunk(
  "payment/createSquarePayment",
  async (paymentData) => {
    console.log("redux createSquarePayment paymentData", paymentData);
    const response = await paymentService.createSquarePayment(paymentData);
    console.log("redux createSquarePayment response", response);
    return response.data;
  }
);

// Get payment status
export const getSquarePaymentStatus = createAsyncThunk(
  "payment/getSquarePaymentStatus",
  async (paymentId) => {
    console.log("redux getSquarePaymentStatus paymentId", paymentId);
    const response = await paymentService.getSquarePaymentStatus(paymentId);
    console.log("redux getSquarePaymentStatus response", response);
    return response.data;
  }
);

// Test Square connection
export const testSquareConnection = createAsyncThunk(
  "payment/testSquareConnection",
  async () => {
    console.log("redux testSquareConnection");
    const response = await paymentService.testSquareConnection();
    console.log("redux testSquareConnection response", response);
    return response.data;
  }
);

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create payment
      .addCase(createSquarePayment.pending, (state, action) => {
        console.log("paymentSlice createSquarePayment.pending", action.payload);
        state.loading = true;
        state.error = null;
      })
      .addCase(createSquarePayment.fulfilled, (state, action) => {
        console.log("paymentSlice createSquarePayment.fulfilled", action.payload);
        state.loading = false;
        state.lastResult = action.payload;
      })
      .addCase(createSquarePayment.rejected, (state, action) => {
        console.log("paymentSlice createSquarePayment.rejected", action.payload);
        state.loading = false;
        state.error = action.error?.message;
      })

      // Get payment status
      .addCase(getSquarePaymentStatus.pending, (state, action) => {
        console.log("paymentSlice getSquarePaymentStatus.pending", action.payload);
        state.loading = true;
        state.error = null;
      })
      .addCase(getSquarePaymentStatus.fulfilled, (state, action) => {
        console.log("paymentSlice getSquarePaymentStatus.fulfilled", action.payload);
        state.loading = false;
        state.lastResult = action.payload;
      })
      .addCase(getSquarePaymentStatus.rejected, (state, action) => {
        console.log("paymentSlice getSquarePaymentStatus.rejected", action.payload);
        state.loading = false;
        state.error = action.error?.message;
      })

      // Test Square connection
      .addCase(testSquareConnection.pending, (state, action) => {
        console.log("paymentSlice testSquareConnection.pending", action.payload);
        state.loading = true;
        state.error = null;
      })
      .addCase(testSquareConnection.fulfilled, (state, action) => {
        console.log("paymentSlice testSquareConnection.fulfilled", action.payload);
        state.loading = false;
        state.lastResult = action.payload;
      })
      .addCase(testSquareConnection.rejected, (state, action) => {
        console.log("paymentSlice testSquareConnection.rejected", action.payload);
        state.loading = false;
        state.error = action.error?.message;
      });
  },
});

export default paymentSlice.reducer;
