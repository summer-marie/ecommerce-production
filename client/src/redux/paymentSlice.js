import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "./paymentService";

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

const paymentSlice = createSlice({
  name: "payment",
  initialState: { loading: false, lastResult: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSquarePayment.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(createSquarePayment.fulfilled, (s, a) => {
        s.loading = false;
        s.lastResult = a.payload;
      })
      .addCase(createSquarePayment.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error?.message;
      })
      .addCase(getSquarePaymentStatus.fulfilled, (s, a) => {
        s.lastResult = a.payload;
      })
      .addCase(testSquareConnection.fulfilled, (s, a) => {
        s.lastResult = a.payload;
      });
  },
});

export default paymentSlice.reducer;
