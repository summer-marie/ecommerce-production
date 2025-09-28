import { createSlice } from "@reduxjs/toolkit";
import { logger } from "../utils/logger";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      logger.debug("cartSlice addToCart", action.payload);
      state.items.push(action.payload);
    },
    removeFromCart: (state, action) => {
      logger.debug("cartSlice removeFromCart", action.payload);
      state.items = state.items.filter(
        (item) => item.cartItemId !== action.payload
      );
    },
    clearCart: (state) => {
      logger.debug("cartSlice clearCart");
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
