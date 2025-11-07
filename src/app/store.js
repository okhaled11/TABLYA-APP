import { configureStore } from "@reduxjs/toolkit";
import PersonalRegisterChefReducer from "./features/PersonalRegisterChefSlice";
import { supabaseApi } from "./features/MenuSlices";
import authReducer from "./features/Auth/loginSlice";
import registerReducer from "./features/Auth/registerCustomerSlice";
import { registerChef } from "./features/Auth/registerChefSlice";
import { authApi } from "./features/Auth/authSlice";
import {cookerApprovalsApi} from "./features/Admin/cookerApprovalsApi";
import { cookersApi } from "./features/Customer/CookersApi";
import { dashboardApi } from "./features/Admin/dashboardApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    register: registerReducer,
    [authApi.reducerPath]: authApi.reducer,
    [registerChef.reducerPath]: registerChef.reducer,
    PersonalRegisterChef: PersonalRegisterChefReducer,
    [supabaseApi.reducerPath]: supabaseApi.reducer,
    [cookersApi.reducerPath]: cookersApi.reducer,
    [cookerApprovalsApi.reducerPath]: cookerApprovalsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      supabaseApi.middleware,
      registerChef.middleware,
      authApi.middleware,
      cookersApi.middleware,
      cookerApprovalsApi.middleware,
      dashboardApi.middleware
    ),
});

export default store;
