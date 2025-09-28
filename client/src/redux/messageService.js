import axios from "axios";
import { API_BASE } from "../utils/apiBase.js";
import { logger } from "../utils/logger";

const messageService = {
  // Create a new message
  sendMessage: async (messageData) => {
    const response = await axios.post(`${API_BASE}/messages`, messageData);
    logger.debug("messageService sendMessage response", response);
    return response;
  },

  // Get all messages
  getMessages: async () => {
    const response = await axios.get(`${API_BASE}/messages`);
    logger.debug("messageService getMessages response", response);
    return response;
  },

  // Update message read status
  updateMessageRead: async (id) => {
    const response = await axios.put(`${API_BASE}/messages/${id}`);
    logger.debug("messageService updateMessageRead response", response);
    return response;
  },

  // Delete a message
  deleteMessage: async (id) => {
    return await axios.delete(`${API_BASE}/messages/${id}`);
  },
};

export default messageService;
