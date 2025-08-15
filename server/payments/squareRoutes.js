import express from "express";
import rateLimit from "express-rate-limit";
import {
  createSquarePayment,
  getPaymentStatus,
  handleSquareWebhook,
  testSquareConnection,
} from "./squareController.js";

const paymentIndex = express.Router();

// Rate limiting for payment endpoints
const paymentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 payment attempts per 15 minutes per IP
  message: {
    error: "Too many payment attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Test Square connection (development only)
paymentIndex.get("/square/test", testSquareConnection);

// Create payment intent (rate limited)
paymentIndex.post(
  "/square/create-payment",
  paymentRateLimit,
  createSquarePayment
);

// Get payment status
paymentIndex.get("/square/payments/:paymentId", getPaymentStatus);

// Webhook endpoint (raw body already handled in main app)
paymentIndex.post(
  "/square/webhook",
  handleSquareWebhook
);

export default paymentIndex;
