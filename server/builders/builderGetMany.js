import builderModel from "./builderModel.js";
import { logInfo, logError } from "../middleware/logger.js";

const builderGetMany = async (req, res) => {
  try {
    // Optimized query - exclude "Build Your Own" template with lean() for performance
    const getBuiltPizzas = await builderModel
      .find({
        pizzaName: { $ne: "Build Your Own" },
      }, null, { lean: true })
      .sort({ pizzaPrice: 1, pizzaName: 1 }) // Sort by price, then name
      .maxTimeMS(5000);

    logInfo('Pizza builders retrieved', { count: getBuiltPizzas.length });

    res.status(200).json({ 
      success: true, 
      builders: getBuiltPizzas,
      count: getBuiltPizzas.length
    });
  } catch (error) {
    logError('Error getting pizza builders', { error: error.message });
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve pizza builders' 
    });
  }
};

export default builderGetMany;
