import orderModel from "./orderModel.js";

const ordersArchive = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("Archiving order with ID:", id);
    
    const orderArchive = await orderModel.findOneAndUpdate(
      { _id: id },
      { 
        $set: { 
          isArchived: true,
          status: "archived"
        } 
      },
      { new: true }
    );
    
    if (!orderArchive) {
      console.log("Order not found for ID:", id);
      return res.status(404).json({ message: "Order not found." });
    }
    
  console.log("Order archived successfully:", orderArchive.orderNumber);
  // Normalize to include `id` and omit `_id`/`__v`
  const { _id, __v, ...rest } = orderArchive.toObject();
  const normalized = { id: _id?.toString?.() ?? String(_id), ...rest };
  res.status(200).json({ success: true, order: normalized });
  } catch (err) {
    console.error("Error archiving order:", err);
    res.status(500).json({ message: "There was an error archiving the order.", error: err.message });
  }
};

export default ordersArchive;
