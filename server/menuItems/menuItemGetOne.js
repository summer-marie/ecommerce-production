import menuItemModel from "./menuItemModel.js";
import { getLog } from "../utils/logger.js";

const menuItemGetOne = async (req, res) => {
  try {
    const log = getLog(req, { event: 'menuItem.getOne' });
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Menu item ID is required",
      });
    }

    const menuItem = await menuItemModel.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    log.info({
      id: menuItem._id,
      itemName: menuItem.itemName,
      itemType: menuItem.itemType
    }, 'menu item retrieved');

    res.status(200).json({
      success: true,
      menuItem,
    });
  } catch (err) {
    const log = getLog(req, { event: 'menuItem.getOne.error' });
    log.error({ err: err?.message, id: req.params.id }, 'get menu item error');
    res.status(500).json({
      success: false,
      message: "Server error while fetching menu item",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

export default menuItemGetOne;