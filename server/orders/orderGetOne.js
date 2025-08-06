import orderModel from "./orderModel.js"

const orderGetOne = async (req, res) => {
  const { id } = req.params
  try {
    const order = await orderModel.findById(id)
    console.log("server: order get one", order)
    if (!order) {
      return res.status(404).send("Order not found")
    }
    res.status(200).json({ success: true, order: order })
  } catch (error) {
    console.error("Error fetching order:", error)
    res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}

export default orderGetOne
