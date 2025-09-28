import builderModel from "./builderModel.js";
import { invalidateCache } from "../middleware/performance.js";
import { getLog } from "../utils/logger.js";

const pizzaUpdateOne = async (req, res) => {
  try {
    const { id } = req.params;

    // Extract fields from request body
    const { pizzaName, sauce, meatTopping, veggieTopping, herbs, otherAdditions, base, image } =
      req.body;

    // Accept admin-provided price (string or number)
    const rawPrice = req.body.pizzaPrice;
    const pizzaPrice =
      typeof rawPrice === "string" ? parseFloat(rawPrice) : Number(rawPrice);
    if (!Number.isFinite(pizzaPrice)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid pizzaPrice is required" });
    }
    if (pizzaPrice < 0 || pizzaPrice > 1000) {
      return res
        .status(400)
        .json({
          success: false,
          message: "pizzaPrice must be between 0 and 1000",
        });
    }

    const updateFields = {
      pizzaName,
      pizzaPrice, // Use admin-entered price
      sauce,
      meatTopping,
      veggieTopping,
  base,
  herbs: Array.isArray(herbs) ? herbs : [],
  otherAdditions: Array.isArray(otherAdditions) ? otherAdditions : [],
    };

    // Only update image if provided
    if (image) {
      updateFields.image = image;
    }

    const updatedPizza = await builderModel.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedPizza) {
      return res
        .status(404)
        .json({ success: false, message: "Pizza not found" });
    }

    const log = getLog(req, { event: 'builder.update' });
    log.info({
      id: updatedPizza._id,
      pizzaName: updatedPizza.pizzaName,
      price: updatedPizza.pizzaPrice,
      hasImage: !!updatedPizza.image,
      imageMeta: updatedPizza.image
        ? {
            filename: updatedPizza.image.filename,
            mimetype: updatedPizza.image.mimetype,
            dataSize: updatedPizza.image.data
              ? `${(updatedPizza.image.data.length / 1024).toFixed(2)} KB`
              : '0 KB'
          }
        : null
    }, 'builder updated');
    // Invalidate builders cache for fresh data
    await invalidateCache("api:/builders");

    res.status(200).json({
      success: true,
      message: "Pizza updated successfully",
      builder: updatedPizza,
    });
  } catch (err) {
  const log = getLog(req, { event: 'builder.update.error' });
  log.error({ err: err?.message }, 'builder update error');
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export default pizzaUpdateOne;
