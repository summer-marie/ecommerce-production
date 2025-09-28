import orderModel from "./orderModel.js";
import { getLog } from "../utils/logger.js";

const orderUpdateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const log = getLog(req, { event: 'order.updateStatus', orderId: id });
  log.debug({ newStatus: status }, 'status update start');
  
  try {
    // First, get counts before update
    const beforeCounts = await orderModel.aggregate([
      { $match: { status: { $ne: "archived" } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
  log.debug({ beforeCounts }, 'counts before update');
    
    const order = await orderModel.findOneAndUpdate(
      { _id: id },
      {
        status: status.status,
      },
      { new: true }
    );

    if (!order) {
      log.warn({ orderId: id }, 'order not found');
      return res.status(404).json({ error: "Order not found" });
    }

    // Return normalized open orders with `id` (no `_id`), to keep client consistent
    const rawOrders = await orderModel
      .find({ isArchived: { $ne: true }, status: { $ne: "archived" } })
      .sort({ date: -1 })
      .lean();
    const getOrders = rawOrders.map(({ _id, __v, ...rest }) => ({
      id: _id?.toString?.() ?? String(_id),
      ...rest,
    }));
    
    // Get counts after update
    const afterCounts = await orderModel.aggregate([
      { $match: { status: { $ne: "archived" } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    log.debug({ afterCounts, total: getOrders.length }, 'status update complete');

    res.status(200).json({ orders: getOrders });
  } catch (error) {
    log.error({ err: error.message, stack: error.stack }, 'status update failure');
    res
      .status(500)
      .json({ error: "An error occurred while updating the order" });
  }
};

export default orderUpdateStatus;
