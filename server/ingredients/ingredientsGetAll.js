import ingredientsModel from "./ingredientsModel.js";

const ingredientsGetAll = async (req, res) => {
  // Sort by itemType (A-Z), then by name (A-Z) within each type
  const getIngredients = await ingredientsModel
    .find()
    .sort({ itemType: 1, name: 1 });

  console.log("getIngredients", getIngredients);

  res.status(200).json({ success: true, ingredients: getIngredients });
};

export default ingredientsGetAll;
