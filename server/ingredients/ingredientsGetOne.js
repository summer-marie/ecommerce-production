import ingredientsModel from "./ingredientsModel.js";
import { getLog } from "../utils/logger.js";

const ingredientGetOne = async (req, res) => {
  const { id } = req.params;
  const log = getLog(req, { event: 'ingredient.getOne' });
  const ingredient = await ingredientsModel.findOne({ _id: id });
  log.debug({ id, found: !!ingredient }, 'ingredient get one');
  res.status(200).json({ success: true, ingredient: ingredient });
};

export default ingredientGetOne;
