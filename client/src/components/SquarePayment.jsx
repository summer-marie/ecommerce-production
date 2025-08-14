import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { createSquarePayment } from "../redux/paymentSlice";
import squarePaymentService from "../redux/squarePaymentService";

const SquarePayment = ({
  orderTotal,
  onPaymentSuccess,
  onPaymentError,
  onPaymentReady,
}) => {
  const [cardNumber, setCardNumber] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cardNumberRef = useRef(null);
  const isInitialized = useRef(false);
  const dispatch = useDispatch();

  const initializeSquare = useCallback(async () => {
    // Prevent re-initialization
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = true;
    try {
      console.log("Initializing Square SDK...");
      console.log("Environment variables:", {
        appId: import.meta.env.VITE_SQUARE_APPLICATION_ID,
        locationId: import.meta.env.VITE_SQUARE_LOCATION_ID,
        environment: import.meta.env.VITE_SQUARE_ENVIRONMENT,
      });

      const squarePayments =
        await squarePaymentService.initializeSquarePayments();

      console.log("Square SDK initialized successfully", squarePayments);
      console.log("Available methods:", Object.keys(squarePayments));

      // Try the standard Square SDK API approach
      // Square SDK requires inline style objects, not CSS class names
      const cardComponent = await squarePayments.card({
        style: {
          input: {
            backgroundColor: "#f9fafb",
            color: "#111827",
            fontFamily: "inherit",
            fontSize: "14px",
            fontWeight: "normal",
          },
        },
      });

      console.log("Card component created:", cardComponent);

      console.log("Square payment components created");

      // Check if DOM elements exist - for now just use the card number container
      const cardContainer = document.getElementById("card-number-container");

      if (!cardContainer) {
        throw new Error("Payment form container not found");
      }

      // Attach the unified card component to the card number container
      await cardComponent.attach("#card-number-container");

      console.log("Square payment component attached successfully");

      // For now, set the card component to our state
      // We'll need to adjust this based on what Square SDK actually supports
      setCardNumber(cardComponent);

      // Pass the payment handler to parent
      if (onPaymentReady) {
        onPaymentReady(async (orderData) => {
          if (!cardComponent) {
            const msg = "Payment system not ready";
            onPaymentError(msg);
            throw new Error(msg);
          }

          setIsProcessing(true);

          try {
            // Tokenize the unified card component
            const result = await cardComponent.tokenize();

            if (result.status === "OK") {
              // Build payload using orderNumber when available; otherwise fallback to a temp orderId
              const amountToCharge = Number(
                orderData?.orderTotal ?? orderTotal
              );
              const rawOrderNumber = orderData?.orderNumber;
              const hasOrderNumber =
                rawOrderNumber != null && !Number.isNaN(Number(rawOrderNumber));

              const paymentData = {
                sourceId: result.token,
                amount: amountToCharge,
                ...(hasOrderNumber
                  ? { orderNumber: Number(rawOrderNumber) }
                  : { orderId: String(Date.now()) }),
                customerDetails: {
                  firstName: orderData?.firstName,
                  lastName: orderData?.lastName,
                  phone: orderData?.phone,
                },
              };

              // Dispatch Redux thunk instead of direct service call
              const resp = await dispatch(
                createSquarePayment(paymentData)
              ).unwrap();

              if (resp?.success) {
                onPaymentSuccess({
                  paymentId: resp.paymentId,
                  receiptNumber: resp.receiptNumber,
                  status: resp.status,
                  orderRef: resp.orderRef,
                  orderUpdate: resp.orderUpdate,
                });
              } else {
                onPaymentError("Payment failed");
                throw new Error("Payment failed");
              }
            } else {
              const msg =
                result.errors?.map((e) => e.message).join(", ") ||
                "Payment failed";
              onPaymentError(msg);
              throw new Error(msg);
            }
          } catch (error) {
            console.error("Payment error:", error);
            onPaymentError(
              error.response?.data?.details ||
                error.message ||
                "Payment processing failed"
            );
            throw error; // propagate to caller so it can soft-cancel
          } finally {
            setIsProcessing(false);
          }
        });
      }

      console.log("Square initialization complete");
    } catch (error) {
      console.error("Error initializing Square:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      // Provide more specific error messages
      let errorMessage = "Failed to initialize payment system";
      if (error.message.includes("Payment form containers not found")) {
        errorMessage = "Payment form containers not ready. Please try again.";
      } else if (error.message.includes("Square SDK")) {
        errorMessage = "Payment system unavailable. Please refresh the page.";
      } else if (
        error.message.includes("An unexpected error occurred") ||
        error.name === "UnexpectedError"
      ) {
        errorMessage =
          "⚠️ Square payment system needs configuration. Please contact support or use cash payment.";
      } else if (
        error.message.includes("Application ID") ||
        error.message.includes("Location ID")
      ) {
        errorMessage =
          "⚠️ Payment credentials invalid. Please use cash payment option.";
      } else {
        errorMessage = `Failed to initialize payment system: ${error.message}`;
      }

      onPaymentError(errorMessage);
      // Reset initialization flag on error so it can be retried
      isInitialized.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array intentionally to prevent infinite re-initialization

  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeSquare();
    }, 100);

    return () => clearTimeout(timer);
  }, [initializeSquare]);

  // Cleanup effect for card instances
  useEffect(() => {
    return () => {
      if (cardNumber) {
        cardNumber.destroy();
      }
    };
  }, [cardNumber]);

  return (
    <div className="square-payment-form max-w-sm mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
          💳 Card Payment
        </h3>

        {/* Square SDK will insert its complete card form here */}
        <div className="mb-4">
          <div
            id="card-number-container"
            ref={cardNumberRef}
            className="min-h-[100px]"
          >
            {/* Square unified card input will be inserted here */}
          </div>
        </div>

        {/* Total Amount Display */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-red-800 font-medium">Order Total:</span>
            <span className="text-xl font-bold text-red-900">
              ${Number(orderTotal).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Test Card Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800 font-medium mb-2">
            🧪 Sandbox Test Cards:
          </p>
          <div className="text-xs text-blue-700 space-y-1">
            <p>
              <strong>Visa:</strong> 4111 1111 1111 1111
            </p>
            <p>
              <strong>Expiry:</strong> Any future date (e.g., 12/25)
            </p>
            <p>
              <strong>CVV:</strong> Any 3 digits (e.g., 123)
            </p>
          </div>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
            <span className="text-yellow-800 text-sm font-medium">
              Processing payment...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SquarePayment;