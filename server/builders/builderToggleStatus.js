import builderModel from "./builderModel.js";
import { logger } from "../utils/logger.js";

// Toggle a pizza's active flag and return updated list
const builderToggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

  logger.info({ id, active }, "Toggling pizza status");

    if (typeof active !== "boolean") {
      return res.status(400).json({ success: false, message: "Active must be boolean" });
    }

    const updatedPizza = await builderModel.findByIdAndUpdate(id, { active }, { new: true });
    if (!updatedPizza) {
  logger.warn({ id }, "Pizza not found for status toggle");
      return res.status(404).json({ success: false, message: "Pizza not found" });
    }

  logger.info({ id, pizzaName: updatedPizza.pizzaName, active: updatedPizza.active }, "Pizza status updated");

    // Return full list so client can replace state
    const builders = await builderModel.find({}).sort({ pizzaName: 1 });
    res.status(200).json({
      success: true,
      message: `Pizza ${active ? "activated" : "deactivated"} successfully`,
      pizza: updatedPizza,
      builders,
      count: builders.length,
    });
  } catch (error) {
  logger.error({ error: error.message }, "Error toggling pizza status");
    res.status(500).json({ success: false, message: "Failed to update pizza status" });
  }
};

export default builderToggleStatus;