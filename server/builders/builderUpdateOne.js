import builderModel from "./builderModel.js";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Export your middleware for use in your route
export const pizzaUpdateOneUpload = upload.single("image");

// Helper function to calculate pizza price
const calculatePizzaPrice = (base, sauce, meatTopping, veggieTopping) => {
  // Calculate base price (crust + cheese)
  const basePrice = base.reduce((sum, item) => sum + (item.price || 0), 0);

  // Add sauce price
  const saucePrice = sauce.price || 0;

  // Add meat toppings price (considering amount)
  const meatPrice = meatTopping.reduce(
    (sum, item) => sum + (item.price || 0) * (item.amount || 1),
    0
  );

  // Add veggie toppings price (considering amount)
  const veggiePrice = veggieTopping.reduce(
    (sum, item) => sum + (item.price || 0) * (item.amount || 1),
    0
  );

  // Return total price rounded to 2 decimal places
  return parseFloat(
    (basePrice + saucePrice + meatPrice + veggiePrice).toFixed(2)
  );
};

const pizzaUpdateOne = async (req, res) => {
  try {
    const { id } = req.params;

    // Parse fields from FormData
    const pizzaName = req.body.pizzaName;
    const sauce = JSON.parse(req.body.sauce);
    const meatTopping = JSON.parse(req.body.meatTopping);
    const veggieTopping = JSON.parse(req.body.veggieTopping);
    const base = JSON.parse(req.body.base);

    // Calculate price automatically based on ingredients
    const pizzaPrice = calculatePizzaPrice(
      base,
      sauce,
      meatTopping,
      veggieTopping
    );

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
      pizzaPrice, // Use calculated price instead of submitted price
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

    console.log("Pizza updated with calculated price:", updatedPizza);
    res.status(200).json({
      success: true,
      message: "Pizza updated successfully with automatic pricing",
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
