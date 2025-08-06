import orderModel from "./orderModel.js"

const orderUpdateStatus = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  console.log("SERVER: i am id", id, status)
  try {
    const order = await orderModel.findOneAndUpdate(
      { _id: id },
      {
        status: status.status
      },
      { new: true }
    )

    const getOrders = await orderModel.aggregate([
      { $match: { status: { $ne: "archived" } } },
    ])

    console.log("SERVER: order", order)
    res.status(200).json({ orders: getOrders })
  } catch (error) {
    console.error("SERVER: Error updating order", error)
    res
      .status(500)
      .json({ error: "An error occurred while updating the order" })
  }
}

export default orderUpdateStatus
