import messageModel from "./msgModel.js";
import { getLog } from "../utils/logger.js";

const messageGetAll = async (req, res) => {
  // Sort by date (newest first)
  const getMessages = await messageModel.find().sort({ date: -1 });

  // Verbose logging removed to avoid spamming console every fetch.
  // If needed for debugging, enable by setting DEBUG_MESSAGES=true.
  if (process.env.DEBUG_MESSAGES === "true") {
    const log = getLog(req, { event: 'message.list' });
    log.debug({ count: getMessages.length }, 'fetched messages');
  }

  res.status(200).json({ success: true, messages: getMessages });
};

export default messageGetAll;
