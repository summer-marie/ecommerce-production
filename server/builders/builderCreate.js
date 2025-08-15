import builderModel from "./builderModel.js";
import { invalidateCache } from "../middleware/performance.js";

const builderCreate = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { pizzaName, base, sauce, meatTopping, veggieTopping, image } = req.body;

    // Validation
    if (!pizzaName || pizzaName === "") {
      return res
        .status(400)
        .json({ success: false, message: "Pizza name is required" });
    }

    // Accept admin-provided price instead of calculating from ingredients
    const rawPrice = req.body.pizzaPrice;
    const pizzaPrice =
      typeof rawPrice === "string" ? parseFloat(rawPrice) : Number(rawPrice);
    if (!Number.isFinite(pizzaPrice)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid pizzaPrice is required" });
    }
    if (pizzaPrice < 0 || pizzaPrice > 1000) {
      return res.status(400).json({
        success: false,
        message: "pizzaPrice must be between 0 and 1000",
      });
    }

    const newPizza = await builderModel.create({
      pizzaName,
      pizzaPrice, // Use admin-entered price
      base,
      sauce,
      meatTopping,
      veggieTopping,
      image: image || null, // Firebase Storage image data
    });

    console.log("New pizza created with Base64 image:", {
      ...newPizza.toObject(),
      image: newPizza.image ? { 
        filename: newPizza.image.filename, 
        mimetype: newPizza.image.mimetype,
        dataSize: newPizza.image.data ? `${(newPizza.image.data.length / 1024).toFixed(2)} KB` : '0 KB'
      } : null
    });

    // Invalidate builders cache so new pizza appears immediately
    await invalidateCache('api:/builders');

    res.status(200).json({
      success: true,
      message: "Pizza created successfully",
      pizza: newPizza,
    });
  } catch (err) {
    console.error("Full error details:", err);
    res.status(500).json({
      success: false,
      message: "Server error while creating pizza",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

export default builderCreate;