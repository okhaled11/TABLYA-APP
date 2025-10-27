import { configureStore } from "@reduxjs/toolkit";
// import CartSlice from "./CartSlice";
// import { Posts } from "./PostsSlice";
export const store = configureStore({
    reducer: {
        // CartSlice: persistedReducer,
        // [Posts.reducerPath]: Posts.reducer,
    },

    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: false,
    //     }).concat([Posts.middleware]),
});

export default store;
