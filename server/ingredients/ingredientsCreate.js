import ingredientsModel from "./ingredientsModel.js";
import { invalidateCache } from "../middleware/performance.js";
import { logger } from "../utils/logger.js";

const ingredientsCreate = async (req, res) => {
  try {
    const { name, description, itemType, price } = req.body;

  logger.info({ name, itemType }, "Creating new ingredient");

    // Validate the incoming data using Mongoose's built-in schema validator
    const newIngredient = await ingredientsModel.create({
      name,
      description,
      itemType,
      price,
    });

    // Invalidate ingredients cache when new ingredient is created
    await invalidateCache("api:/ingredients*");

  logger.info({ id: newIngredient._id, name }, "New ingredient created");

    res.status(201).json({
      success: true,
      message: "SERVER newIngredient created.",
      ingredient: newIngredient,
    });
  } catch (error) {
  logger.error({ error: error.message }, "Error creating ingredient");
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
