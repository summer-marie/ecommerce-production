import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logger } from "../utils/logger";
import messageService from "./messageService";

const initialState = {
  loading: false,
  message: {
    email: "",
    subject: "",
    message: "",
    date: null,
    isRead: false,
  },
  messages: [],
  error: null,
};

// Send message
export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await messageService.sendMessage(messageData);
      return response.data;
    } catch (err) {
      // Pass a serializable error message
      return rejectWithValue(
        err.response?.data?.message || err.message || "Unknown error"
      );
    }
  }
);

// Get all messages
export const getMessages = createAsyncThunk("message/getAll", async () => {
  logger.debug("messageSlice getMessages start");
  const response = await messageService.getMessages();
  logger.debug("messageSlice getMessages response", response);
  return response.data;
});

// Update message read status
export const updateMessageRead = createAsyncThunk(
  "message/updateRead",
  async (id) => {
    logger.debug("messageSlice updateMessageRead start", { id });
    const response = await messageService.updateMessageRead(id);
    logger.debug("messageSlice updateMessageRead response", response);
    return response.data;
  }
);

// Delete a message
export const deleteMessage = createAsyncThunk(
  "message/delete",
  async (id, { rejectWithValue }) => {
    try {
      logger.debug("messageSlice deleteMessage start", { id });
      const response = await messageService.deleteMessage(id);
      logger.debug("messageSlice deleteMessage response", response);
      return response.data;
    } catch (err) {
      logger.error("Delete message error", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessage.pending, (state, action) => {
        logger.debug("messageSlice sendMessage.pending", action.payload);
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        logger.debug("messageSlice sendMessage.fulfilled", action.payload);
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        logger.warn("messageSlice sendMessage.rejected", action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      // Get all messages
      .addCase(getMessages.pending, (state, action) => {
        logger.debug("messageSlice getMessages.pending", action.payload);
        state.loading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        logger.debug("messageSlice getMessages.fulfilled", action.payload);
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(getMessages.rejected, (state, action) => {
        logger.warn("messageSlice getMessages.rejected", action.payload);
        state.loading = false;
        state.error = action.error.message;
      })

      // Update message read status
      .addCase(updateMessageRead.pending, (state, action) => {
        logger.debug("messageSlice updateMessageRead.pending", action.payload);
        state.loading = false;
      })
      .addCase(updateMessageRead.fulfilled, (state, action) => {
        logger.debug(
          "messageSlice updateMessageRead.fulfilled",
          action.payload
        );
        state.loading = false;
        state.messages = state.messages.map((msg) =>
          msg.id === action.payload.message.id ? action.payload.message : msg
        );
      })
      .addCase(updateMessageRead.rejected, (state, action) => {
        logger.warn("messageSlice updateMessageRead.rejected", action.payload);
        state.loading = false;
        state.error = action.error.message;
      })

      // DeleteOne
      .addCase(deleteMessage.pending, (state) => {
        logger.debug("messageSlice deleteMessage.pending");
        state.loading = true;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        logger.debug("messageSlice deleteMessage.fulfilled", action.payload);
        state.loading = false;
        // Remove the deleted message from state
        state.messages = state.messages.filter(
          (message) => message.id !== action.payload.id
        );
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        logger.warn("messageSlice deleteMessage.rejected", action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default messageSlice.reducer;
