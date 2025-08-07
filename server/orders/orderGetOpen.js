import orderModel from "./orderModel.js";
import { logInfo, logError } from "../middleware/logger.js";

const orderGetOpen = async (req, res) => {
  try {
    logInfo('Attempting to get open orders');
    
    // Simplified query first to test database connection
    const getOrders = await orderModel.find({
      isArchived: { $ne: true },
      status: { $ne: "archived" }
    }).sort({ date: -1 }).limit(100);

    logInfo('Open orders retrieved successfully', { count: getOrders.length });

    res.status(200).json({ 
      success: true, 
      orders: getOrders,
      count: getOrders.length
    });
  } catch (error) {
    logError('Error getting open orders', { 
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve open orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default orderGetOpen;
