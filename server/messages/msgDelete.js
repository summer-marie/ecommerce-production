import messageModel from "./msgModel.js";
import { getLog } from "../utils/logger.js";

const messageDelete = async (req, res) => {
  const { id } = req.params;

  const log = getLog(req, { event: 'message.delete' });
  log.debug({ id }, 'deleting message');

  const deletedMessage = await messageModel.findByIdAndDelete(id);

  if (!deletedMessage) {
    return res
      .status(404)
      .json({ success: false, message: "Message not found" });
  }

  log.info({ id }, 'message deleted');

  res.status(200).json({
    success: true,
    message: "SERVER: Message deleted successfully",
    id: id,
  });
};

export default messageDelete;
