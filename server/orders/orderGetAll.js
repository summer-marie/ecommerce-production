import orderModel from "./orderModel.js"

const orderGetAll = async (req, res) => {
  const getOrders = await orderModel.find()

  console.log("getOrders", getOrders)

  res.status(200).json({ success: true, orders: getOrders })
}

export default orderGetAll
