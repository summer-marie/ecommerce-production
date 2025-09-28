import orderModel from "./orderModel.js";
import { logger, getLog } from "../utils/logger.js";

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

    logger.info({ event: 'order.payment.update', orderNumber, status }, 'order payment status updated');
    return updatedOrder;
  } catch (error) {
    logger.error({ event: 'order.payment.update.error', orderNumber, err: error.message }, 'failed to update order payment status');
    throw error;
  }
};

// Get order by Square payment ID
export const getOrderByPaymentId = async (squarePaymentId) => {
  try {
    const order = await orderModel.findOne({
      "payment.squarePaymentId": squarePaymentId,
    });
  } catch (error) {
    logger.error({ event: 'order.payment.lookup.error', squarePaymentId, err: error.message }, 'failed to find order by square payment id');
    throw error;
  }
  return order;
};

// Get orders by payment status
export const getOrdersByPaymentStatus = async (paymentStatus) => {
  try {
    const orders = await orderModel
      .find({
        "payment.status": paymentStatus,
      })
      .sort({ date: -1 });
  } catch (error) {
    logger.error({ event: 'order.payment.statusQuery.error', paymentStatus, err: error.message }, 'failed to get orders by payment status');
    throw error;
  }
  return orders;
};
