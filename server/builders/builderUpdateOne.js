import builderModel from "./builderModel.js";
import { invalidateCache } from "../middleware/performance.js";

const pizzaUpdateOne = async (req, res) => {
  try {
    const { id } = req.params;

    // Extract fields from request body
    const { pizzaName, sauce, meatTopping, veggieTopping, base, image } = req.body;

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
        .json({ success: false, message: "pizzaPrice must be between 0 and 1000" });
    }

    const updateFields = {
      pizzaName,
      pizzaPrice, // Use admin-entered price
      sauce,
      meatTopping,
      veggieTopping,
      base,
    };

    // Only update image if provided
    if (image) {
      updateFields.image = image;
    }

    const updatedPizza = await builderModel.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedPizza) {
      return res
        .status(404)
        .json({ success: false, message: "Pizza not found" });
    }

    console.log("Pizza updated with Base64 image:", {
      ...updatedPizza.toObject(),
      image: updatedPizza.image ? { 
        filename: updatedPizza.image.filename, 
        mimetype: updatedPizza.image.mimetype,
        dataSize: updatedPizza.image.data ? `${(updatedPizza.image.data.length / 1024).toFixed(2)} KB` : '0 KB'
      } : null
    });
    // Invalidate builders cache for fresh data
    await invalidateCache('api:/builders');
    
    res.status(200).json({
      success: true,
      message: "Pizza updated successfully",
      builder: updatedPizza,
    });
  } catch (err) {
    console.error("Update error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export default pizzaUpdateOne;