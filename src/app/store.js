import { configureStore } from "@reduxjs/toolkit";
import PersonalRegisterChefReducer from "./features/PersonalRegisterChefSlice";
import { supabaseApi } from "./features/MenuSlices";
// import CartSlice from "./CartSlice";
// import { Posts } from "./PostsSlice";
import authReducer from "./features/Auth/loginSlice";
import registerReducer from "./features/Auth/registerCustomerSlice";
import { registerChef } from "./features/Auth/registerChefSlice";
import { authApi } from "./features/Auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    register: registerReducer,
    [authApi.reducerPath]: authApi.reducer,
    [registerChef.reducerPath]: registerChef.reducer,
    // CartSlice: persistedReducer,
    // [Posts.reducerPath]: Posts.reducer,
    PersonalRegisterChef: PersonalRegisterChefReducer,
    [supabaseApi.reducerPath]: supabaseApi.reducer,
  },

  // middleware: (getDefaultMiddleware) =>
  //     getDefaultMiddleware({
  //         serializableCheck: false,
  //     }).concat([Posts.middleware]),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      supabaseApi.middleware,
      registerChef.middleware,
      authApi.middleware
    ),
});

export default store;
