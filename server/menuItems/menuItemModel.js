import mongoose from "mongoose";
import menuItemSchema from "./menuItemSchema.js";

menuItemSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
const menuItemModel = mongoose.model("MenuItem", menuItemSchema);

export default menuItemModel;