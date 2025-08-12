import axios from "axios";

const squarePaymentService = {
  // Initialize Square Web Payments
  initializeSquarePayments: () => {
    if (!window.Square) {
      throw new Error('Square SDK not loaded');
    }
    
    return window.Square.payments(
      import.meta.env.VITE_SQUARE_APPLICATION_ID,
      import.meta.env.VITE_SQUARE_LOCATION_ID
    );
  },

  // Create payment with Square
  createPayment: async (paymentData) => {
    return await axios.post(
      `${import.meta.env.VITE_API_SERVER_URL}/payments/square/create-payment`,
      paymentData
    );
  },

  // Get payment status
  getPaymentStatus: async (paymentId) => {
    return await axios.get(
      `${import.meta.env.VITE_API_SERVER_URL}/payments/square/payment/${paymentId}`
    );
  },

  // Test Square connection
  testConnection: async () => {
    return await axios.get(
      `${import.meta.env.VITE_API_SERVER_URL}/payments/square/test`
    );
  }
};

export default squarePaymentService;
