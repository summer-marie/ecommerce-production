import orderModel from "./orderModel.js";

const orderGetArchived = async (req, res) => {
  try {
    const getOrders = await orderModel.aggregate([
      {
        $match: {
          status: "archived", // Only match status "archived"
        },
      },
      {
        $sort: {
          Date: -1,
        },
      },
    ]);

    console.log("Archived orders found:", getOrders.length);
    res.status(200).json({ success: true, orders: getOrders });
  } catch (error) {
    console.error("Error fetching archived orders:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default orderGetArchived;
