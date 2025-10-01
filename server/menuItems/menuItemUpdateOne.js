import menuItemModel from "./menuItemModel.js";
import { invalidateCache } from "../middleware/performance.js";
import { getLog } from "../utils/logger.js";

const menuItemUpdateOne = async (req, res) => {
  try {
    const log = getLog(req, { event: 'menuItem.update' });
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Menu item ID is required",
      });
    }

    const { 
      itemName, 
      itemType, 
      description,
      base, 
      sauce, 
      meatTopping, 
      veggieTopping, 
      herbs, 
      otherAdditions, 
      image,
      isAvailable,
      isFeatured,
      sortOrder
    } = req.body;

    // Validate price if provided
    let itemPrice;
    if (req.body.itemPrice !== undefined) {
      const rawPrice = req.body.itemPrice;
      itemPrice = typeof rawPrice === "string" ? parseFloat(rawPrice) : Number(rawPrice);
      if (!Number.isFinite(itemPrice)) {
        return res
          .status(400)
          .json({ success: false, message: "Valid itemPrice is required" });
      }
      if (itemPrice < 0 || itemPrice > 1000) {
        return res.status(400).json({
          success: false,
          message: "itemPrice must be between 0 and 1000",
        });
      }
    }

    // Build update object
    const updateData = {};
    if (itemName !== undefined) updateData.itemName = itemName;
    if (itemType !== undefined) updateData.itemType = itemType;
    if (itemPrice !== undefined) updateData.itemPrice = itemPrice;
    if (description !== undefined) updateData.description = description;
    if (base !== undefined) updateData.base = base;
    if (sauce !== undefined) updateData.sauce = sauce;
    if (meatTopping !== undefined) updateData.meatTopping = Array.isArray(meatTopping) ? meatTopping : [];
    if (veggieTopping !== undefined) updateData.veggieTopping = Array.isArray(veggieTopping) ? veggieTopping : [];
    if (herbs !== undefined) updateData.herbs = Array.isArray(herbs) ? herbs : [];
    if (otherAdditions !== undefined) updateData.otherAdditions = Array.isArray(otherAdditions) ? otherAdditions : [];
    if (image !== undefined) updateData.image = image;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const updatedMenuItem = await menuItemModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    log.info({
      id: updatedMenuItem._id,
      itemName: updatedMenuItem.itemName,
      itemType: updatedMenuItem.itemType,
      updatedFields: Object.keys(updateData)
    }, 'menu item updated');

    // Invalidate menu items cache
    await invalidateCache("api:/menu-items");

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      menuItem: updatedMenuItem,
    });
  } catch (err) {
    const log = getLog(req, { event: 'menuItem.update.error' });
    log.error({ err: err?.message, id: req.params.id }, 'menu item update error');
    res.status(500).json({
      success: false,
      message: "Server error while updating menu item",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

export default menuItemUpdateOne;