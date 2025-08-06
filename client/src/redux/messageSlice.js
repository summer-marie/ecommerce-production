import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
  console.log("redux getMessages");
  const response = await messageService.getMessages();
  console.log("redux getMessages response", response);
  return response.data;
});

// Update message read status
export const updateMessageRead = createAsyncThunk(
  "message/updateRead",
  async (id) => {
    console.log("redux updateMessageRead id", id);
    const response = await messageService.updateMessageRead(id);
    console.log(response);
    return response.data;
  }
);

// Delete a message
export const deleteMessage = createAsyncThunk(
  "message/delete",
  async (id, { rejectWithValue }) => {
    try {
      console.log("redux deleteMessage id", id);
      const response = await messageService.deleteMessage(id);
      console.log("messageService deleteMessage response:", response);
      return response.data;
    } catch (err) {
      console.error("Delete message error:", err);
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
        console.log("messageSlice sendMessage.pending", action.payload);
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        console.log("messageSlice sendMessage.fulfilled", action.payload);
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        console.log("messageSlice sendMessage.rejected", action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      // Get all messages
      .addCase(getMessages.pending, (state, action) => {
        console.log("messageSlice getMessages.pending", action.payload);
        state.loading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        console.log("messageSlice getMessages.fulfilled", action.payload);
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(getMessages.rejected, (state, action) => {
        console.log("messageSlice getMessages.rejected", action.payload);
        state.loading = false;
        state.error = action.error.message;
      })

      // Update message read status
      .addCase(updateMessageRead.pending, (state, action) => {
        console.log("messageSlice updateMessageRead.pending", action.payload);
        state.loading = false;
      })
      .addCase(updateMessageRead.fulfilled, (state, action) => {
        console.log("messageSlice updateMessageRead.fulfilled", action.payload);
        state.loading = false;
        state.messages = state.messages.map((msg) =>
          msg.id === action.payload.message.id ? action.payload.message : msg
        );
      })
      .addCase(updateMessageRead.rejected, (state, action) => {
        console.log("messageSlice updateMessageRead.rejected", action.payload);
        state.loading = false;
        state.error = action.error.message;
      })

      // DeleteOne
      .addCase(deleteMessage.pending, (state) => {
        console.log("messageSlice deleteMessage.pending");
        state.loading = true;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        console.log("messageSlice deleteMessage.fulfilled", action.payload);
        state.loading = false;
        // Remove the deleted message from state
        state.messages = state.messages.filter(
          (message) => message.id !== action.payload.id
        );
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        console.log("messageSlice deleteMessage.rejected", action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default messageSlice.reducer;
