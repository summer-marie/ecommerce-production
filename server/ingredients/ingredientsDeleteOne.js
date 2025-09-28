import ingredientsModel from "./ingredientsModel.js";
import { invalidateCache } from "../middleware/performance.js";
import { getLog } from "../utils/logger.js";

const ingredientDelete = async (req, res) => {
  const { id } = req.params;
  const log = getLog(req, { event: 'ingredient.delete' });
  log.debug({ id }, 'delete ingredient request');
  try {
  log.debug({ id }, 'attempting delete ingredient');
    const deletedIngredient = await ingredientsModel.findByIdAndDelete(id);
    if (!deletedIngredient) {
      log.warn({ id }, 'ingredient not found');
      return res.status(404).json({ message: "Ingredient not found" });
    }
    log.info({ id }, 'ingredient deleted');

    // Invalidate cached ingredient lists
    await invalidateCache("api:/ingredients*");

    res.status(200).json({ success: true, id });
  } catch (err) {
    log.error({ id, err: err?.message }, 'ingredient delete error');
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default ingredientDelete;
