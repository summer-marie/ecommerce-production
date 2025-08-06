import "dotenv/config";
import axios from "axios";
import { createFakeMessages } from "./createFakeMsgs.js";

// Generate 10 fake messages
const testMessages = createFakeMessages(5);

// Add each message to the database
testMessages.forEach(async (message) => {
  try {
    const response = await axios.post(
      `${process.env.SERVER_URL}/messages`,
      message
    );
    console.log("Added message:", response.data.message.subject);
  } catch (error) {
    console.error("Error adding message:", error.message);
  }
});