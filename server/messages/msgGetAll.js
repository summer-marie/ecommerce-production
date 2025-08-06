import messageModel from "./msgModel.js";

const messageGetAll = async (req, res) => {
  // Sort by date (newest first)
  const getMessages = await messageModel.find().sort({ date: -1 });

  console.log("getMessages", getMessages);

  res.status(200).json({ success: true, messages: getMessages });
};

export default messageGetAll;
