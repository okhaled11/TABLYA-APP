import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import PersonalRegisterChefReducer from "./features/PersonalRegisterChefSlice";
import authReducer from "./features/Auth/loginSlice";
import registerReducer from "./features/Auth/registerCustomerSlice";
import { registerChef } from "./features/Auth/registerChefSlice";
import { authApi } from "./features/Auth/authSlice";
import {cookersApprovalsApi} from "./features/Admin/cookerApprovalsApi";

import { cookersApi } from "./features/Customer/CookersApi";
import { dashboardApi } from "./features/Admin/dashboardApi";
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
import { UserSlice } from "./features/UserSlice";

import CartSlice from "./features/Customer/CartSlice";
import favoriteCookersReducer from "./features/Customer/favoriteCookersSlice";
import { favoritesApi } from "./features/Customer/favoritesApi";
import { adminAuthApi } from "./features/Admin/adminData";

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
    // [supabaseApi.reducerPath]: supabaseApi.reducer,
    [cookersApi.reducerPath]: cookersApi.reducer,
    [cookersApprovalsApi.reducerPath]: cookersApprovalsApi.reducer,    ///mariam api 
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [OrdersApiCustomerSlice.reducerPath]: OrdersApiCustomerSlice.reducer,
    [OrdersHistoryCustomerSlice.reducerPath]: OrdersHistoryCustomerSlice.reducer,
    [cookerApprovalsApi.reducerPath]: cookerApprovalsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,

    cart: persistedCart,
    favoriteCookers: favoriteCookersReducer,

    // APIs
    [authApi.reducerPath]: authApi.reducer,
    [registerChef.reducerPath]: registerChef.reducer,
    [UserSlice.reducerPath]:UserSlice.reducer,
    [cookersApi.reducerPath]: cookersApi.reducer,
    [aminCookersApi.reducerPath]: aminCookersApi.reducer,
    [cookerApprovalsApi.reducerPath]: cookerApprovalsApi.reducer,     //mariam api 
    [ordersApi.reducerPath]: ordersApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [passwordApi.reducerPath]: passwordApi.reducer,
    [personalInfoApi.reducerPath]: personalInfoApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [OrdersApiCustomerSlice.reducerPath]: OrdersApiCustomerSlice.reducer,
    [OrdersHistoryCustomerSlice.reducerPath]:
      OrdersHistoryCustomerSlice.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
    [adminAuthApi.reducerPath]:adminAuthApi.reducer,
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
      cookerApprovalsApi.middleware,    //mariam api
      dashboardApi.middleware,
      ordersApi.middleware,
      reportsApi.middleware,
      passwordApi.middleware,
      personalInfoApi.middleware,
      addressApi.middleware,
      OrdersApiCustomerSlice.middleware,
      OrdersHistoryCustomerSlice.middleware,
      cookersApprovalsApi.middleware,
      UserSlice.middleware,
      adminAuthApi.middleware,
      reviewsApi.middleware,
      favoritesApi.middleware
    ),
});

export const persistor = persistStore(store);
