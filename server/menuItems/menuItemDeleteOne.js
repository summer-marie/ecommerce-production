import menuItemModel from "./menuItemModel.js";
import { invalidateCache } from "../middleware/performance.js";
import { getLog } from "../utils/logger.js";

const menuItemDeleteOne = async (req, res) => {
  try {
    const log = getLog(req, { event: 'menuItem.delete' });
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Menu item ID is required",
      });
    }

    const deletedMenuItem = await menuItemModel.findByIdAndDelete(id);

    if (!deletedMenuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    log.info({
      id: deletedMenuItem._id,
      itemName: deletedMenuItem.itemName,
      itemType: deletedMenuItem.itemType
    }, 'menu item deleted');

    // Invalidate menu items cache
    await invalidateCache("api:/menu-items");

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
      menuItem: deletedMenuItem,
    });
  } catch (err) {
    const log = getLog(req, { event: 'menuItem.delete.error' });
    log.error({ err: err?.message, id: req.params.id }, 'menu item delete error');
    res.status(500).json({
      success: false,
      message: "Server error while deleting menu item",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

export default menuItemDeleteOne;