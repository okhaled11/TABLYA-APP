import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      async queryFn() {
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            *,
            customer:customers(user_id, users(name, email,avatar_url)),
            cooker:cookers(user_id, users(name, email,avatar_url)),
            delivery:deliveries(user_id, users(name, email,avatar_url))
          `
          )
          .order("created_at", { ascending: false });

        if (error) return { error: error.message };
        return { data };
      },
      providesTags: ["Order"],
    }),
    getOrdersByCustomer: builder.query({
      async queryFn(customer_id) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_id", customer_id)
          .order("created_at", { ascending: false });
        if (error) return { error: error.message };
        return { data };
      },
      providesTags: ["Order"],
    }),

    // -------------------------------
    // Get Orders by Cooker ID
    // -------------------------------
    getOrdersByCooker: builder.query({
      async queryFn(cooker_id) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("cooker_id", cooker_id)
          .order("created_at", { ascending: false });
        if (error) return { error: error.message };
        return { data };
      },
      providesTags: ["Order"],
    }),

    // -------------------------------
    // Create a New Order
    // -------------------------------
    createOrder: builder.mutation({
      async queryFn(orderData) {
        const { data, error } = await supabase
          .from("orders")
          .insert([orderData])
          .select()
          .single();
        if (error) return { error: error.message };
        return { data };
      },
      invalidatesTags: ["Order"],
    }),

    // -------------------------------
    // Update Order (e.g. status)
    // -------------------------------
    updateOrder: builder.mutation({
      async queryFn({ id, updates }) {
        const { data, error } = await supabase
          .from("orders")
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single();
        if (error) return { error: error.message };
        return { data };
      },
      invalidatesTags: ["Order"],
    }),

    // -------------------------------
    // Delete Order
    // -------------------------------
    deleteOrder: builder.mutation({
      async queryFn(id) {
        const { error } = await supabase.from("orders").delete().eq("id", id);
        if (error) return { error: error.message };
        return { data: id };
      },
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrdersByCookerQuery,
  useGetOrdersByCustomerQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = ordersApi;
