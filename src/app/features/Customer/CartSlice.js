import { createSlice } from "@reduxjs/toolkit";
import { addItemToShoppingCart } from "../../../utils";
import { toaster } from "../../../components/ui/toaster";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cartItems = addItemToShoppingCart(
        action.payload,
        state.cartItems
      );
    },
    removeItemFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
      toaster.create({
        title: "Removed from your cart",
        description: `This item is removed from cart.`,
        type: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    },
    clearCart: (state) => {
      state.cartItems = [];
      toaster.create({
        title: "Cart Cleared Successfully",
        description: `Your Cart is empty now.`,
        type: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    },
  },
});

export const { addToCart, removeItemFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
