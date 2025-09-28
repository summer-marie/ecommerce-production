import builderModel from "./builderModel.js";
import { logInfo, logError } from "../middleware/logger.js";

const builderToggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    logInfo("Toggling pizza status", { id, active });

    // Validate the active field is a boolean
    if (typeof active !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "Active field must be a boolean value",
      });
    }

    // Find and update the pizza's active status
    const updatedPizza = await builderModel.findByIdAndUpdate(
      id,
      { active },
      { new: true } // Return the updated document
    );

    if (!updatedPizza) {
      logError("Pizza not found for status toggle", { id });
      return res.status(404).json({
        success: false,
        message: "Pizza not found",
      });
    }

    logInfo("Pizza status updated successfully", { 
      id, 
      pizzaName: updatedPizza.pizzaName,
      active: updatedPizza.active 
    });

    // Fetch fresh list so client can replace state in one atomic update (mirrors order status pattern)
  const builders = await builderModel.find({}).sort({ pizzaName: 1 });

    res.status(200).json({
      success: true,
      message: `Pizza ${active ? 'activated' : 'deactivated'} successfully`,
      pizza: updatedPizza,
      builders,
      count: builders.length
    });

  } catch (error) {
    logError("Error toggling pizza status", { error: error.message });
    res.status(500).json({
      success: false,
      message: "Failed to update pizza status",
      error: error.message,
    });
  }
};

export default builderToggleStatus;