// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     productCart: [],
// };

// export const CartSlice = createSlice({
//     name: "CartSlice",
//     initialState,
//     reducers: {
//         AddToCart: (state, action) => {
//             state.productCart = [...state.productCart, action.payload];
//             //or
//             // state.productCart = checkCartProduct(action.payload,state.productCart);
//             /* toast cart is removed added */
//         },
//         RemoveCart: (state, action) => {
//             state.productCart = state.productCart.filter(
//                 (el) => el.id !== action.payload
//             );
//             /* toast cart is removed succesfully */
//         },
//         clearAll: (state) => {
//             state.productCart = [];
//             /* toast cart is empty */
//         },
//     },
// });

// export const { AddToCart, RemoveCart } = CartSlice.actions;

// export default CartSlice.reducer;
