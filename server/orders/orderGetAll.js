import orderModel from "./orderModel.js";
import { getLog } from "../utils/logger.js";

const orderGetAll = async (req, res) => {
  const log = getLog(req, { event: 'order.getAll' });
  const getOrders = await orderModel.find();
  log.debug({ count: getOrders.length }, 'orders fetched');

  res.status(200).json({ success: true, orders: getOrders });
};

export default orderGetAll;
