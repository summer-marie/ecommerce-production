import orderModel from "./orderModel.js";

const ordersArchive = async (req, res) => {
  const { id } = req.params;
  try {
    const orderArchive = await orderModel.findOneAndUpdate(
      { _id: id },
      { $set: { isArchived: true } },
      { new: true }
    );
    if (!orderArchive) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.status(200).json({ success: true, order: orderArchive });
  } catch (err) {
    res.status(500).json({ message: "There was an error." });
  }
};
export default ordersArchive;
