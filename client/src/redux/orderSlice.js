import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "./orderService";

const initialState = {
  loading: false,
  order: {
    orderNumber: "",
    date: "",
    orderDetails: {
      pizzaName: "",
      pizzaPrice: 0,
      quantity: 0,
    },
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    phone: "",
    firstName: "",
    lastName: "",
    orderTotal: 0,
    status: "",
    isArchived: false,
    payment: {
      status: "pending",
      method: "square",
      squarePaymentId: "",
      receiptNumber: "",
      amountPaid: 0,
      paidAt: null,
    },
  },
  orders: [],
  cleanup: {
    loading: false,
    preview: null,
    lastCleanupResult: null,
    error: null,
  },
};

// Order create
export const createOrder = createAsyncThunk("order/create", async (order) => {
  console.log("redux createOrder order", order);
  const response = await orderService.createOrder(order);
  console.log(response);
  return response.data;
});

// Update order status
export const orderUpdateStatus = createAsyncThunk(
  "order/update",
  async (id) => {
    console.log("redux orderUpdateStatus order", id);
    const response = await orderService.orderUpdateStatus(id);
    console.log(response);
    return response.data;
  }
);
// Order get one
export const orderGetOne = createAsyncThunk("order/getOne", async (id) => {
  console.log("redux orderGetOne order", id);
  const response = await orderService.orderGetOne(id);
  console.log(response);
  return response.data;
});

// Get ALL
export const orderGetAll = createAsyncThunk("order/getAll", async () => {
  console.log("redux orderGetAll order");
  const response = await orderService.orderGetAll();
  console.log("redux orderGetAll order response", response);
  return response.data;
});

// Get Only open orders
export const orderGetOpen = createAsyncThunk("order/getOpen", async () => {
  console.log("redux orderGetOpen order");
  const response = await orderService.orderGetOpen();
  console.log("redux orderGetOpen order response", response);
  return response.data;
});

// Get archived orders
export const orderGetArchived = createAsyncThunk(
  "order/getArchived",
  async () => {
    console.log("redux orderGetArchived order");
    const response = await orderService.orderGetArchived();
    console.log("redux orderGetArchived order response", response);
    return response.data;
  }
);

// Archive order
export const orderArchiveOne = createAsyncThunk(
  "order/archiveOne",
  async (id) => {
    console.log("redux orderArchiveOne id", id);
    const response = await orderService.orderArchiveOne(id);
    console.log(response);
    return response.data;
  }
);

// Soft-cancel an order by orderNumber (payment failed)
export const markOrderPaymentFailed = createAsyncThunk(
  "order/markPaymentFailed",
  async ({ orderNumber, reason }, { rejectWithValue }) => {
    try {
      const response = await orderService.markPaymentFailedByOrderNumber(
        orderNumber,
        reason
      );
      return response.data;
    } catch (err) {
      // Normalize axios error structure
      const payload = err?.response?.data || {
        message: err.message || "Payment failed",
      };
      return rejectWithValue(payload);
    }
  }
);

// Get cleanup preview
export const getCleanupPreview = createAsyncThunk(
  "order/getCleanupPreview",
  async () => {
    console.log("redux getCleanupPreview");
    const response = await orderService.getCleanupPreview();
    console.log("redux getCleanupPreview response", response);
    return response.data;
  }
);

// Manual cleanup of archived orders
export const cleanupArchivedOrders = createAsyncThunk(
  "order/cleanupArchived",
  async (_, { rejectWithValue }) => {
    try {
      console.log("redux cleanupArchivedOrders");
      const response = await orderService.cleanupArchivedOrders();
      console.log("redux cleanupArchivedOrders response", response);
      return response.data;
    } catch (err) {
      const payload = err?.response?.data || {
        message: err.message || "Cleanup failed",
      };
      return rejectWithValue(payload);
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Create one
      .addCase(createOrder.pending, (state, action) => {
        console.log("orderSlice createOrder.pending", action.payload);
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        console.log("orderSlice createOrder.fulfilled", action.payload);
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        console.log("orderSlice createOrder.rejected", action.payload);
        state.loading = false;
      })

      // Update status
      .addCase(orderUpdateStatus.pending, (state, action) => {
        console.log("orderSlice orderUpdateStatus.pending", action.payload);
        state.loading = true;
      })
      .addCase(orderUpdateStatus.fulfilled, (state, action) => {
        console.log("orderSlice orderUpdateStatus.fulfilled", action.payload);
        // const updatedOrder = state.orders.map((order) =>
        //   order._id === action.payload._id ? action.payload : order
        // )
        state.loading = false;
        state.orders = action.payload.orders;
      })

      .addCase(orderUpdateStatus.rejected, (state, action) => {
        console.log("orderSlice orderUpdateStatus.rejected", action.payload);
        state.loading = false;
      })

      // Order get one
      .addCase(orderGetOne.pending, (state, action) => {
        console.log("orderSlice orderGetOne.pending", action.payload);
        state.loading = true;
      })
      .addCase(orderGetOne.fulfilled, (state, action) => {
        console.log("orderSlice orderGetOne.fulfilled", action.payload);
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase(orderGetOne.rejected, (state, action) => {
        console.log("orderSlice orderGetOne.rejected", action.payload);
        state.loading = false;
      })

      // Get all/No Validation
      .addCase(orderGetAll.pending, (state, action) => {
        console.log("orderSlice orderGetAll.pending", action.payload);
        state.loading = true;
      })
      .addCase(orderGetAll.fulfilled, (state, action) => {
        console.log("orderSlice orderGetAll.fulfilled", action.payload);
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(orderGetAll.rejected, (state, action) => {
        console.log("orderSlice orderGetAll.rejected", action.payload);
        state.loading = false;
      })

      // Get only open orders
      .addCase(orderGetOpen.pending, (state, action) => {
        console.log("orderSlice orderGetOpen.pending", action.payload);
        state.loading = true;
      })
      .addCase(orderGetOpen.fulfilled, (state, action) => {
        console.log("orderSlice orderGetOpen.fulfilled", action.payload);
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(orderGetOpen.rejected, (state, action) => {
        console.log("orderSlice orderGetOpen.rejected", action.payload);
        state.loading = false;
      })

      // Get archived orders
      .addCase(orderGetArchived.pending, (state, action) => {
        console.log("orderSlice orderGetArchived.pending", action.payload);
        state.loading = true;
      })
      .addCase(orderGetArchived.fulfilled, (state, action) => {
        console.log("orderSlice orderGetArchived.fulfilled", action.payload);
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(orderGetArchived.rejected, (state, action) => {
        console.log("orderSlice orderGetArchived.rejected", action.payload);
        state.loading = false;
      })

      // Archive order
      .addCase(orderArchiveOne.pending, (state, action) => {
        console.log("orderSlice orderArchiveOne.pending", action.payload);
        state.loading = true;
      })
      .addCase(orderArchiveOne.fulfilled, (state, action) => {
        console.log("orderSlice orderArchiveOne.fulfilled", action.payload);

        state.loading = false;
        // Remove or update the archived order in state.orders
        state.orders = state.orders.map((order) =>
          order._id === action.payload.order._id ? action.payload.order : order
        );
      })
      .addCase(orderArchiveOne.rejected, (state, action) => {
        console.log("orderSlice orderArchiveOne.rejected", action.payload);
        state.loading = false;
      })

      // Mark order payment failed
      .addCase(markOrderPaymentFailed.pending, (state, action) => {
        console.log(
          "orderSlice markOrderPaymentFailed.pending",
          action.payload
        );
        state.loading = true;
      })
      .addCase(markOrderPaymentFailed.fulfilled, (state, action) => {
        console.log(
          "orderSlice markOrderPaymentFailed.fulfilled",
          action.payload
        );
        state.loading = false;
        // Optionally update state.orders with returned order
        const updated = action.payload?.order;
        if (updated && state.orders?.length) {
          state.orders = state.orders.map((o) =>
            o.orderNumber === updated.orderNumber ? updated : o
          );
        }
      })
      .addCase(markOrderPaymentFailed.rejected, (state, action) => {
        console.log(
          "orderSlice markOrderPaymentFailed.rejected",
          action.payload || action.error
        );
        state.loading = false;
        // Optionally capture error for UI
        state.error = action.payload || action.error;
      })

      // Get cleanup preview
      .addCase(getCleanupPreview.pending, (state, action) => {
        console.log("orderSlice getCleanupPreview.pending", action.payload);
        state.cleanup.loading = true;
        state.cleanup.error = null;
      })
      .addCase(getCleanupPreview.fulfilled, (state, action) => {
        console.log("orderSlice getCleanupPreview.fulfilled", action.payload);
        state.cleanup.loading = false;
        state.cleanup.preview = action.payload.preview;
      })
      .addCase(getCleanupPreview.rejected, (state, action) => {
        console.log("orderSlice getCleanupPreview.rejected", action.payload);
        state.cleanup.loading = false;
        state.cleanup.error = action.payload?.message || "Failed to get cleanup preview";
      })

      // Cleanup archived orders
      .addCase(cleanupArchivedOrders.pending, (state, action) => {
        console.log("orderSlice cleanupArchivedOrders.pending", action.payload);
        state.cleanup.loading = true;
        state.cleanup.error = null;
      })
      .addCase(cleanupArchivedOrders.fulfilled, (state, action) => {
        console.log("orderSlice cleanupArchivedOrders.fulfilled", action.payload);
        state.cleanup.loading = false;
        state.cleanup.lastCleanupResult = action.payload;
        // If we're on the archived orders page, we should refresh the orders list
        // This will be handled by the component
      })
      .addCase(cleanupArchivedOrders.rejected, (state, action) => {
        console.log("orderSlice cleanupArchivedOrders.rejected", action.payload);
        state.cleanup.loading = false;
        state.cleanup.error = action.payload?.message || "Failed to cleanup archived orders";
      });
  },
});

export default orderSlice.reducer;
