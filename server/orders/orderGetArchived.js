import orderModel from "./orderModel.js";
import { getLog } from "../utils/logger.js";

// TODO: Add month/year filter and pagination for archived orders in the admin frontend for easier navigation and record-keeping. Keep at least 1 year of archived orders for tax purposes.

const orderGetArchived = async (req, res) => {
  try {
  const log = getLog(req, { event: 'order.getArchived' });
  log.debug('fetch archived start');
    
    const pipeline = [
      { $match: { status: "archived" } },
      { $sort: { date: -1 } }, // Fixed: was "Date" now "date"
    ];

    const getOrders = await orderModel.aggregate(pipeline, {
      maxTimeMS: 5000,
      allowDiskUse: true,
    });

  log.debug({ count: getOrders.length }, 'archived orders fetched');
    res.status(200).json({ success: true, orders: getOrders });
  } catch (error) {
    const log = getLog(req, { event: 'order.getArchived.error' });
    log.error({ err: error.message }, 'fetch archived failed');
    res.status(500).json({ success: false, error: error.message });
  }
};

export default orderGetArchived;
