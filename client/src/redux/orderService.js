import axios from "axios";
import { API_BASE } from "../utils/apiBase.js";

const orderService = {
  // Create a new Order (without payment processing)
  // Use for: cash orders, admin-created orders, or unpaid orders
  createOrder: async (order) => {
    return await axios.post(
  `${API_BASE}/orders`,
      order
    );
  },

  // Create order with Square payment processing
  // Use for: customer checkout with Square payment
  createOrderWithPayment: async (orderData, paymentToken) => {
    return await axios.post(
  `${API_BASE}/orders/with-payment`,
      {
        ...orderData,
        paymentToken
      }
    );
  },

  // Soft-cancel an order by orderNumber (payment failed)
  markPaymentFailedByOrderNumber: async (orderNumber, reason) => {
    return await axios.patch(
  `${API_BASE}/orders/by-number/${orderNumber}/payment-failed`,
      { reason }
    );
  },

  // Get all orders
  orderGetAll: async () => {
  return await axios.get(`${API_BASE}/orders`);
  },

  // Get only open orders
  orderGetOpen: async () => {
    return await axios.get(
  `${API_BASE}/orders/open`
    );
  },

  // Get only archived orders
  orderGetArchived: async () => {
    return await axios.get(
  `${API_BASE}/orders/archived`
    );
  },

  // Update order status
  orderUpdateStatus: async (order) => {
    const { id, status } = order;
    return await axios.put(
  `${API_BASE}/orders/open/${id}`,
      { status: status }
    );
  },

  // Archive order
  orderArchiveOne: async (id) => {
    return await axios.put(
  `${API_BASE}/orders/archive/${id}`,
      { isArchived: true }
    );
  },

};

export default orderService;