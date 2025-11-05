import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const cookersApi = createApi({
  reducerPath: "cookersApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Cookers"],
  endpoints: (builder) => ({
    // Get top 6 approved cookers
    getTopCookers: builder.query({
      async queryFn() {
        const { data, error } = await supabase
          .from("cookers")
          .select("*, users(name, avatar_url)")
          .eq("is_approved", true)
          .order("avg_rating", { ascending: false })
          .limit(6);

        if (error) return { error };
        return { data };
      },
      providesTags: ["Cookers"],
    }),

    // Get all approved cookers
    getAllCookers: builder.query({
      async queryFn() {
        const { data, error } = await supabase
          .from("cookers")
          .select("*, users(name, avatar_url)")
          .eq("is_approved", true)
          .order("avg_rating", { ascending: false });

        if (error) return { error };
        return { data };
      },
      providesTags: ["Cookers"],
    }),

    // Get single cooker details
    getCookerById: builder.query({
      async queryFn(id) {
        const { data, error } = await supabase
          .from("cookers")
          .select("*, users(name, avatar_url, email, phone)")
          .eq("user_id", id)
          .single();

        if (error) return { error };
        return { data };
      },
      providesTags: ["Cookers"],
    }),
  }),
});

export const {
  useGetTopCookersQuery,
  useGetAllCookersQuery,
  useGetCookerByIdQuery,
} = cookersApi;
