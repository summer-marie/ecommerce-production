import axios from "axios";

const orderService = {
  // Create a new Order (without payment processing)
  // Use for: cash orders, admin-created orders, or unpaid orders
  createOrder: async (order) => {
    return await axios.post(
      `${import.meta.env.VITE_API_SERVER_URL}/orders`,
      order
    );
  },

  // Create order with Square payment processing
  // Use for: customer checkout with Square payment
  createOrderWithPayment: async (orderData, paymentToken) => {
    return await axios.post(
      `${import.meta.env.VITE_API_SERVER_URL}/orders/with-payment`,
      {
        ...orderData,
        paymentToken
      }
    );
  },

  // Soft-cancel an order by orderNumber (payment failed)
  markPaymentFailedByOrderNumber: async (orderNumber, reason) => {
    return await axios.patch(
      `${import.meta.env.VITE_API_SERVER_URL}/orders/by-number/${orderNumber}/payment-failed`,
      { reason }
    );
  },

  // Get all orders
  orderGetAll: async () => {
    return await axios.get(`${import.meta.env.VITE_API_SERVER_URL}/orders`);
  },

  // Get only open orders
  orderGetOpen: async () => {
    return await axios.get(
      `${import.meta.env.VITE_API_SERVER_URL}/orders/open`
    );
  },

  // Get only archived orders
  orderGetArchived: async () => {
    return await axios.get(
      `${import.meta.env.VITE_API_SERVER_URL}/orders/archived`
    );
  },

  // Update order status
  orderUpdateStatus: async (order) => {
    const { id, status } = order;
    return await axios.put(
      `${import.meta.env.VITE_API_SERVER_URL}/orders/open/${id}`,
      { status: status }
    );
  },

  // Archive order
  orderArchiveOne: async (id) => {
    return await axios.put(
      `${import.meta.env.VITE_API_SERVER_URL}/orders/archive/${id}`,
      { isArchived: true }
    );
  },

};

export default orderService;
