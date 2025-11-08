import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const cookersApi = createApi({
  reducerPath: "adminCookersApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Cooker"],
  endpoints: (builder) => ({
    getCookers: builder.query({
      async queryFn() {
        const { data, error } = await supabase
          .from("cookers")
          .select("*, users(name, email, phone)");
        if (error) {
          return { error: error.message };
        }
        return { data };
      },
      providesTags: ["Cooker"],
    }),

    getCookerById: builder.query({
      async queryFn(user_id) {
        const { data, error } = await supabase
          .from("cookers")
          .select("*, users(name, email, phone)")
          .eq("user_id", user_id)
          .single();
        if (error) {
          return { error: error.message };
        }
        return { data };
      },
      providesTags: (result, error, arg) => [{ type: "Cooker", id: arg }],
    }),

    upsertCooker: builder.mutation({
      async queryFn(cooker) {
        const { error } = await supabase
          .from("cookers")
          .upsert([cooker], { onConflict: "user_id" });
        if (error) {
          return { error: error.message };
        }
        return { data: cooker };
      },
      invalidatesTags: ["Cooker"],
    }),

    approveCooker: builder.mutation({
      async queryFn({ user_id }) {
        const { error } = await supabase
          .from("cookers")
          .update({
            is_approved: true,
            approved_at: new Date().toISOString(),
          })
          .eq("user_id", user_id);
        if (error) {
          return { error: error.message };
        }
        return { data: true };
      },
      invalidatesTags: ["Cooker"],
    }),
  }),
});

export const {
  useGetCookersQuery,
  useGetCookerByIdQuery,
  useUpsertCookerMutation,
  useApproveCookerMutation,
} = cookersApi;
