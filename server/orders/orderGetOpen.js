import orderModel from "./orderModel.js";

const orderGetOpen = async (req, res) => {
  const getOrders = await orderModel.aggregate([
    {
      $match: {
        isArchived: { $ne: true },
        status: { $ne: "archived" },
      },
    },
  ]);

  res.status(200).json({ success: true, orders: getOrders });
};

export default orderGetOpen;
