import axios from "axios";

const paymentService = {
  createSquarePayment: async (paymentData) => {
    try {
      const url = `${import.meta.env.VITE_API_SERVER_URL}/payments/square/create-payment`;
      if (import.meta.env.DEV) {
        console.log('[Square] create payment request', { url, paymentData });
      }
      const res = await axios.post(url, paymentData);
      if (import.meta.env.DEV) {
        console.log('[Square] create payment response', res.data);
      }
      return res;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('[Square] create payment error', err?.response?.data || err.message);
      }
      throw err;
    }
  },
  getSquarePaymentStatus: async (paymentId) => {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/payments/square/payments/${paymentId}`;
    const res = await axios.get(url);
    return res;
  },
  testSquareConnection: async () => {
    const url = `${import.meta.env.VITE_API_SERVER_URL}/payments/square/test`;
    return await axios.get(url);
  },
};

export default paymentService;
