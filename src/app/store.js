import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import PersonalRegisterChefReducer from "./features/PersonalRegisterChefSlice";
import authReducer from "./features/Auth/loginSlice";
import registerReducer from "./features/Auth/registerCustomerSlice";
import { registerChef } from "./features/Auth/registerChefSlice";
import { authApi } from "./features/Auth/authSlice";
import { cookersApprovalsApi } from "./features/Admin/cookerApprovalsApi";

import { cookersApi } from "./features/Customer/CookersApi";
import { dashboardApi } from "./features/Admin/dashboardApi";
import { cookersApi as aminCookersApi } from "./features/Admin/cookerSlice";
import { cookerApprovalsApi } from "./features/Admin/cookerApprovals";
import { ordersApi as adminOrdersApi } from "./features/Admin/ordersApi";
import { ordersApi as customerOrdersApi } from "./features/Customer/ordersSlice";
import { reportsApi as adminReportsApi } from "./features/Admin/reportsApi";
import { AdminUserSlice } from "./features/Admin/adminUserManagemnetSlice";
import { adminReportActionsApi } from "./features/Admin/adminReportActionsApi";

import { passwordApi } from "./features/Customer/passwordSlice";
import { personalInfoApi } from "./features/Customer/personalInfoSlice";
import { addressApi } from "./features/Customer/addressSlice";
import { OrdersHistoryCustomerSlice } from "./features/Customer/Orders/OrdersHistoryCustomerSlice";
import { OrdersApiCustomerSlice } from "./features/Customer/Orders/ordersApiCustomerSlice";
import { ReportsApiSlice } from "./features/Customer/Reports/reportsApiSlice";
import { reviewsApi } from "./features/Customer/reviewsApi";
import { UserSlice } from "./features/UserSlice";
import { CookerAcceptOrder } from "./features/Cooker/CookerAcceptOrder";
import { CookerMenuApi } from "./features/cooker/CookerMenuApi";
import { CookerAnalyticsApi } from "./features/Cooker/CookerAnalytics";

import CartSlice from "./features/Customer/CartSlice";
import favoriteCookersReducer from "./features/Customer/favoriteCookersSlice";
import { favoritesApi } from "./features/Customer/favoritesApi";
import { adminAuthApi } from "./features/Admin/adminData";

import { MariamSettingsApi } from "./features/Admin/MariamSettings";
import { deliveryApi } from "./features/delivery/deliveryApi";

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

    // Customer APIs

    [cookersApi.reducerPath]: cookersApi.reducer,
    [OrdersApiCustomerSlice.reducerPath]: OrdersApiCustomerSlice.reducer,
    [OrdersHistoryCustomerSlice.reducerPath]:
      OrdersHistoryCustomerSlice.reducer,
    [ReportsApiSlice.reducerPath]: ReportsApiSlice.reducer,
    [customerOrdersApi.reducerPath]: customerOrdersApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
    [passwordApi.reducerPath]: passwordApi.reducer,
    [personalInfoApi.reducerPath]: personalInfoApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    cart: persistedCart,
    favoriteCookers: favoriteCookersReducer,

    // Admin APIs
    [cookersApprovalsApi.reducerPath]: cookersApprovalsApi.reducer,
    [aminCookersApi.reducerPath]: aminCookersApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [cookerApprovalsApi.reducerPath]: cookerApprovalsApi.reducer,
    [adminOrdersApi.reducerPath]: adminOrdersApi.reducer,
    [adminReportsApi.reducerPath]: adminReportsApi.reducer,
    [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    [AdminUserSlice.reducerPath]: AdminUserSlice.reducer,
    [MariamSettingsApi.reducerPath]: MariamSettingsApi.reducer,
    [adminReportActionsApi.reducerPath]: adminReportActionsApi.reducer,

    // Auth & User
    [authApi.reducerPath]: authApi.reducer,
    [registerChef.reducerPath]: registerChef.reducer,
    [UserSlice.reducerPath]: UserSlice.reducer,

    // Cooker APIs
    [CookerAcceptOrder.reducerPath]: CookerAcceptOrder.reducer,
    [CookerMenuApi.reducerPath]: CookerMenuApi.reducer,
    [CookerAnalyticsApi.reducerPath]: CookerAnalyticsApi.reducer,

    // Delivery APIs
    [deliveryApi.reducerPath]: deliveryApi.reducer,
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
      dashboardApi.middleware,
      adminOrdersApi.middleware,
      customerOrdersApi.middleware,
      adminReportsApi.middleware,
      passwordApi.middleware,
      personalInfoApi.middleware,
      addressApi.middleware,
      OrdersApiCustomerSlice.middleware,
      OrdersHistoryCustomerSlice.middleware,
      ReportsApiSlice.middleware,
      cookersApprovalsApi.middleware,
      UserSlice.middleware,
      adminAuthApi.middleware,
      reviewsApi.middleware,
      favoritesApi.middleware,
      AdminUserSlice.middleware,
      CookerAcceptOrder.middleware,
      CookerMenuApi.middleware,
      CookerAnalyticsApi.middleware,
      MariamSettingsApi.middleware,
      adminReportActionsApi.middleware,
      deliveryApi.middleware
    ),
});

export const persistor = persistStore(store);
