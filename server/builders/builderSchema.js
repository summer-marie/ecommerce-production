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
  base: {
    crust: {
      name: { type: String, required: true },
      description: String,
      price: Number,
      // optional: size: { type: String, enum: ['small','medium','large'] }
    },
    cheeses: [
      {
        name: { type: String, required: true },
        description: String,
        price: Number,
        // Limit allowed amounts to common options
        amount: { type: Number, enum: [0.5, 1, 2], default: 1, required: true }, // e.g., light/regular/extra as 0.5/1/2
      },
    ],
  },
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
    data: String, // Base64 encoded image data
    filename: String, // Original filename for reference
    mimetype: String, // Image MIME type (image/jpeg, image/png, etc.)
  },
});

builderSchema
  .path("base.cheeses")
  .validate((arr) => Array.isArray(arr), "cheeses must be an array");

export default builderSchema;
