import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "./paymentService";
import { logger } from "../utils/logger";

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
    logger.debug("createSquarePayment start", { paymentData });
    const response = await paymentService.createSquarePayment(paymentData);
    logger.debug("createSquarePayment response", response?.data);
    return response.data;
  }
);

// Get payment status
export const getSquarePaymentStatus = createAsyncThunk(
  "payment/getSquarePaymentStatus",
  async (paymentId) => {
    logger.debug("getSquarePaymentStatus start", { paymentId });
    const response = await paymentService.getSquarePaymentStatus(paymentId);
    logger.debug("getSquarePaymentStatus response", response?.data);
    return response.data;
  }
);

// Test Square connection
export const testSquareConnection = createAsyncThunk(
  "payment/testSquareConnection",
  async () => {
    logger.debug("testSquareConnection start");
    const response = await paymentService.testSquareConnection();
    logger.debug("testSquareConnection response", response?.data);
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
        logger.debug("createSquarePayment.pending", action.payload);
        state.loading = true;
        state.error = null;
      })
      .addCase(createSquarePayment.fulfilled, (state, action) => {
        logger.debug("createSquarePayment.fulfilled", action.payload);
        state.loading = false;
        state.lastResult = action.payload;
      })
      .addCase(createSquarePayment.rejected, (state, action) => {
        logger.warn("createSquarePayment.rejected", action.payload);
        state.loading = false;
        state.error = action.error?.message;
      })

      // Get payment status
      .addCase(getSquarePaymentStatus.pending, (state, action) => {
        logger.debug("getSquarePaymentStatus.pending", action.payload);
        state.loading = true;
        state.error = null;
      })
      .addCase(getSquarePaymentStatus.fulfilled, (state, action) => {
        logger.debug("getSquarePaymentStatus.fulfilled", action.payload);
        state.loading = false;
        state.lastResult = action.payload;
      })
      .addCase(getSquarePaymentStatus.rejected, (state, action) => {
        logger.warn("getSquarePaymentStatus.rejected", action.payload);
        state.loading = false;
        state.error = action.error?.message;
      })

      // Test Square connection
      .addCase(testSquareConnection.pending, (state, action) => {
        logger.debug("testSquareConnection.pending", action.payload);
        state.loading = true;
        state.error = null;
      })
      .addCase(testSquareConnection.fulfilled, (state, action) => {
        logger.debug("testSquareConnection.fulfilled", action.payload);
        state.loading = false;
        state.lastResult = action.payload;
      })
      .addCase(testSquareConnection.rejected, (state, action) => {
        logger.warn("testSquareConnection.rejected", action.payload);
        state.loading = false;
        state.error = action.error?.message;
      });
  },
});

export default paymentSlice.reducer;
