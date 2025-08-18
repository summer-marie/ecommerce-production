import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { createSquarePayment } from "../redux/paymentSlice";
import squarePaymentService from "../redux/squarePaymentService";

const SquarePayment = ({
  orderTotal,
  onPaymentSuccess,
  onPaymentError,
  onPaymentReady,
  onWalletSupport, // callback({ googlePaySupported: boolean })
  paymentInstrument = 'card', // 'card' | 'googlePay'
}) => {
  const [cardNumber, setCardNumber] = useState(null);
  const [googlePayInstance, setGooglePayInstance] = useState(null);
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

      // Build a payment request for Google Pay (and potentially other wallets)
      const amountString = Number(orderTotal).toFixed(2);
      let paymentRequest = null;
      try {
        paymentRequest = squarePayments.paymentRequest({
          countryCode: 'US',
            // If you later support multi-currency pull this dynamically
          currencyCode: 'USD',
          total: {
            amount: amountString,
            label: 'Total',
          },
          requestBillingContact: false,
          requestShippingContact: false,
        });
      } catch (e) {
        console.warn('Unable to create paymentRequest (non-fatal)', e);
      }

      // Card component styles
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

  // Initialize & attach Google Pay if supported
      if (paymentRequest) {
        try {
          const gpay = await squarePayments.googlePay(paymentRequest);
          const supported = await gpay.isSupported();
          if (supported) {
            await gpay.attach('#google-pay-button');
            setGooglePayInstance(gpay);
    if (onWalletSupport) onWalletSupport({ googlePaySupported: true });
          } else {
            console.log('Google Pay not supported in this browser/device');
    if (onWalletSupport) onWalletSupport({ googlePaySupported: false });
          }
        } catch (e) {
          console.warn('Google Pay init failed (continuing with card only)', e);
      if (onWalletSupport) onWalletSupport({ googlePaySupported: false });
        }
      }

      console.log("Square payment component attached successfully");

      // For now, set the card component to our state
      // We'll need to adjust this based on what Square SDK actually supports
      setCardNumber(cardComponent);

      // Pass the payment handler to parent
      // Create initial handler (will be updated by later effect when instrument changes)
      if (onPaymentReady) {
        onPaymentReady(async (orderData) => {
          // This initial handler may reference initial instrument; a later effect will replace it
          const useGooglePay = paymentInstrument === 'googlePay';
          return executePayment({
            useGooglePay,
            orderData,
            cardComponent,
            googlePayInst: googlePayInstance,
          });
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
  }, []); // keep empty to initialize only once

  // Unified payment executor
  const executePayment = useCallback(async ({ useGooglePay, orderData, cardComponent = cardNumber, googlePayInst = googlePayInstance }) => {
    if (useGooglePay && !googlePayInst) {
      const msg = 'Google Pay not available';
      onPaymentError(msg);
      throw new Error(msg);
    }
    if (!useGooglePay && !cardComponent) {
      const msg = 'Card component not ready';
      onPaymentError(msg);
      throw new Error(msg);
    }
    setIsProcessing(true);
    try {
      const result = await (useGooglePay ? googlePayInst.tokenize() : cardComponent.tokenize());
      if (result.status === 'OK') {
        const amountToCharge = Number(orderData?.orderTotal ?? orderTotal);
        const rawOrderNumber = orderData?.orderNumber;
        const hasOrderNumber = rawOrderNumber != null && !Number.isNaN(Number(rawOrderNumber));
        const paymentData = {
          sourceId: result.token,
            amount: amountToCharge,
            ...(hasOrderNumber ? { orderNumber: Number(rawOrderNumber) } : { orderId: String(Date.now()) }),
            customerDetails: {
              firstName: orderData?.firstName,
              lastName: orderData?.lastName,
              phone: orderData?.phone,
            },
            wallet: useGooglePay ? 'googlePay' : 'card',
          };
          if (import.meta.env.DEV) console.log('[Square] Dispatching createSquarePayment', paymentData);
          const resp = await dispatch(createSquarePayment(paymentData)).unwrap();
          if (resp?.success) {
            onPaymentSuccess({
              paymentId: resp.paymentId,
              receiptNumber: resp.receiptNumber,
              status: resp.status,
              orderRef: resp.orderRef,
              orderUpdate: resp.orderUpdate,
            });
          } else {
            onPaymentError('Payment failed');
            throw new Error('Payment failed');
          }
      } else {
        const msg = result.errors?.map(e => e.message).join(', ') || 'Payment failed';
        onPaymentError(msg);
        throw new Error(msg);
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError(error.response?.data?.details || error.response?.data?.error || error.message || 'Payment processing failed');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [cardNumber, googlePayInstance, onPaymentError, onPaymentSuccess, orderTotal, dispatch]);

  // Update handler when instrument changes or components become available
  useEffect(() => {
    if (!cardNumber && !googlePayInstance) return;
    if (!onPaymentReady) return;
    onPaymentReady(async (orderData) => {
      const useGooglePay = paymentInstrument === 'googlePay';
      return executePayment({ useGooglePay, orderData });
    });
  }, [paymentInstrument, cardNumber, googlePayInstance, onPaymentReady, executePayment]);

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
          {paymentInstrument === 'googlePay' ? 'Google Pay' : 'Card Payment'}
        </h3>

        {/* Google Pay Button Container (shown when selected & supported) */}
        <div className={`${paymentInstrument === 'googlePay' ? 'block' : 'hidden'} mb-4 flex justify-center`}>
          <div id="google-pay-button" className="w-full" />
        </div>

        {/* Card form (always rendered for SDK attach, hidden when using GPay) */}
        <div className={`${paymentInstrument === 'card' ? 'block' : 'hidden'} mb-4`}>
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