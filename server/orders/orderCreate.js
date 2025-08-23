import orderModel from "./orderModel.js";
import { sendOrderConfirmationEmail } from "../utils/receiptService.js";

const orderCreate = async (req, res) => {
  try {
    // Sequential order number with yearly reset (6 digits max)
    const generateOrderNumber = async () => {
      const currentYear = new Date().getFullYear();

      // Find the highest order number for this year
      const lastOrder = await orderModel
        .findOne({
          $expr: {
            $eq: [{ $year: "$date" }, currentYear],
          },
        })
        .sort({ orderNumber: -1 });

      if (!lastOrder || !lastOrder.orderNumber) {
        return "100001"; // Start from 100001 for first order of the year
      }

      // Convert to number, add 1, convert back to string
      const nextNumber = parseInt(lastOrder.orderNumber) + 1;

      // If we hit 999999, reset to 100001 (shouldn't happen with yearly reset)
      if (nextNumber > 999999) {
        return "100001";
      }

      return nextNumber.toString();
    };

    let {
      orderNumber,
      date,
      orderDetails,
      address,
      phone,
      firstName,
      lastName,
      email,
      orderTotal,
      status,
      isArchived,
      payment,
    } = req.body;

    // Generate order number if not provided
    if (!orderNumber) {
      orderNumber = await generateOrderNumber();
    }

    // Validation - address is optional for pickup-only orders
    if (
      !orderNumber ||
      orderNumber == "" ||
      !orderDetails ||
      orderDetails == "" ||
      !firstName ||
      firstName == "" ||
      orderTotal === undefined ||
      isNaN(orderTotal)
    ) {
      res.status(500).json({ message: "ERR: Invalid order information" });
      return;
    }
    // Set date and status if not provided
    if (!date) date = new Date();
    if (!status) status = "pending_payment"; // Default to pending payment
    if (isArchived === undefined) isArchived = false;

    const newOrder = await orderModel.create({
      orderNumber,
      date,
      orderDetails,
      address,
      phone,
      firstName,
      lastName,
      email,
      orderTotal,
      status,
      isArchived,
      payment,
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

    // Send order confirmation email if email provided
    if (email) {
      try {
        console.log("🐛 DEBUG - About to send email with data:");
        console.log("newOrder keys:", Object.keys(newOrder.toObject ? newOrder.toObject() : newOrder));
        console.log("payment:", payment);
        
        const emailResult = await sendOrderConfirmationEmail(newOrder, payment);
        console.log("Order confirmation email result:", emailResult);
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError.message);
        console.error("Full email error:", emailError);
        // Don't fail the order creation if email fails
      }
    }

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
