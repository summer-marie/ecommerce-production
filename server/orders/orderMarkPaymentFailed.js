import orderModel from "./orderModel.js";

// Soft-cancel an order when payment fails
// Sets payment.status = 'failed', stores optional failureReason, and sets order status to 'cancelled'
// Does not modify isArchived (can be done later if desired)
const orderMarkPaymentFailed = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { reason } = req.body || {};

    const numericOrderNumber = Number(orderNumber);
    if (!numericOrderNumber || Number.isNaN(numericOrderNumber)) {
      return res.status(400).json({ success: false, message: "Invalid orderNumber" });
    }

    const updated = await orderModel.findOneAndUpdate(
      { orderNumber: numericOrderNumber },
      {
        $set: {
          status: "cancelled",
          "payment.status": "failed",
          ...(reason ? { "payment.failureReason": String(reason) } : {}),
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, order: updated });
  } catch (error) {
    console.error("orderMarkPaymentFailed error:", error);
    return res.status(500).json({ success: false, message: "Failed to mark order as payment failed", error: error.message });
  }
};

export default orderMarkPaymentFailed;
