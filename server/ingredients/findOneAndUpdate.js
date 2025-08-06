import ingredientsModel from "./ingredientsModel.js";

const findOneAndUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, itemType, price } = req.body;

    const updateIngredient = await ingredientsModel.findOneAndUpdate(
      { _id: id },
      { name, description, itemType, price },
      { new: true }
    );

    console.log("updateIngredient", updateIngredient);

    // If no ingredient found, return 404
    if (!updateIngredient) {
      return res.status(404).json({ error: "Ingredient not found." });
    }
    res
      .status(200)
      .json({ success: true, ingredient: updateIngredient?.toJSON() });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the ingredient." });
  }
};

export default findOneAndUpdate;
