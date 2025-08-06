import mongoose from "mongoose";

const Schema = mongoose.Schema;

const IngredientsAll = new Schema({
  name: { type: String, required: true },
  description: String,
  itemType: String,
  price: Number,
});

export default IngredientsAll;
