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
    filename: String,
    originalname: String,
    mimetype: String,
    path: String,
    size: Number,
  },
});

export default builderSchema;
