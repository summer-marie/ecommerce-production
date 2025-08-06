import builderModel from "./builderModel.js"

const builderGetMany = async (req, res) => {
  const getBuiltPizzas = await builderModel.find({
    pizzaName: { $ne: "Build Your Own" },
  })
  // console.log("getBuiltPizzas", getBuiltPizzas)

  res.status(200).json({ success: true, builders: getBuiltPizzas })
}

export default builderGetMany
