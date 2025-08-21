import orderModel from "./orderModel.js";

// Update order payment status - used by Square payment integration
export const updateOrderPaymentStatus = async (orderNumber, paymentData) => {
  try {
    const {
      status,
      squarePaymentId,
      receiptNumber,
      amountPaid,
      processingFee = 0,
      failureReason,
      method = "square",
    } = paymentData;

    const updateData = {
      "payment.status": status,
      "payment.method": method,
      "payment.amountPaid": amountPaid || 0,
      "payment.processingFee": processingFee,
    };

    // Add Square-specific fields if provided
    if (squarePaymentId) {
      updateData["payment.squarePaymentId"] = squarePaymentId;
    }

    if (receiptNumber) {
      updateData["payment.receiptNumber"] = receiptNumber;
    }

    // Set timestamps based on status
    if (status === "completed") {
      updateData["payment.paidAt"] = new Date();
      updateData["status"] = "processing"; // Move order to processing after payment
    } else if (status === "failed") {
      updateData["payment.failureReason"] = failureReason;
      updateData["status"] = "cancelled"; // Cancel order if payment fails
    } else if (status === "refunded") {
      updateData["payment.refundedAt"] = new Date();
      updateData["status"] = "cancelled"; // Cancel order if refunded
    }

    const updatedOrder = await orderModel.findOneAndUpdate(
      { orderNumber: orderNumber },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      throw new Error(`Order ${orderNumber} not found`);
    }

    console.log(`Order ${orderNumber} payment status updated to: ${status}`);
    return updatedOrder;
  } catch (error) {
    console.error(
      `Failed to update payment status for order ${orderNumber}:`,
      error
    );
    throw error;
  }
};

// Get order by Square payment ID
export const getOrderByPaymentId = async (squarePaymentId) => {
  try {
    const order = await orderModel.findOne({
      "payment.squarePaymentId": squarePaymentId,
    });
    return order;
  } catch (error) {
    console.error(
      `Failed to find order by payment ID ${squarePaymentId}:`,
      error
    );
    throw error;
  }
};

// Get orders by payment status
export const getOrdersByPaymentStatus = async (paymentStatus) => {
  try {
    const orders = await orderModel
      .find({
        "payment.status": paymentStatus,
      })
      .sort({ date: -1 });
    return orders;
  } catch (error) {
    console.error(
      `Failed to get orders by payment status ${paymentStatus}:`,
      error
    );
    throw error;
  }
};
