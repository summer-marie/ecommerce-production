import builderModel from "./builderModel.js";

const builderGetOne = async (req, res) => {
  const { id } = req.params;

  // Use findById to get a single pizza object
  const pizza = await builderModel.findById(id);
  console.log("server: pizza get one", pizza);

  if (!pizza) {
    return res.status(404).send("Pizza not found");
  }

  res.status(200).json({ success: true, pizza });
};

export default builderGetOne;
