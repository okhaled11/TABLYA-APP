import { createSlice } from "@reduxjs/toolkit";
import { addItemToShoppingCart } from "../../../utils";
import { toaster } from "../../../components/ui/toaster";

const initialState = {
  cartItems: [],
  cookerId: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cartItems = addItemToShoppingCart(action.payload, state.cartItems);
      if (!state.cookerId && state.cartItems.length > 0) {
        state.cookerId = action.payload.cooker_id;
      }
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
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.cartItems.findIndex((item) => item.id === id);

      if (itemIndex >= 0) {
        // Create a new array with the updated item
        state.cartItems = state.cartItems.map((item, index) =>
          index === itemIndex
            ? { ...item, quantity: Math.max(1, quantity) } // Ensure quantity is at least 1
            : item
        );
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.cookerId = null;
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

export const { addToCart, removeItemFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
