import mongoose from "mongoose";
import aboutSchema from "./aboutSchema.js";

aboutSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const aboutModel = mongoose.model("About", aboutSchema, "about");

export default aboutModel;