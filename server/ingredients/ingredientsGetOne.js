import ingredientsModel from "./ingredientsModel.js"

const ingredientGetOne = async (req, res) => {
  const { id } = req.params
  console.log("id", id)

  const ingredient = await ingredientsModel.findOne({ _id: id })
  console.log("ingredient", ingredient)
  res.status(200).json({ success: true, ingredient: ingredient })
}

export default ingredientGetOne
