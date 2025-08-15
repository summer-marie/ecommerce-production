import "dotenv/config";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Square = require("square");
// Resolve constructor and env enum across different builds
const ClientCtor =
  Square.Client ??
  Square.SquareClient ??
  Square.default?.Client ??
  Square.default?.SquareClient;
const EnvironmentEnum =
  Square.Environment ??
  Square.SquareEnvironment ??
  Square.default?.Environment ??
  Square.default?.SquareEnvironment;
import crypto from "crypto";
import {
  updateOrderPaymentStatus,
  getOrderByPaymentId,
} from "../orders/orderPaymentHelpers.js";

// Helper: sanitize objects for JSON (convert BigInt recursively)
function toJsonSafe(value) {
  if (typeof value === "bigint") return Number(value); // or String(value)
  if (Array.isArray(value)) return value.map(toJsonSafe);
  if (value && typeof value === "object") {
    const out = {};
    for (const k of Object.keys(value)) out[k] = toJsonSafe(value[k]);
    return out;
  }
  return value;
}

// Initialize Square client
if (process.env.NODE_ENV !== 'production') {
  console.log("Square module keys:", Object.keys(Square));
  console.log("Resolved ClientCtor type:", typeof ClientCtor);
  console.log(
    "Resolved EnvironmentEnum keys:",
    EnvironmentEnum ? Object.keys(EnvironmentEnum) : "undefined"
  );
}
if (!ClientCtor) {
  throw new Error(
    "Square SDK: Could not resolve Client constructor (looked for Client/SquareClient)."
  );
}
const squareClient = new ClientCtor({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? EnvironmentEnum?.Production ?? "production"
      : EnvironmentEnum?.Sandbox ?? "sandbox",
});

// Debug: Check if Square client is properly initialized
if (process.env.NODE_ENV !== 'production') {
  console.log("Square client initialized:", !!squareClient);
  console.log("Square client keys:", Object.keys(squareClient));
  if (squareClient.paymentsApi) {
    console.log(
      "paymentsApi methods:",
      Object.getOwnPropertyNames(squareClient.paymentsApi)
    );
  } else {
    console.log("paymentsApi not found, checking alternatives...");
    if (squareClient.payments) {
      console.log("Found payments property:", typeof squareClient.payments);
    }
  }
  console.log("Environment:", process.env.SQUARE_ENVIRONMENT);
  console.log("Access Token exists:", !!process.env.SQUARE_ACCESS_TOKEN);
}

// Extra introspection for payments API shape
if (process.env.NODE_ENV !== 'production') {
  try {
    const p = squareClient.payments;
    console.log("payments typeof:", typeof p);
    if (p) {
      console.log("payments own keys:", Object.getOwnPropertyNames(p));
      const proto = Object.getPrototypeOf(p);
      if (proto)
        console.log("payments proto keys:", Object.getOwnPropertyNames(proto));
    }
    const pa = squareClient.paymentsApi;
    console.log("paymentsApi typeof:", typeof pa);
    if (pa) {
      console.log("paymentsApi own keys:", Object.getOwnPropertyNames(pa));
      const protoA = Object.getPrototypeOf(pa);
      if (protoA)
        console.log(
          "paymentsApi proto keys:",
          Object.getOwnPropertyNames(protoA)
        );
    }
  } catch (e) {
    console.log("payments introspection error:", e?.message);
  }
}

function resolvePaymentsApi(client) {
  let api = client.paymentsApi ?? client.payments ?? null;
  if (typeof api === "function") {
    try {
      api = api();
    } catch {
      /* ignore */
    }
  }
  return api;
}

function selectCreatePaymentFn(paymentsApi) {
  const candidates = [
    paymentsApi?.createPayment,
    paymentsApi?.create,
    paymentsApi?.CreatePayment,
  ];
  for (const fn of candidates) {
    if (typeof fn === "function") return fn.bind(paymentsApi);
  }
  return null;
}

function selectGetPaymentFn(paymentsApi) {
  const candidates = [
    paymentsApi?.getPayment,
    paymentsApi?.GetPayment,
    paymentsApi?.get,
  ];
  for (const fn of candidates) {
    if (typeof fn === "function") return fn.bind(paymentsApi);
  }
  return null;
}

function selectListPaymentsFn(paymentsApi) {
  const candidates = [
    paymentsApi?.listPayments,
    paymentsApi?.ListPayments,
    paymentsApi?.list,
  ];
  for (const fn of candidates) {
    if (typeof fn === "function") return fn.bind(paymentsApi);
  }
  return null;
}

function resolveResource(client, names) {
  for (const n of names) {
    if (client[n]) return client[n];
  }
  return null;
}

// Create payment endpoint
export const createSquarePayment = async (req, res) => {
  try {
    const { sourceId, amount, orderId, orderNumber, customerDetails } =
      req.body;

    // Prefer orderNumber; fall back to orderId for backward compatibility
    const orderRef = orderNumber ?? orderId;

    // Validate required fields
    if (!sourceId || !amount || orderRef == null) {
      return res.status(400).json({
        error: "Missing required fields: sourceId, amount, orderNumber",
      });
    }

    if (typeof amount !== 'number') {
      // Frontend sends a number; if it's a string attempt conversion
      const parsed = Number(amount);
      if (Number.isNaN(parsed)) {
        return res.status(400).json({ error: 'Amount must be a number' });
      }
    }

    if (!process.env.SQUARE_LOCATION_ID) {
      return res.status(500).json({ error: 'Square location not configured' });
    }

    if (!process.env.SQUARE_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'Square access token not configured' });
    }

    // Convert dollars to cents (Square requires cents)
    const amountInCents = Math.round(amount * 100);

    // Minimum amount validation (50 cents)
    if (amountInCents < 50) {
      return res
        .status(400)
        .json({ error: "Payment amount must be at least $0.50" });
    }

    // Normalize reference for Square (string) and DB (number where applicable)
    const referenceId = String(orderRef);
    const orderRefNumber = Number.isNaN(Number(orderRef))
      ? null
      : Number(orderRef);

    const paymentRequest = {
      sourceId,
      amountMoney: { amount: amountInCents, currency: "USD" },
      locationId: process.env.SQUARE_LOCATION_ID,
      referenceId,
      note: `Pizza Order #${referenceId}${
        customerDetails?.firstName
          ? ` - ${customerDetails.firstName} ${customerDetails.lastName}`
          : ""
      }`,
      idempotencyKey:
        crypto.randomUUID?.() ?? crypto.randomBytes(16).toString("hex"),
    };

    if (process.env.NODE_ENV !== 'production') {
      console.log("[Square] Creating payment", {
        orderRef: referenceId,
        amountInCents,
        location: process.env.SQUARE_LOCATION_ID,
        hasToken: !!process.env.SQUARE_ACCESS_TOKEN,
      });
    }

    const paymentsApi = resolvePaymentsApi(squareClient);
    if (!paymentsApi) {
      throw new Error("Square SDK payments API not found on client");
    }

    const createFn = selectCreatePaymentFn(paymentsApi);
    if (!createFn) {
      console.log(
        "Available payments keys:",
        Object.getOwnPropertyNames(paymentsApi)
      );
      throw new Error(
        "Square SDK createPayment method not found on payments API"
      );
    }

    // Call with the request object directly (SDK validates and serializes BigInt)
    let resp;
    try {
      resp = await createFn(paymentRequest);
    } catch (sdkErr) {
      console.error('[Square] SDK createPayment error raw:', sdkErr); 
      if (sdkErr?.errors) {
        return res.status(400).json({
          error: 'Payment failed',
          details: sdkErr.errors[0]?.detail || sdkErr.errors[0]?.code,
          category: sdkErr.errors[0]?.category,
        });
      }
      return res.status(400).json({ error: 'Payment failed', details: sdkErr.message });
    }
    const result = resp.result ?? resp;

    if (process.env.NODE_ENV !== 'production') {
      console.log("[Square] Payment success", {
        paymentId: result.payment?.id,
        status: result.payment?.status,
        receipt: result.payment?.receiptNumber,
      });
    }

    // Try to update order, but don't fail payment response if not found
    let orderUpdate = { updated: false };
    try {
      if (orderRefNumber != null) {
        await updateOrderPaymentStatus(orderRefNumber, {
          status: "completed",
          squarePaymentId: result.payment.id,
          receiptNumber: result.payment.receiptNumber,
          amountPaid: Number(result.payment.amountMoney.amount) / 100,
          processingFee:
            (result.payment.processingFee || []).reduce(
              (total, fee) => total + Number(fee?.amountMoney?.amount ?? 0),
              0
            ) / 100,
        });
        orderUpdate = { updated: true };
      } else {
        console.warn(
          `Order reference '${referenceId}' is not numeric; skipped DB update.`
        );
        orderUpdate = { updated: false, reason: "non_numeric_reference" };
      }
    } catch (e) {
      console.error(`Order update failed for ref ${referenceId}:`, e?.message);
      orderUpdate = { updated: false, error: e?.message };
    }

    res.json({
      success: true,
      paymentId: result.payment.id,
      receiptNumber: result.payment.receiptNumber,
      status: result.payment.status,
      orderRef: referenceId,
      orderUpdate,
    });
  } catch (error) {
  console.error("[Square] Payment controller failure:", error);

    // Handle Square-specific errors
    if (error.errors) {
      const squareError = error.errors[0];
      return res.status(400).json({
        error: "Payment failed",
        details: squareError.detail || squareError.code,
        category: squareError.category,
      });
    }

    res
      .status(500)
      .json({ error: "Payment processing failed", details: error.message });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const paymentsApi = resolvePaymentsApi(squareClient);
    if (!paymentsApi)
      throw new Error("Square SDK payments API not found on client");
    const getFn = selectGetPaymentFn(paymentsApi);
    if (!getFn)
      throw new Error("Square SDK getPayment method not found on payments API");

    let result;
    try {
      const resp = await getFn(paymentId);
      result = resp.result ?? resp;
    } catch (e1) {
      const resp = await getFn({ paymentId });
      result = resp.result ?? resp;
    }

    res.json({
      paymentId: result.payment.id,
      status: result.payment.status,
      amount: Number(result.payment.amountMoney.amount) / 100, // Convert BigInt to number (dollars)
      createdAt: result.payment.createdAt,
      receiptNumber: result.payment.receiptNumber,
    });
  } catch (error) {
    console.error("Failed to get payment status:", error);
    res.status(500).json({ error: "Failed to retrieve payment status" });
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
      const referenceIdRaw = payment.reference_id;
      const numericRef = Number(referenceIdRaw);
      const orderRefNumber = Number.isFinite(numericRef) ? numericRef : null;

      console.log(
        `Payment ${payment.id} updated to status: ${payment.status} (ref: ${referenceIdRaw})`
      );

      if (orderRefNumber == null) {
        console.warn(
          `Webhook reference_id '${referenceIdRaw}' is not numeric; skipping order update.`
        );
      } else {
        // Update order status based on payment status
        if (payment.status === "COMPLETED") {
          await updateOrderPaymentStatus(orderRefNumber, {
            status: "completed",
            squarePaymentId: payment.id,
            amountPaid: Number(payment.amountMoney?.amount ?? 0) / 100,
          });
        } else if (
          payment.status === "FAILED" ||
          payment.status === "CANCELED"
        ) {
          await updateOrderPaymentStatus(orderRefNumber, {
            status: "failed",
            squarePaymentId: payment.id,
            failureReason: payment.status,
          });
        }
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
    // Try payments first
    const paymentsApi = resolveResource(squareClient, [
      "payments",
      "paymentsApi",
    ]);
    if (paymentsApi) {
      const listPaymentsFn = selectListPaymentsFn(paymentsApi);
      if (listPaymentsFn) {
        let result;
        try {
          const resp = await listPaymentsFn({});
          result = resp.result ?? resp;
        } catch (e1) {
          const resp = await listPaymentsFn();
          result = resp.result ?? resp;
        }
        const safe = toJsonSafe(result);
        return res.json({
          success: true,
          message: "Square payments API connection successful",
          environment: process.env.SQUARE_ENVIRONMENT,
          payments: safe.payments || safe.results || safe || [],
        });
      }
    }

    // Fallback to locations
    const locationsApi = resolveResource(squareClient, [
      "locations",
      "locationsApi",
    ]);
    if (locationsApi) {
      const listLocFn =
        (typeof locationsApi.listLocations === "function" &&
          locationsApi.listLocations.bind(locationsApi)) ||
        (typeof locationsApi.ListLocations === "function" &&
          locationsApi.ListLocations.bind(locationsApi));

      if (listLocFn) {
        const resp = await listLocFn();
        const result = resp.result ?? resp;
        const safe = toJsonSafe(result);
        return res.json({
          success: true,
          message: "Square locations API connection successful",
          environment: process.env.SQUARE_ENVIRONMENT,
          locations: (safe.locations || []).map((l) => ({
            id: l.id,
            name: l.name,
            status: l.status,
          })),
        });
      }
    }

    throw new Error(
      "No suitable Square API method found for test (payments or locations)"
    );
  } catch (error) {
    console.error("Square connection test failed:", error);
    res
      .status(500)
      .json({ error: "Square connection failed", details: error.message });
  }
};
