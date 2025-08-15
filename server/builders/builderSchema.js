import mongoose from "mongoose";

const Schema = mongoose.Schema;

const builderSchema = new Schema({
  pizzaName: {
    type: String,
    required: true,
  },
  pizzaPrice: {
    type: Number,
    default: 0,
    required: true,
  },
  // Crust && Cheese
  base: [
    {
      name: { type: String, required: true },
      description: String,
      itemType: String,
      price: Number,
    },
  ],
  sauce: {
    name: { type: String, required: true },
    description: String,
    price: Number,
  },
  meatTopping: [
    {
      name: { type: String, required: true },
      description: String,
      price: Number,
      itemType: String,
      amount: { type: Number, default: 1 },
    },
  ],
  veggieTopping: [
    {
      name: { type: String, required: true },
      description: String,
      price: Number,
      itemType: String,
      amount: { type: Number, default: 1 },
    },
  ],
  image: {
    url: String,        // Firebase Storage download URL
    path: String,       // Firebase Storage path for deletion
    filename: String,   // Original filename
  },
});

export default builderSchema;
