import orderModel from "./orderModel.js";
import { getLog } from "../utils/logger.js";

const ordersArchive = async (req, res) => {
  const { id } = req.params;
  try {
  const log = getLog(req, { event: 'order.archive', orderId: id });
  log.debug('archive start');
    
    const orderArchive = await orderModel.findOneAndUpdate(
      { _id: id },
      { 
        $set: { 
          isArchived: true,
          status: "archived"
        } 
      },
      { new: true }
    );
    
    if (!orderArchive) {
      log.warn('order not found');
      return res.status(404).json({ message: "Order not found." });
    }
    
  log.info({ orderNumber: orderArchive.orderNumber }, 'order archived');
  // Normalize to include `id` and omit `_id`/`__v`
  const { _id, __v, ...rest } = orderArchive.toObject();
  const normalized = { id: _id?.toString?.() ?? String(_id), ...rest };
  res.status(200).json({ success: true, order: normalized });
  } catch (err) {
    const log = getLog(req, { event: 'order.archive.error', orderId: id });
    log.error({ err: err.message }, 'archive failed');
    res.status(500).json({ message: "There was an error archiving the order.", error: err.message });
  }
};

export default ordersArchive;
