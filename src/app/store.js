import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import PersonalRegisterChefReducer from "./features/PersonalRegisterChefSlice";
import authReducer from "./features/Auth/loginSlice";
import registerReducer from "./features/Auth/registerCustomerSlice";
import { registerChef } from "./features/Auth/registerChefSlice";
import { authApi } from "./features/Auth/authSlice";

import { cookersApi } from "./features/Customer/CookersApi";
import { cookersApi as aminCookersApi } from "./features/Admin/cookerSlice";
import { cookerApprovalsApi } from "./features/Admin/cookerApprovals";
import { ordersApi as adminOrdersApi } from "./features/Admin/ordersApi";
import { ordersApi as customerOrdersApi } from "./features/Customer/ordersSlice";
import { reportsApi } from "./features/Admin/reportsApi";

import { passwordApi } from "./features/Customer/passwordSlice";
import { personalInfoApi } from "./features/Customer/personalInfoSlice";
import { addressApi } from "./features/Customer/addressSlice";
import { OrdersHistoryCustomerSlice } from "./features/Customer/Orders/OrdersHistoryCustomerSlice";
import { OrdersApiCustomerSlice } from "./features/Customer/Orders/ordersApiCustomerSlice";
import { reviewsApi } from "./features/Customer/reviewsApi";

import CartSlice from "./features/Customer/CartSlice";
import favoriteCookersReducer from "./features/Customer/favoriteCookersSlice";
import { favoritesApi } from "./features/Customer/favoritesApi";

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
    favoriteCookers: favoriteCookersReducer,

    // APIs
    [authApi.reducerPath]: authApi.reducer,
    [registerChef.reducerPath]: registerChef.reducer,

    [cookersApi.reducerPath]: cookersApi.reducer,
    [aminCookersApi.reducerPath]: aminCookersApi.reducer,
    [cookerApprovalsApi.reducerPath]: cookerApprovalsApi.reducer,
    [adminOrdersApi.reducerPath]: adminOrdersApi.reducer,
    [customerOrdersApi.reducerPath]: customerOrdersApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [passwordApi.reducerPath]: passwordApi.reducer,
    [personalInfoApi.reducerPath]: personalInfoApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [OrdersApiCustomerSlice.reducerPath]: OrdersApiCustomerSlice.reducer,
    [OrdersHistoryCustomerSlice.reducerPath]:
      OrdersHistoryCustomerSlice.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["register"],
      },
    }).concat(
      authApi.middleware,
      registerChef.middleware,
      cookersApi.middleware,
      aminCookersApi.middleware,
      cookerApprovalsApi.middleware,
      adminOrdersApi.middleware,
      customerOrdersApi.middleware,
      reportsApi.middleware,
      passwordApi.middleware,
      personalInfoApi.middleware,
      addressApi.middleware,
      OrdersApiCustomerSlice.middleware,
      OrdersHistoryCustomerSlice.middleware,
      reviewsApi.middleware,
      favoritesApi.middleware
    ),
});

export const persistor = persistStore(store);
