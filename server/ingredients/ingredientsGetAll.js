import ingredientsModel from "./ingredientsModel.js";
import { logInfo, logError } from "../middleware/logger.js";

const ingredientsGetAll = async (req, res) => {
  try {
    // Optimized query with lean() for better performance
    const getIngredients = await ingredientsModel
      .find({}, null, { lean: true }) // Return plain objects for faster serialization
      .sort({ itemType: 1, name: 1 })
      .maxTimeMS(5000); // 5 second timeout

    logInfo('Ingredients retrieved', { count: getIngredients.length });

    res.status(200).json({ 
      success: true, 
      ingredients: getIngredients,
      count: getIngredients.length,
      cached: false
    });
  } catch (error) {
    logError('Error getting ingredients', { error: error.message });
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve ingredients' 
    });
  }
};

export default ingredientsGetAll;
