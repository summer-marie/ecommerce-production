import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    data: { type: String, default: "" }, // base64 data URL
    filename: { type: String, default: "" },
    mimetype: { type: String, default: "" },
  },
  { _id: false }
);

const aboutSchema = new mongoose.Schema(
  {
    // Universal section headings & descriptions
    topHeading: {
      type: String,
      default: "From Hearth to Table: Freshness & Flavor That Set Us Apart",
    },
    topDescription: { type: String, default: "" },
    centerHeading: { type: String, default: "Our Purpose" },
    centerDescription: { type: String, default: "" },
    bottomHeading: {
      type: String,
      default: "Boston-Bred Classics: Savoring Neighbors Close by",
    },
    bottomDescription: { type: String, default: "" },
    topImage: { type: ImageSchema, default: () => ({}) },
    centerImage: { type: ImageSchema, default: () => ({}) },
    bottomImage: { type: ImageSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default aboutSchema;
