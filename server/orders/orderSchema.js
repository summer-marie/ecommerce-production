import mongoose from "mongoose";

// top level is good for small ammounts of data, but if it grows may need to nest the info

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderNumber: {
    type: Number,
    required: true,
    default: 100000,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  orderDetails: [
    {
      pizzaName: {
        type: String,
        default: "",
      },
      pizzaPrice: {
        type: Number,
        default: 0,
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
  ],
  address: {
    street: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    zip: {
      type: String,
      default: "",
    },
  },
  phone: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  orderTotal: {
    type: Number,
  },
  status: {
    type: String,
    // Allowable entries
    enum: ["processing", "completed", "delivered", "archived", "cancelled"],
    default: "processing",
  },

  // Remove, is not needed if the status of archived is in the status
  isArchived: {
    type: Boolean,
    default: false,
  },
});

export default orderSchema;
