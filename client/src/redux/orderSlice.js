import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "./orderService";
import { logger } from "../utils/logger";

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
  logger.debug("createOrder start", order);
  const response = await orderService.createOrder(order);
  logger.debug("createOrder response", response?.data?.orderNumber);
  return response.data;
});

// Update order status
export const orderUpdateStatus = createAsyncThunk(
  "order/update",
  async (payload) => {
    // payload expected: { id: string, status: { status: string } }
    logger.debug("orderUpdateStatus start", payload);
    const response = await orderService.orderUpdateStatus(payload);
    logger.debug("orderUpdateStatus response", response?.data?.status);
    return response.data;
  }
);
// Order get one
export const orderGetOne = createAsyncThunk("order/getOne", async (id) => {
  logger.debug("orderGetOne start", id);
  const response = await orderService.orderGetOne(id);
  logger.debug("orderGetOne response", response?.data?.order?.orderNumber);
  return response.data;
});

// Get ALL
export const orderGetAll = createAsyncThunk("order/getAll", async () => {
  logger.debug("orderGetAll start");
  const response = await orderService.orderGetAll();
  logger.debug("orderGetAll response", response?.data?.orders?.length);
  return response.data;
});

// Get Only open orders
export const orderGetOpen = createAsyncThunk("order/getOpen", async () => {
  logger.debug("orderGetOpen start");
  const response = await orderService.orderGetOpen();
  logger.debug("orderGetOpen response", response?.data?.orders?.length);
  return response.data;
});

// Get archived orders
export const orderGetArchived = createAsyncThunk(
  "order/getArchived",
  async () => {
    logger.debug("orderGetArchived start");
    const response = await orderService.orderGetArchived();
    logger.debug("orderGetArchived response", response?.data?.orders?.length);
    return response.data;
  }
);

// Archive order
export const orderArchiveOne = createAsyncThunk(
  "order/archiveOne",
  async (id) => {
    logger.debug("orderArchiveOne start", id);
    const response = await orderService.orderArchiveOne(id);
    logger.debug(
      "orderArchiveOne response",
      response?.data?.order?.orderNumber
    );
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
    logger.debug("getCleanupPreview start");
    const response = await orderService.getCleanupPreview();
    logger.debug("getCleanupPreview response", response?.data?.preview?.count);
    return response.data;
  }
);

// Manual cleanup of archived orders
export const cleanupArchivedOrders = createAsyncThunk(
  "order/cleanupArchived",
  async (_, { rejectWithValue }) => {
    try {
      logger.debug("cleanupArchivedOrders start");
      const response = await orderService.cleanupArchivedOrders();
      logger.debug(
        "cleanupArchivedOrders response",
        response?.data?.deletedCount
      );
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
      .addCase(createOrder.pending, (state) => {
        logger.debug("orderSlice createOrder.pending");
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        logger.debug(
          "orderSlice createOrder.fulfilled",
          action.payload?.order?.orderNumber
        );
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        logger.warn("orderSlice createOrder.rejected", action.payload);
        state.loading = false;
      })

      // Update status
      .addCase(orderUpdateStatus.pending, (state) => {
        logger.debug("orderSlice orderUpdateStatus.pending");
        state.loading = true;
      })
      .addCase(orderUpdateStatus.fulfilled, (state, action) => {
        logger.debug(
          "orderSlice orderUpdateStatus.fulfilled",
          action.payload?.order?.status
        );
        // const updatedOrder = state.orders.map((order) =>
        //   order._id === action.payload._id ? action.payload : order
        // )
        state.loading = false;
        state.orders = action.payload.orders;
      })

      .addCase(orderUpdateStatus.rejected, (state, action) => {
        logger.warn("orderSlice orderUpdateStatus.rejected", action.payload);
        state.loading = false;
      })

      // Order get one
      .addCase(orderGetOne.pending, (state) => {
        logger.debug("orderSlice orderGetOne.pending");
        state.loading = true;
      })
      .addCase(orderGetOne.fulfilled, (state, action) => {
        logger.debug(
          "orderSlice orderGetOne.fulfilled",
          action.payload?.order?.orderNumber
        );
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase(orderGetOne.rejected, (state, action) => {
        logger.warn("orderSlice orderGetOne.rejected", action.payload);
        state.loading = false;
      })

      // Get all/No Validation
      .addCase(orderGetAll.pending, (state) => {
        logger.debug("orderSlice orderGetAll.pending");
        state.loading = true;
      })
      .addCase(orderGetAll.fulfilled, (state, action) => {
        logger.debug(
          "orderSlice orderGetAll.fulfilled",
          action.payload?.orders?.length
        );
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(orderGetAll.rejected, (state, action) => {
        logger.warn("orderSlice orderGetAll.rejected", action.payload);
        state.loading = false;
      })

      // Get only open orders
      .addCase(orderGetOpen.pending, (state) => {
        logger.debug("orderSlice orderGetOpen.pending");
        state.loading = true;
      })
      .addCase(orderGetOpen.fulfilled, (state, action) => {
        logger.debug(
          "orderSlice orderGetOpen.fulfilled",
          action.payload?.orders?.length
        );
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(orderGetOpen.rejected, (state, action) => {
        logger.warn("orderSlice orderGetOpen.rejected", action.payload);
        state.loading = false;
      })

      // Get archived orders
      .addCase(orderGetArchived.pending, (state) => {
        logger.debug("orderSlice orderGetArchived.pending");
        state.loading = true;
      })
      .addCase(orderGetArchived.fulfilled, (state, action) => {
        logger.debug(
          "orderSlice orderGetArchived.fulfilled",
          action.payload?.orders?.length
        );
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(orderGetArchived.rejected, (state, action) => {
        logger.warn("orderSlice orderGetArchived.rejected", action.payload);
        state.loading = false;
      })

      // Archive order
      .addCase(orderArchiveOne.pending, (state) => {
        logger.debug("orderSlice orderArchiveOne.pending");
        state.loading = true;
      })
      .addCase(orderArchiveOne.fulfilled, (state, action) => {
        logger.debug(
          "orderSlice orderArchiveOne.fulfilled",
          action.payload?.order?.orderNumber
        );

        state.loading = false;
        // Update the archived order in state.orders by id
        state.orders = state.orders.map((order) =>
          order.id === action.payload.order.id ? action.payload.order : order
        );
      })
      .addCase(orderArchiveOne.rejected, (state, action) => {
        logger.warn("orderSlice orderArchiveOne.rejected", action.payload);
        state.loading = false;
      })

      // Mark order payment failed
      .addCase(markOrderPaymentFailed.pending, (state) => {
        logger.debug("orderSlice markOrderPaymentFailed.pending");
        state.loading = true;
      })
      .addCase(markOrderPaymentFailed.fulfilled, (state, action) => {
        logger.debug(
          "orderSlice markOrderPaymentFailed.fulfilled",
          action.payload?.order?.status
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
        logger.warn(
          "orderSlice markOrderPaymentFailed.rejected",
          action.payload || action.error
        );
        state.loading = false;
        // Optionally capture error for UI
        state.error = action.payload || action.error;
      })

      // Get cleanup preview
      .addCase(getCleanupPreview.pending, (state) => {
        logger.debug("orderSlice getCleanupPreview.pending");
        state.cleanup.loading = true;
        state.cleanup.error = null;
      })
      .addCase(getCleanupPreview.fulfilled, (state, action) => {
        logger.debug(
          "orderSlice getCleanupPreview.fulfilled",
          action.payload?.preview?.count
        );
        state.cleanup.loading = false;
        state.cleanup.preview = action.payload.preview;
      })
      .addCase(getCleanupPreview.rejected, (state, action) => {
        logger.warn("orderSlice getCleanupPreview.rejected", action.payload);
        state.cleanup.loading = false;
        state.cleanup.error =
          action.payload?.message || "Failed to get cleanup preview";
      })

      // Cleanup archived orders
      .addCase(cleanupArchivedOrders.pending, (state) => {
        logger.debug("orderSlice cleanupArchivedOrders.pending");
        state.cleanup.loading = true;
        state.cleanup.error = null;
      })
      .addCase(cleanupArchivedOrders.fulfilled, (state, action) => {
        logger.debug(
          "orderSlice cleanupArchivedOrders.fulfilled",
          action.payload?.deletedCount
        );
        state.cleanup.loading = false;
        state.cleanup.lastCleanupResult = action.payload;
        // If we're on the archived orders page, we should refresh the orders list
        // This will be handled by the component
      })
      .addCase(cleanupArchivedOrders.rejected, (state, action) => {
        logger.warn(
          "orderSlice cleanupArchivedOrders.rejected",
          action.payload
        );
        state.cleanup.loading = false;
        state.cleanup.error =
          action.payload?.message || "Failed to cleanup archived orders";
      });
  },
});

export default orderSlice.reducer;
