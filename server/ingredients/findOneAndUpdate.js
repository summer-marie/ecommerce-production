import ingredientsModel from "./ingredientsModel.js";
import { invalidateCache } from "../middleware/performance.js";
import { getLog } from "../utils/logger.js";

const findOneAndUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, itemType, price } = req.body;

    const log = getLog(req, { event: 'ingredient.update' });
    const updateIngredient = await ingredientsModel.findOneAndUpdate(
      { _id: id },
      { name, description, itemType, price },
      { new: true }
    );
    log.debug({ id, found: !!updateIngredient }, 'update ingredient result');

    // If no ingredient found, return 404
    if (!updateIngredient) {
      return res.status(404).json({ error: "Ingredient not found." });
    }

    // Ensure id is returned as string for client matching
    const updatedObj = updateIngredient.toObject();
    const updatedResponse = {
      id: updatedObj._id?.toString?.() || updatedObj._id,
      name: updatedObj.name,
      description: updatedObj.description,
      itemType: updatedObj.itemType,
      price: updatedObj.price,
    };

    // Invalidate any cached ingredient lists
    await invalidateCache("api:/ingredients*");

    res.status(200).json({ success: true, ingredient: updatedResponse });
  } catch (error) {
    const log = getLog(req, { event: 'ingredient.update.error' });
    log.error({ err: error?.message }, 'ingredient update error');
    res
      .status(500)
      .json({ error: "An error occurred while updating the ingredient." });
  }
};

export default findOneAndUpdate;
