import pkg from "square";
const { SquareClient, SquareEnvironment } = pkg;
import crypto from "crypto";
import {
  updateOrderPaymentStatus,
  getOrderByPaymentId,
} from "../orders/orderPaymentHelpers.js";

// Initialize Square client
const squareClient = new SquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});

// Create payment endpoint
export const createSquarePayment = async (req, res) => {
  try {
    const { sourceId, amount, orderId, customerDetails } = req.body;

    // Validate required fields
    if (!sourceId || !amount || !orderId) {
      return res.status(400).json({
        error: "Missing required fields: sourceId, amount, orderId",
      });
    }

    // Convert dollars to cents (Square requires cents)

    const amountInCents = Math.round(amount * 100);

    // Minimum amount validation (50 cents)
    if (amountInCents < 50) {
      return res.status(400).json({
        error: "Payment amount must be at least $0.50",
      });
    }

    const paymentRequest = {
      sourceId, // Token from frontend
      amountMoney: {
        amount: amountInCents,
        currency: "USD",
      },
      locationId: process.env.SQUARE_LOCATION_ID,
      referenceId: orderId, // Your order number
      note: `Pizza Order #${orderId}${
        customerDetails?.firstName
          ? ` - ${customerDetails.firstName} ${customerDetails.lastName}`
          : ""
      }`,
    };

    console.log("Creating Square payment:", { orderId, amount: amountInCents });

    const { result } = await squareClient.payments.createPayment(
      paymentRequest
    );

    console.log("Square payment successful:", result.payment.id);

    // Update order with payment info in database
    await updateOrderPaymentStatus(orderId, {
      status: "completed",
      squarePaymentId: result.payment.id,
      receiptNumber: result.payment.receiptNumber,
      amountPaid: result.payment.amountMoney.amount / 100, // Convert back to dollars
      processingFee:
        (result.payment.processingFee || []).reduce(
          (total, fee) => total + fee.amountMoney.amount,
          0
        ) / 100,
    });

    res.json({
      success: true,
      paymentId: result.payment.id,
      receiptNumber: result.payment.receiptNumber,
      status: result.payment.status,
      orderId: orderId,
    });
  } catch (error) {
    console.error("Square payment failed:", error);

    // Handle Square-specific errors
    if (error.errors) {
      const squareError = error.errors[0];
      return res.status(400).json({
        error: "Payment failed",
        details: squareError.detail || squareError.code,
        category: squareError.category,
      });
    }

    res.status(500).json({
      error: "Payment processing failed",
      details: error.message,
    });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const { result } = await squareClient.payments.getPayment(paymentId);

    res.json({
      paymentId: result.payment.id,
      status: result.payment.status,
      amount: result.payment.amountMoney.amount / 100, // Convert back to dollars
      createdAt: result.payment.createdAt,
      receiptNumber: result.payment.receiptNumber,
    });
  } catch (error) {
    console.error("Failed to get payment status:", error);
    res.status(500).json({
      error: "Failed to retrieve payment status",
    });
  }
};

// Webhook handler for payment events
export const handleSquareWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-square-signature"];
    const body = JSON.stringify(req.body);

    // Verify webhook signature for security
    const hash = crypto
      .createHmac("sha1", process.env.SQUARE_WEBHOOK_SIGNATURE_KEY)
      .update(body)
      .digest("base64");

    if (signature !== hash) {
      console.error("Webhook signature verification failed");
      return res.status(401).send("Unauthorized");
    }

    const event = req.body;
    console.log("Square webhook received:", event.type);

    if (event.type === "payment.updated") {
      const payment = event.data.object.payment;
      const orderId = payment.reference_id;

      console.log(`Payment ${payment.id} updated to status: ${payment.status}`);

      // Update order status based on payment status
      if (payment.status === "COMPLETED") {
        await updateOrderPaymentStatus(orderId, {
          status: "completed",
          squarePaymentId: payment.id,
          amountPaid: payment.amountMoney.amount / 100,
        });
      } else if (payment.status === "FAILED" || payment.status === "CANCELED") {
        await updateOrderPaymentStatus(orderId, {
          status: "failed",
          squarePaymentId: payment.id,
          failureReason: payment.status,
        });
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

// Test Square connection
// export const testSquareConnection = async (req, res) => {
//   try {
//     const { result } = await squareClient.locations.listLocations();

//     res.json({
//       success: true,
//       message: "Square connection successful",
//       environment: process.env.SQUARE_ENVIRONMENT,
//       locations:
//         result.locations?.map((loc) => ({
//           id: loc.id,
//           name: loc.name,
//           status: loc.status,
//         })) || [],
//     });
//   } catch (error) {
//     console.error("Square connection test failed:", error);
//     res.status(500).json({
//       error: "Square connection failed",
//       details: error.message,
//     });
//   }
// };

export const testSquareConnection = async (req, res) => {
  try {
    const { result } = await squareClient.payments.listPayments();
    res.json({
      success: true,
      message: "Square payments API connection successful",
      environment: process.env.SQUARE_ENVIRONMENT,
      payments: result.payments || [],
    });
  } catch (error) {
    console.error("Square connection test failed:", error);
    res.status(500).json({
      error: "Square connection failed",
      details: error.message,
    });
  }
};
