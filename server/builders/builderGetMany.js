import builderModel from "./builderModel.js";
import { logger } from "../utils/logger.js";

const builderGetMany = async (req, res) => {
  try {
    // Optimized query - exclude "Build Your Own" template with lean() for performance
    const rawBuilders = await builderModel
      .find(
        {
          pizzaName: { $ne: "Build Your Own" },
        },
        null,
        { lean: true }
      )
      .sort({ pizzaPrice: 1, pizzaName: 1 }); // Sort by price, then name

    // Map _id to id for consistency across API responses
    const getBuiltPizzas = rawBuilders.map((doc) => {
      const id = doc._id?.toString?.() || doc._id;
      const { _id, __v, ...rest } = doc;
      return { id, ...rest };
    });

  logger.info({ count: getBuiltPizzas.length }, "Pizza builders retrieved");

    res.status(200).json({
      success: true,
      builders: getBuiltPizzas,
      count: getBuiltPizzas.length,
    });
  } catch (error) {
  logger.error({ error: error.message }, "Error getting pizza builders");
    res.status(500).json({
      success: false,
      message: "Failed to retrieve pizza builders",
    });
  }
};

export default builderGetMany;
