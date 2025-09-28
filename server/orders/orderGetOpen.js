import orderModel from "./orderModel.js";
import { logger } from "../utils/logger.js";

const orderGetOpen = async (req, res) => {
  try {
  logger.info("Attempting to get open orders");

    // Simplified query first to test database connection
    const getOrders = await orderModel
      .find({
        isArchived: { $ne: true },
        status: { $ne: "archived" },
      })
      .sort({ date: -1 })
      .limit(100);

  logger.info({ count: getOrders.length }, "Open orders retrieved successfully");

    res.status(200).json({
      success: true,
      orders: getOrders,
      count: getOrders.length,
    });
  } catch (error) {
    logger.error({ error: error.message, stack: error.stack }, "Error getting open orders");
    res.status(500).json({
      success: false,
      message: "Failed to retrieve open orders",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export default orderGetOpen;
