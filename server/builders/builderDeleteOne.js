import builderModel from "./builderModel.js";
import { invalidateCache } from "../middleware/performance.js";

const builderDeleteOne = async (req, res) => {
  console.log("DELETE endpoint hit with id:", req.params.id);
  const { id } = req.params;
  try {
    const deletedBuilder = await builderModel.findByIdAndDelete(id);
    if (!deletedBuilder) {
      return res.status(404).json({ message: "Builder not found" });
    }
  // Invalidate cache so deletion reflects
  await invalidateCache('api:/builders');
  res.status(200).json({ success: true, id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default builderDeleteOne;
