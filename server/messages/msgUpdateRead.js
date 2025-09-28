import messageModel from "./msgModel.js";
import { getLog } from "../utils/logger.js";

const messageUpdateRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updateMessage = await messageModel.findOneAndUpdate(
      { _id: id },
      { isRead: true },
      { new: true }
    );

  const log = getLog(req, { event: 'message.updateRead' });
  log.debug({ id, updated: !!updateMessage }, 'mark message read result');

    // If no message found, return 404
    if (!updateMessage) {
      return res.status(404).json({ error: "Message not found." });
    }

    res.status(200).json({ success: true, message: updateMessage?.toJSON() });
  } catch (error) {
    const log = getLog(req, { event: 'message.updateRead.error' });
    log.error({ err: error?.message }, 'error marking message as read');
    res
      .status(500)
      .json({ error: "An error occurred while marking message as read." });
  }
};

export default messageUpdateRead;
