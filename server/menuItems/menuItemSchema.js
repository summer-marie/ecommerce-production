import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    itemType: {
      type: String,
      required: true,
      enum: ["Calzone", "Pizza Sticks", "Appetizer", "Side", "Dessert", "Beverage", "Other"],
      default: "Other"
    },
    itemPrice: {
      type: Number,
      required: true,
      min: 0,
      max: 1000,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    // Base ingredients (crust/bread, cheeses)
    base: {
      crust: {
        type: Object,
        default: null,
      },
      cheeses: {
        type: [Object],
        default: [],
      },
    },
    // Sauce selection
    sauce: {
      type: Object,
      default: null,
    },
    // Meat toppings
    meatTopping: {
      type: [Object],
      default: [],
    },
    // Veggie toppings
    veggieTopping: {
      type: [Object],
      default: [],
    },
    // Herbs
    herbs: {
      type: [Object],
      default: [],
    },
    // Other additions
    otherAdditions: {
      type: [Object],
      default: [],
    },
    // Image data (Base64 encoded)
    image: {
      data: String,
      filename: String,
      mimetype: String,
      size: Number,
    },
    // Availability
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // Featured status
    isFeatured: {
      type: Boolean,
      default: false,
    },
    // Display order
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
menuItemSchema.index({ itemType: 1, isAvailable: 1 });
menuItemSchema.index({ isFeatured: 1, sortOrder: 1 });

export default menuItemSchema;