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
        // Return full user object with id and user_metadata merged
        return { 
          data: {
            id: data.user.id,
            email: data.user.email,
            ...data.user.user_metadata
          }
        };
      },
      providesTags: ["User"],
    }),
    updateUserData: builder.mutation({
      async queryFn(updates) {
        const { data, error } = await supabase.auth.updateUser({
          data: updates,
        });
        if (error) {
          return { error: error.message };
        }
        return { data: data?.user?.user_metadata };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUserDataQuery, useUpdateUserDataMutation } = authApi;
