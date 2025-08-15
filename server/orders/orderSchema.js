import mongoose from "mongoose";


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

  // Payment Integration Fields for Square
  payment: {
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
    },
    method: {
      type: String,
      enum: ["square", "cash", "comp"], // Add other methods as needed
      default: "square",
    },
    squarePaymentId: {
      type: String,
      sparse: true, // Allows null but unique when present
    },
    receiptNumber: {
      type: String,
      sparse: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    processingFee: {
      type: Number,
      default: 0,
    },
    paidAt: {
      type: Date,
    },
    refundedAt: {
      type: Date,
    },
    failureReason: {
      type: String,
    },
  },

  status: {
    type: String,
    // Allowable entries
    enum: [
      "pending_payment",
      "processing",
      "completed",
      "delivered",
      "archived",
      "cancelled",
    ],
    default: "pending_payment", // Start with pending payment
  },

  // Remove, is not needed if the status of archived is in the status
  isArchived: {
    type: Boolean,
    default: false,
  },
});

// Performance Indexes for frequent queries
orderSchema.index({ status: 1, date: -1 }); // Orders by status and date (newest first)
orderSchema.index({ orderNumber: 1 }); // Unique order number lookup
orderSchema.index({ date: -1 }); // Recent orders
orderSchema.index({ "address.zip": 1 }); // Orders by location
orderSchema.index({ "payment.status": 1 }); // Payment status queries
// Note: payment.squarePaymentId index is created automatically by sparse: true option

export default orderSchema;