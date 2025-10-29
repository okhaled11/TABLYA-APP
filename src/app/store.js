import { configureStore } from "@reduxjs/toolkit";
import PersonalRegisterChefReducer from "./features/PersonalRegisterChefSlice";
import { supabaseApi } from "./features/MenuSlices";
// import CartSlice from "./CartSlice";
// import { Posts } from "./PostsSlice";
import authReducer from "./features/Auth/loginSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
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
    getDefaultMiddleware().concat(supabaseApi.middleware),
});

export default store;
