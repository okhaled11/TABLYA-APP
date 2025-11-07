import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import PersonalRegisterChefReducer from "./features/PersonalRegisterChefSlice";
import authReducer from "./features/Auth/loginSlice";
import registerReducer from "./features/Auth/registerCustomerSlice";
import { registerChef } from "./features/Auth/registerChefSlice";
import { authApi } from "./features/Auth/authSlice";

import { supabaseApi } from "./features/MenuSlices";
import { cookersApi } from "./features/Customer/CookersApi";
import { cookersApi as aminCookersApi } from "./features/Admin/cookerSlice";
import { cookerApprovalsApi } from "./features/Admin/cookerApprovals";
import { ordersApi } from "./features/Admin/ordersApi";
import { reportsApi } from "./features/Admin/reportsApi";

import { passwordApi } from "./features/Customer/passwordSlice";
import { personalInfoApi } from "./features/Customer/personalInfoSlice";
import { addressApi } from "./features/Customer/addressSlice";
import { OrdersHistoryCustomerSlice } from "./features/Customer/Orders/OrdersHistoryCustomerSlice";
import { OrdersApiCustomerSlice } from "./features/Customer/Orders/ordersApiCustomerSlice";
import { reviewsApi } from "./features/Customer/reviewsApi";

import CartSlice from "./features/Customer/CartSlice";

const persistCartConfig = {
  key: "cart",
  storage,
};

const persistedCart = persistReducer(persistCartConfig, CartSlice);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    register: registerReducer,
    PersonalRegisterChef: PersonalRegisterChefReducer,

    cart: persistedCart,

    // APIs
    [authApi.reducerPath]: authApi.reducer,
    [registerChef.reducerPath]: registerChef.reducer,
    [supabaseApi.reducerPath]: supabaseApi.reducer,
    [cookersApi.reducerPath]: cookersApi.reducer,
    [aminCookersApi.reducerPath]: aminCookersApi.reducer,
    [cookerApprovalsApi.reducerPath]: cookerApprovalsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [passwordApi.reducerPath]: passwordApi.reducer,
    [personalInfoApi.reducerPath]: personalInfoApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [OrdersApiCustomerSlice.reducerPath]: OrdersApiCustomerSlice.reducer,
    [OrdersHistoryCustomerSlice.reducerPath]: OrdersHistoryCustomerSlice.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      registerChef.middleware,
      supabaseApi.middleware,
      cookersApi.middleware,
      aminCookersApi.middleware,
      cookerApprovalsApi.middleware,
      ordersApi.middleware,
      reportsApi.middleware,
      passwordApi.middleware,
      personalInfoApi.middleware,
      addressApi.middleware,
      OrdersApiCustomerSlice.middleware,
      OrdersHistoryCustomerSlice.middleware,
      reviewsApi.middleware
    ),
});

export const persistor = persistStore(store);
