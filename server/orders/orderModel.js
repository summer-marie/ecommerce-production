import mongoose from "mongoose"
import orderSchema from "./orderSchema.js"

orderSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})

const orderModel = mongoose.model("order", orderSchema)

export default orderModel
