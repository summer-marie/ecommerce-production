import orderModel from "./orderModel.js";
import { logInfo, logError } from "../middleware/logger.js";

const orderGetOpen = async (req, res) => {
  try {
    // Optimized aggregation pipeline for open orders
    const getOrders = await orderModel.aggregate([
      {
        $match: {
          isArchived: { $ne: true },
          status: { $ne: "archived" },
        },
      },
      {
        $sort: { 
          date: -1, // Newest orders first
          status: 1  // Then by status (processing before completed)
        }
      },
      {
        $limit: 100 // Limit to most recent 100 open orders
      }
    ]).allowDiskUse(true).maxTimeMS(5000);

    logInfo('Open orders retrieved', { count: getOrders.length });

    res.status(200).json({ 
      success: true, 
      orders: getOrders,
      count: getOrders.length
    });
  } catch (error) {
    logError('Error getting open orders', { error: error.message });
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve open orders' 
    });
  }
};

export default orderGetOpen;
