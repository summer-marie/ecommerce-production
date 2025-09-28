import axios from "axios";
import { API_BASE } from "../utils/apiBase.js";
import { logger } from "../utils/logger";

const paymentService = {
  createSquarePayment: async (paymentData) => {
    try {
      const url = `${API_BASE}/payments/square/create-payment`;
      if (import.meta.env.DEV) {
        logger.info("[Square] create payment request", { url });
      }
      const res = await axios.post(url, paymentData);
      if (import.meta.env.DEV) {
        logger.debug("[Square] create payment response", res.data);
      }
      return res;
    } catch (err) {
      if (import.meta.env.DEV) {
        logger.error(
          "[Square] create payment error",
          err?.response?.data || err.message
        );
      }
      throw err;
    }
  },
  getSquarePaymentStatus: async (paymentId) => {
    const url = `${API_BASE}/payments/square/payments/${paymentId}`;
    const res = await axios.get(url);
    return res;
  },
  testSquareConnection: async () => {
    const url = `${API_BASE}/payments/square/test`;
    return await axios.get(url);
  },
};

export default paymentService;
