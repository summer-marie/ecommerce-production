import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      console.log("cartSlice REDUCER addToCart", action.payload);
      state.items.push(action.payload);
    },
    removeFromCart: (state, action) => {
      console.log("cartSlice REDUCER removeFromCart", action.payload);
      state.items = state.items.filter(
        (item) => item.cartItemId !== action.payload
      );
    },
    clearCart: (state) => {
      console.log("cartSlice REDUCER clearCart");
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
