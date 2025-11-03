// authApi.js
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUserData: builder.query({
      async queryFn() {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          return { error: error.message };
        }
        return { data: data.user.user_metadata };
      },
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserDataQuery } = authApi;
