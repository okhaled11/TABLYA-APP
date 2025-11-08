import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      async queryFn({ cooker_id, subtotal, delivery_fee = 0, tax = 0, total, notes = "" }) {
        try {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();
          if (userError || !user) {
            return { error: { message: userError?.message || "User not found" } };
          }

          const insertPayload = {
            customer_id: user.id,
            cooker_id,
            subtotal,
            delivery_fee,
            tax,
            total,
            notes,
          };

          const { data, error } = await supabase
            .from("orders")
            .insert(insertPayload)
            .select()
            .single();

          if (error) {
            return { error: { message: error.message } };
          }

          return { data };
        } catch (error) {
          return { error: { message: error.message || "Failed to create order" } };
        }
      },
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const { useCreateOrderMutation } = ordersApi;
