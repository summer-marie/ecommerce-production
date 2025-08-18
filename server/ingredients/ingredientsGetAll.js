import ingredientsModel from "./ingredientsModel.js";
import { logInfo, logError } from "../middleware/logger.js";

const ingredientsGetAll = async (req, res) => {
  try {
    // Optimized query with lean() for better performance
    const rawIngredients = await ingredientsModel
      .find({}, null, { lean: true }) // Return plain objects for faster serialization
      .sort({ itemType: 1, name: 1 });

    // Map _id to id for consistency (lean() skips schema toJSON transform)
    const ingredients = rawIngredients.map((doc) => {
      const id = doc._id?.toString?.() || doc._id;
      const { _id, __v, ...rest } = doc;
      return { id, ...rest };
    });

    logInfo("Ingredients retrieved", { count: ingredients.length });

    res.status(200).json({
      success: true,
      ingredients,
      count: ingredients.length,
      cached: false,
    });
  } catch (error) {
    logError("Error getting ingredients", { error: error.message });
    res.status(500).json({
      success: false,
      message: "Failed to retrieve ingredients",
    });
  }
};

export default ingredientsGetAll;
