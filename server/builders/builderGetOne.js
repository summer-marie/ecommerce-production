import builderModel from "./builderModel.js";
import { getLog } from "../utils/logger.js";

const builderGetOne = async (req, res) => {
  const { id } = req.params;

  // Use findById to get a single pizza object
  const log = getLog(req, { event: 'builder.getOne' });
  const pizza = await builderModel.findById(id);
  log.debug({ id, found: !!pizza }, 'builder get one');

  if (!pizza) {
    return res.status(404).send("Pizza not found");
  }

  res.status(200).json({ success: true, pizza });
};

export default builderGetOne;
