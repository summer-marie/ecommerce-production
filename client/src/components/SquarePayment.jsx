import { useState, useEffect, useRef, useCallback } from 'react';
import squarePaymentService from '../redux/squarePaymentService';

const SquarePayment = ({ orderTotal, onPaymentSuccess, onPaymentError, onPaymentReady }) => {
  const [card, setCard] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cardContainerRef = useRef(null);

  const initializeSquare = useCallback(async () => {
    try {
      const squarePayments = await squarePaymentService.initializeSquarePayments();

      const cardPayment = await squarePayments.card();
      await cardPayment.attach('#card-container');
      setCard(cardPayment);
      
      // Pass the payment handler to parent
      if (onPaymentReady) {
        onPaymentReady(async (orderData) => {
          await handlePayment(orderData, cardPayment);
        });
      }
    } catch (error) {
      console.error('Error initializing Square:', error);
      onPaymentError('Failed to initialize payment system');
    }
  }, [onPaymentError, onPaymentReady]);

  const handlePayment = async (orderData, cardPayment = card) => {
    if (!cardPayment) {
      onPaymentError('Payment system not ready');
      return;
    }

    setIsProcessing(true);

    try {
      // Tokenize the payment method
      const result = await cardPayment.tokenize();
      
      if (result.status === 'OK') {
        // Send payment to backend
        const paymentData = {
          sourceId: result.token,
          amount: orderTotal,
          orderId: Date.now().toString(), // Temporary - you'll get real order ID
          customerDetails: {
            firstName: orderData.firstName,
            lastName: orderData.lastName
          }
        };

        const paymentResponse = await squarePaymentService.createPayment(paymentData);
        
        if (paymentResponse.data.success) {
          onPaymentSuccess({
            paymentId: paymentResponse.data.paymentId,
            receiptNumber: paymentResponse.data.receiptNumber,
            status: paymentResponse.data.status
          });
        } else {
          onPaymentError('Payment failed');
        }
      } else {
        onPaymentError(result.errors?.map(e => e.message).join(', ') || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError(error.response?.data?.details || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    initializeSquare();

    // Cleanup
    return () => {
      if (card) {
        card.destroy();
      }
    };
  }, [initializeSquare]);

  return (
    <div className="square-payment-form">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div 
          id="card-container" 
          ref={cardContainerRef}
          className="border border-gray-300 rounded-md p-3 min-h-[60px]"
        >
          {/* Square card input will be inserted here */}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        <p>💳 Test cards for sandbox:</p>
        <p>• Visa: 4111 1111 1111 1111</p>
        <p>• Any future expiry date and CVV</p>
      </div>

      <div className="text-lg font-semibold mb-4">
        Total: ${Number(orderTotal).toFixed(2)}
      </div>

      {isProcessing && (
        <div className="text-blue-600 mb-2">Processing payment...</div>
      )}
    </div>
  );
};

  return (
    <div className="square-payment-form">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div 
          id="card-container" 
          ref={cardContainerRef}
          className="border border-gray-300 rounded-md p-3 min-h-[60px]"
        >
          {/* Square card input will be inserted here */}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        <p>💳 Test cards for sandbox:</p>
        <p>• Visa: 4111 1111 1111 1111</p>
        <p>• Any future expiry date and CVV</p>
      </div>

      <div className="text-lg font-semibold mb-4">
        Total: ${Number(orderTotal).toFixed(2)}
      </div>

      {isProcessing && (
        <div className="text-blue-600 mb-2">Processing payment...</div>
      )}
    </div>
  );
};

export default SquarePayment;
