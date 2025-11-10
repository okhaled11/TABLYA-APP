import { supabase } from "../../../services/supabaseClient";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

// get admin id for approved by in chef table   (query is ok but supabase has something wrong with constrains )
export const adminAuthApi = createApi({
  reducerPath: "adminauthApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User"],

  endpoints: (builder) => ({
    getAdminId: builder.query({
      async queryFn() {
        const { data, error } = await supabase.auth.getUser();
        if (error) return { error: error.message };
        
       
        return { data: data.user.id };
      },
      providesTags: ["User"],
    }),
  }),
});

export const { useGetAdminIdQuery } = adminAuthApi;









