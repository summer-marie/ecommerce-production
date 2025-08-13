import axios from "axios";

const paymentService = {
  createSquarePayment: async (paymentData) => {
    return await axios.post(
      `${import.meta.env.VITE_API_SERVER_URL}/payments/square/create-payment`,
      paymentData
    );
  },
  getSquarePaymentStatus: async (paymentId) => {
    return await axios.get(
      `${
        import.meta.env.VITE_API_SERVER_URL
      }/payments/square/payments/${paymentId}`
    );
  },
  testSquareConnection: async () => {
    return await axios.get(
      `${import.meta.env.VITE_API_SERVER_URL}/payments/square/test`
    );
  },
};

export default paymentService;
