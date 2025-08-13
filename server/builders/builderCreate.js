import builderModel from "./builderModel.js";
import fs from "fs";

// Note: Ingredients retain their unit prices but are no longer used to compute pizzaPrice on create.

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

    console.log("New pizza created with manual price:", newPizza);

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
