import orderModel from "./orderModel.js";

const orderUpdateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log("=== SERVER STATUS UPDATE START ===");
  console.log("SERVER: Updating order ID:", id, "to status:", status);
  
  try {
    // First, get counts before update
    const beforeCounts = await orderModel.aggregate([
      { $match: { status: { $ne: "archived" } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    console.log("SERVER: Counts BEFORE update:", beforeCounts);
    
    const order = await orderModel.findOneAndUpdate(
      { _id: id },
      {
        status: status.status,
      },
      { new: true }
    );

    if (!order) {
      console.log("SERVER: Order not found with ID:", id);
      return res.status(404).json({ error: "Order not found" });
    }

    // Return normalized open orders with `id` (no `_id`), to keep client consistent
    const rawOrders = await orderModel
      .find({ isArchived: { $ne: true }, status: { $ne: "archived" } })
      .sort({ date: -1 })
      .lean();
    const getOrders = rawOrders.map(({ _id, __v, ...rest }) => ({
      id: _id?.toString?.() ?? String(_id),
      ...rest,
    }));
    
    // Get counts after update
    const afterCounts = await orderModel.aggregate([
      { $match: { status: { $ne: "archived" } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    console.log("SERVER: Counts AFTER update:", afterCounts);
  console.log("SERVER: Returning", getOrders.length, "total orders");
    console.log("=== SERVER STATUS UPDATE END ===");

    res.status(200).json({ orders: getOrders });
  } catch (error) {
    console.error("SERVER: Error updating order", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the order" });
  }
};

export default orderUpdateStatus;
