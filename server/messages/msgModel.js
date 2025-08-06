import mongoose from "mongoose";
import messageSchema from "./msgSchema.js";

messageSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;
