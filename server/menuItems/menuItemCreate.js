import menuItemModel from "./menuItemModel.js";
import { getLog } from "../utils/logger.js";
import { normalizeBase64Image } from "../utils/imageHelpers.js";

const menuItemCreate = async (req, res) => {
  try {
    const log = getLog(req, { event: "menuItem.create" });
    log.debug(
      { bodyKeys: Object.keys(req.body || {}) },
      "create menu item request body"
    );

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
      sortOrder,
    } = req.body;

    // Validation
    if (!itemName || itemName === "") {
      return res
        .status(400)
        .json({ success: false, message: "Item name is required" });
    }

    if (!itemType || itemType === "") {
      return res
        .status(400)
        .json({ success: false, message: "Item type is required" });
    }

    // Accept admin-provided price
    const rawPrice = req.body.itemPrice;
    const itemPrice =
      typeof rawPrice === "string" ? parseFloat(rawPrice) : Number(rawPrice);
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

    const normalizedImage = normalizeBase64Image(image);

    const newMenuItem = await menuItemModel.create({
      itemName,
      itemType,
      itemPrice,
      description: description || "",
      base,
      sauce,
      meatTopping: Array.isArray(meatTopping) ? meatTopping : [],
      veggieTopping: Array.isArray(veggieTopping) ? veggieTopping : [],
      herbs: Array.isArray(herbs) ? herbs : [],
      otherAdditions: Array.isArray(otherAdditions) ? otherAdditions : [],
      image: normalizedImage,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      sortOrder: sortOrder || 0,
    });

    log.info(
      {
        id: newMenuItem._id,
        itemName: newMenuItem.itemName,
        itemType: newMenuItem.itemType,
        price: newMenuItem.itemPrice,
        hasImage: !!newMenuItem.image,
        imageMeta: newMenuItem.image
          ? {
              filename: newMenuItem.image.filename,
              mimetype: newMenuItem.image.mimetype,
              dataSize: newMenuItem.image.data
                ? `${(newMenuItem.image.data.length / 1024).toFixed(2)} KB`
                : "0 KB",
            }
          : null,
      },
      "menu item created"
    );

    res.status(200).json({
      success: true,
      message: "Menu item created successfully",
      menuItem: newMenuItem,
    });
  } catch (err) {
    const log = getLog(req, { event: "menuItem.create.error" });
    log.error({ err: err?.message }, "menu item create error");
    res.status(500).json({
      success: false,
      message: "Server error while creating menu item",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

export default menuItemCreate;
