import mongoose from "mongoose"
import ingredientsSchema from "./ingredientsSchema.js"

ingredientsSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})
const ingredientsModel = mongoose.model("Ingredients", ingredientsSchema)

export default ingredientsModel
