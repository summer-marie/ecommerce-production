import menuItemModel from "./menuItemModel.js";
import { getLog } from "../utils/logger.js";

const menuItemGetAll = async (req, res) => {
  try {
    const log = getLog(req, { event: 'menuItem.getAll' });
    
    const { itemType, available, featured } = req.query;
    
    // Build filter object
    const filter = {};
    if (itemType) filter.itemType = itemType;
    if (available !== undefined) filter.isAvailable = available === 'true';
    if (featured !== undefined) filter.isFeatured = featured === 'true';

    const menuItems = await menuItemModel
      .find(filter)
      .sort({ itemType: 1, sortOrder: 1, createdAt: -1 });

    log.info({
      count: menuItems.length,
      filters: filter,
      types: [...new Set(menuItems.map(item => item.itemType))]
    }, 'menu items retrieved');

    res.status(200).json({
      success: true,
      count: menuItems.length,
      menuItems,
    });
  } catch (err) {
    const log = getLog(req, { event: 'menuItem.getAll.error' });
    log.error({ err: err?.message }, 'get all menu items error');
    res.status(500).json({
      success: false,
      message: "Server error while fetching menu items",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

export default menuItemGetAll;