import orderModel from "./orderModel.js";

// TODO: Add month/year filter and pagination for archived orders in the admin frontend for easier navigation and record-keeping. Keep at least 1 year of archived orders for tax purposes.

const orderGetArchived = async (req, res) => {
  try {
    const pipeline = [
      { $match: { status: "archived" } },
      { $sort: { Date: -1 } },
    ];

    const getOrders = await orderModel.aggregate(pipeline, {
      maxTimeMS: 5000,
      allowDiskUse: true,
    });

    console.log("Archived orders found:", getOrders.length);
    res.status(200).json({ success: true, orders: getOrders });
  } catch (error) {
    console.error("Error fetching archived orders:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default orderGetArchived;
