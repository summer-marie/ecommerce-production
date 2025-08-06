import messageModel from "./msgModel.js";

const messageUpdateRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updateMessage = await messageModel.findOneAndUpdate(
      { _id: id },
      { isRead: true },
      { new: true }
    );

    console.log("updateMessage", updateMessage);

    // If no message found, return 404
    if (!updateMessage) {
      return res.status(404).json({ error: "Message not found." });
    }

    res.status(200).json({ success: true, message: updateMessage?.toJSON() });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while marking message as read." });
  }
};

export default messageUpdateRead;
