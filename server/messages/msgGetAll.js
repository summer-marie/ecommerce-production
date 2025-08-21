import messageModel from "./msgModel.js";

const messageGetAll = async (req, res) => {
  // Sort by date (newest first)
  const getMessages = await messageModel.find().sort({ date: -1 });

  // Verbose logging removed to avoid spamming console every fetch.
  // If needed for debugging, enable by setting DEBUG_MESSAGES=true.
  if (process.env.DEBUG_MESSAGES === "true") {
    console.log("[Messages] getMessages count:", getMessages.length);
  }

  res.status(200).json({ success: true, messages: getMessages });
};

export default messageGetAll;
