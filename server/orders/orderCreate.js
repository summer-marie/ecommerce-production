import orderModel from "./orderModel.js";

const orderCreate = async (req, res) => {
  try {
    const generateOrderNumber = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    let {
      orderNumber,
      date,
      orderDetails,
      address,
      phone,
      firstName,
      lastName,
      orderTotal,
      status,
      isArchived,
    } = req.body;

    // Generate order number if not provided
    if (!orderNumber) {
      orderNumber = generateOrderNumber();
    }

    // Validation
    if (
      !orderNumber ||
      orderNumber == "" ||
      !orderDetails ||
      orderDetails == "" ||
      !address ||
      address == "" ||
      !firstName ||
      firstName == "" ||
      !orderTotal ||
      orderTotal.length === 0
    ) {
      res.status(500).json({ message: "ERR: Invalid order information" });
    }
    // Set date and status if not provided
    if (!date) date = new Date();
    if (!status) status = "processing";
    if (isArchived === undefined) isArchived = false;

    const newOrder = await orderModel.create({
      orderNumber,
      date,
      orderDetails,
      address,
      phone,
      firstName,
      lastName,
      orderTotal,
      status,
    });
    // Format the date before logging and sending the response
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date(newOrder.date));

    // Format the date before logging and sending the response
    const formattedOrder = {
      ...newOrder.toObject(),
      date: formattedDate,
    };

    console.log("newOrder", formattedOrder);

    res.status(200).json({
      success: true,
      message: "Order created!!",
      order: formattedOrder,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message,
    });
  }
};

export default orderCreate;
