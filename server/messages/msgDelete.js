import messageModel from "./msgModel.js";

const messageDelete = async (req, res) => {
  const { id } = req.params;

  console.log("Deleting message:", id);

  const deletedMessage = await messageModel.findByIdAndDelete(id);

  if (!deletedMessage) {
    return res
      .status(404)
      .json({ success: false, message: "Message not found" });
  }

  console.log("Message deleted:", deletedMessage);

  res.status(200).json({
    success: true,
    message: "SERVER: Message deleted successfully",
    id: id,
  });
};

export default messageDelete;
