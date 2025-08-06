import messageModel from "./msgModel.js";

const messageCreate = async (req, res) => {
  console.log("Received message data:", req.body);
  
  const { email, subject, message } = req.body;

  console.log(email, subject, message);

  const newMessage = await messageModel.create({
    email,
    subject,
    message,
  });

  console.log("newMessage", newMessage);

  res.status(201).json({
    success: true,
    message: "SERVER: New message created.",
    message: newMessage,
  });
};

export default messageCreate;
