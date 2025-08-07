import mongoose from "mongoose";
import adminSchema from "./adminSchema.js";

adminSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.token;
    delete ret.authStrategy;
    delete ret.__v;
    return ret;
  },
});

const adminModel = mongoose.model("Admin", adminSchema, "admins"); // Force collection name to "admins"

export default adminModel;
