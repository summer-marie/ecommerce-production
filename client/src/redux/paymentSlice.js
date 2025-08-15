import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "./paymentService";

// Consistent initial state definition
const initialState = { loading: false, lastResult: null, error: null };

export const createSquarePayment = createAsyncThunk(
  "payment/createSquarePayment",
  async (paymentData) => {
    const res = await paymentService.createSquarePayment(paymentData);
    return res.data;
  }
);

export const getSquarePaymentStatus = createAsyncThunk(
  "payment/getSquarePaymentStatus",
  async (paymentId) => {
    const res = await paymentService.getSquarePaymentStatus(paymentId);
    return res.data;
  }
);

export const testSquareConnection = createAsyncThunk(
  "payment/testSquareConnection",
  async () => {
    const res = await paymentService.testSquareConnection();
    return res.data;
  }
);

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // createSquarePayment
      .addCase(createSquarePayment.pending, (s, a) => {
        console.log("paymentSlice createSquarePayment.pending", a.payload);
        s.loading = true;
        s.error = null;
      })
      .addCase(createSquarePayment.fulfilled, (s, a) => {
        console.log("paymentSlice createSquarePayment.fulfilled", a.payload);
        s.loading = false;
        s.lastResult = a.payload;
      })
      .addCase(createSquarePayment.rejected, (s, a) => {
        console.log("paymentSlice createSquarePayment.rejected", a.payload);
        s.loading = false;
        s.error = a.error?.message;
      })

      // getSquarePaymentStatus
      .addCase(getSquarePaymentStatus.pending, (s, a) => {
        console.log("paymentSlice getSquarePaymentStatus.pending", a.payload);
        s.loading = true;
        s.error = null;
      })
      .addCase(getSquarePaymentStatus.fulfilled, (s, a) => {
        console.log("paymentSlice getSquarePaymentStatus.fulfilled", a.payload);
        s.loading = false;
        s.lastResult = a.payload;
      })
      .addCase(getSquarePaymentStatus.rejected, (s, a) => {
        console.log("paymentSlice getSquarePaymentStatus.rejected", a.payload);
        s.loading = false;
        s.error = a.error?.message;
      })

      // testSquareConnection
      .addCase(testSquareConnection.pending, (s, a) => {
        console.log("paymentSlice testSquareConnection.pending", a.payload);
        s.loading = true;
        s.error = null;
      })
      .addCase(testSquareConnection.fulfilled, (s, a) => {
        console.log("paymentSlice testSquareConnection.fulfilled", a.payload);
        s.loading = false;
        s.lastResult = a.payload;
      })
      .addCase(testSquareConnection.rejected, (s, a) => {
        console.log("paymentSlice testSquareConnection.rejected", a.payload);
        s.loading = false;
        s.error = a.error?.message;
      });
  },
});

export default paymentSlice.reducer;
