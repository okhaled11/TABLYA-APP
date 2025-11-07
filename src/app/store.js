import { configureStore } from "@reduxjs/toolkit";
import PersonalRegisterChefReducer from "./features/PersonalRegisterChefSlice";
import { supabaseApi } from "./features/MenuSlices";
import authReducer from "./features/Auth/loginSlice";
import registerReducer from "./features/Auth/registerCustomerSlice";
import { registerChef } from "./features/Auth/registerChefSlice";
import { authApi } from "./features/Auth/authSlice";
import { passwordApi } from "./features/Customer/passwordSlice";
import { personalInfoApi } from "./features/Customer/personalInfoSlice";
import { addressApi } from "./features/Customer/addressSlice";
import { cookersApi } from "./features/Customer/CookersApi";
import { cookersApi as aminCookersApi } from "./features/Admin/cookerSlice";
import { cookerApprovalsApi } from "./features/Admin/cookerApprovals";
import { ordersApi } from "./features/Admin/ordersApi";
import { OrdersHistoryCustomerSlice } from "./features/Customer/Orders/OrdersHistoryCustomerSlice";
import { OrdersApiCustomerSlice } from "./features/Customer/Orders/ordersApiCustomerSlice";

import CartSlice from "./features/Customer/CartSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { reviewsApi } from "./features/Customer/reviewsApi";

const persistCartConfig = {
  key: "cart",
  storage,
};

const persistedCart = persistReducer(persistCartConfig, CartSlice);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    register: registerReducer,
    [authApi.reducerPath]: authApi.reducer,
    [registerChef.reducerPath]: registerChef.reducer,
    [passwordApi.reducerPath]: passwordApi.reducer,
    [personalInfoApi.reducerPath]: personalInfoApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    PersonalRegisterChef: PersonalRegisterChefReducer,
    [supabaseApi.reducerPath]: supabaseApi.reducer,
    [cookersApi.reducerPath]: cookersApi.reducer,
    [OrdersApiCustomerSlice.reducerPath]: OrdersApiCustomerSlice.reducer,
    [OrdersHistoryCustomerSlice.reducerPath]: OrdersHistoryCustomerSlice.reducer,
    [cookerApprovalsApi.reducerPath]: cookerApprovalsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,

    cart: persistedCart,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      supabaseApi.middleware,
      registerChef.middleware,
      authApi.middleware,
      passwordApi.middleware,
      personalInfoApi.middleware,
      addressApi.middleware,
      cookersApi.middleware,
      cookerApprovalsApi.middleware,
      ordersApi.middleware,
      aminCookersApi.middleware,
      OrdersApiCustomerSlice.middleware,
      OrdersHistoryCustomerSlice.middleware,
    
      reviewsApi.middleware,
    ),
});

export const persistor = persistStore(store);
