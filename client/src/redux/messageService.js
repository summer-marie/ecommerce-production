import axios from "axios";

const messageService = {
  // Create a new message
  sendMessage: async (messageData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_SERVER_URL}/messages`,
      messageData
    );
    console.log("messageService sendMessage response:", response);
    return response;
  },

  // Get all messages
  getMessages: async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_SERVER_URL}/messages`
    );
    console.log("messageService getMessages response:", response);
    return response;
  },

  // Update message read status
  updateMessageRead: async (id) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_SERVER_URL}/messages/${id}`
    );
    console.log("messageService updateMessageRead response:", response);
    return response;
  },
  
  // Delete a message
  deleteMessage: async (id) => {
    return await axios.delete(
      `${import.meta.env.VITE_API_SERVER_URL}/messages/${id}`
    );
  },
};

export default messageService;
