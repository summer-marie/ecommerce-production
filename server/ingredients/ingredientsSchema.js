import mongoose from "mongoose";

const Schema = mongoose.Schema;

const IngredientsAll = new Schema({
  name: { type: String, required: true },
  description: String,
  itemType: String,
  price: Number,
});

// Performance Indexes for ingredient queries
IngredientsAll.index({ itemType: 1, price: 1 }); // Filter by type and sort by price
IngredientsAll.index({ name: 1 }); // Search by name

export default IngredientsAll;
