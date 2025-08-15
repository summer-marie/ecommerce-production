import builderModel from "./builderModel.js";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Export your middleware for use in your route
export const pizzaUpdateOneUpload = upload.single("image");

const pizzaUpdateOne = async (req, res) => {
  try {
    const { id } = req.params;

    // Parse fields from FormData
    const pizzaName = req.body.pizzaName;
    const sauce = JSON.parse(req.body.sauce);
    const meatTopping = JSON.parse(req.body.meatTopping);
    const veggieTopping = JSON.parse(req.body.veggieTopping);
    const base = JSON.parse(req.body.base);

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

    // Handle image
    const image = req.file
      ? {
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          path: req.file.path,
          size: req.file.size,
        }
      : undefined;

    const updateFields = {
      pizzaName,
      pizzaPrice, // Use admin-entered price
      sauce,
      meatTopping,
      veggieTopping,
      base,
    };

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

    console.log("Pizza updated with manual price:", updatedPizza);
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