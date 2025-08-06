import mongoose from "mongoose"
import builderSchema from "./builderSchema.js"

builderSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  },
})
const builderModel = mongoose.model("builder", builderSchema)

export default builderModel
