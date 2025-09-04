import mongoose from "mongoose";
import operatingSchema from "./operatingSchema.js";

const OperatingHours =
  mongoose.models.OperatingHours ||
  mongoose.model("OperatingHours", operatingSchema);

export async function getOrCreateOperatingDoc() {
  let doc = await OperatingHours.findOne();
  if (!doc) {
    doc = await OperatingHours.create({});
  }
  return doc;
}

export default OperatingHours;
