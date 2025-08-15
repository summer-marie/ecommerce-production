import ingredientsModel from "./ingredientsModel.js";
import { invalidateCache } from "../middleware/performance.js";

const ingredientDelete = async (req, res) => {
  console.log("DELETE endpoint hit with id:", req.params.id);
  const { id } = req.params;
  try {
    console.log("Attempting to delete ingredient with ID:", id); // Log ID before deletion
    const deletedIngredient = await ingredientsModel.findByIdAndDelete(id);
    if (!deletedIngredient) {
      console.error("Ingredient not found for ID:", id); // Log if not found
      return res.status(404).json({ message: "Ingredient not found" });
    }
    console.log("Successfully deleted ingredient:", deletedIngredient); // Log successful deletion

    // Invalidate cached ingredient lists
    await invalidateCache('api:/ingredients*');

    res.status(200).json({ success: true, id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default ingredientDelete;
