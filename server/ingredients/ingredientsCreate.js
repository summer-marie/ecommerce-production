import ingredientsModel from "./ingredientsModel.js";
import { invalidateCache } from "../middleware/performance.js";
import { logInfo, logError } from "../middleware/logger.js";

const ingredientsCreate = async (req, res) => {
  try {
    const { name, description, itemType, price } = req.body;

    logInfo("Creating new ingredient", { name, itemType });

    // Validate the incoming data using Mongoose's built-in schema validator
    const newIngredient = await ingredientsModel.create({
      name,
      description,
      itemType,
      price,
    });

    // Invalidate ingredients cache when new ingredient is created
    await invalidateCache("api:/ingredients*");

    logInfo("New ingredient created", { id: newIngredient._id, name });

    res.status(201).json({
      success: true,
      message: "SERVER newIngredient created.",
      ingredient: newIngredient,
    });
  } catch (error) {
    logError("Error creating ingredient", { error: error.message });
    res.status(500).json({
      success: false,
      message: "Failed to create ingredient",
      error: error.message,
    });
  }
};

export default ingredientsCreate;
// This code defines a function to create a new ingredient in the database.
// It validates the input, creates the ingredient, invalidates the cache, and logs the process
