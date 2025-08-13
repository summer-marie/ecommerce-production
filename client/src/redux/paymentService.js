import axios from "axios";

const base = import.meta.env.VITE_API_SERVER_URL;

const paymentService = {
  createSquarePayment: async (paymentData) => {
    return await axios.post(`${base}/payments/square/create-payment`, paymentData);
  },
  getSquarePaymentStatus: async (paymentId) => {
    return await axios.get(`${base}/payments/square/payments/${paymentId}`);
  },
  testSquareConnection: async () => {
    return await axios.get(`${base}/payments/square/test`);
  },
};

export default paymentService;
