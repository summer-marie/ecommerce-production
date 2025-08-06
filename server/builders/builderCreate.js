import builderModel from "./builderModel.js";
import fs from "fs";

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

const builderCreate = async (req, res) => {
  try {
    // Log the request body and file details for debugging
    console.log("Request body:", req.body);
    console.log(
      "File details:",
      req.file
        ? {
            filename: req.file.filename,
            path: req.file.path,
            exists: fs.existsSync(req.file.path),
          }
        : "No file uploaded"
    );

    const { pizzaName } = req.body;

    // Parse ingredients from request body
    const base =
      typeof req.body.base === "string"
        ? JSON.parse(req.body.base)
        : req.body.base;
    const sauce =
      typeof req.body.sauce === "string"
        ? JSON.parse(req.body.sauce)
        : req.body.sauce;
    const meatTopping =
      typeof req.body.meatTopping === "string"
        ? JSON.parse(req.body.meatTopping)
        : req.body.meatTopping;
    const veggieTopping =
      typeof req.body.veggieTopping === "string"
        ? JSON.parse(req.body.veggieTopping)
        : req.body.veggieTopping;

    // Validation
    if (!pizzaName || pizzaName === "") {
      return res
        .status(400)
        .json({ success: false, message: "Pizza name is required" });
    }

    // Calculate price automatically based on ingredients
    const pizzaPrice = calculatePizzaPrice(
      base,
      sauce,
      meatTopping,
      veggieTopping
    );

    const newPizza = await builderModel.create({
      pizzaName,
      pizzaPrice, // Use calculated price
      base,
      sauce,
      meatTopping,
      veggieTopping,
      image: req.file
        ? {
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            path: req.file.path,
            size: req.file.size,
          }
        : null,
    });

    console.log("File received:", req.file);

    console.log("New pizza created with calculated price:", newPizza);

    res.status(200).json({
      success: true,
      message: "Pizza created successfully with automatic pricing",
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
