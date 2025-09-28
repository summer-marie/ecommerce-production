import orderModel from "./orderModel.js";
import { getLog } from "../utils/logger.js";

const orderGetOne = async (req, res) => {
  const { id } = req.params;
  try {
  const log = getLog(req, { event: 'order.getOne', orderId: id });
  const order = await orderModel.findById(id);
  log.debug({ found: !!order }, 'order fetch result');
    if (!order) {
      return res.status(404).send("Order not found");
    }
    res.status(200).json({ success: true, order: order });
  } catch (error) {
    const log = getLog(req, { event: 'order.getOne.error', orderId: id });
    log.error({ err: error.message }, 'order fetch failed');
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default orderGetOne;
