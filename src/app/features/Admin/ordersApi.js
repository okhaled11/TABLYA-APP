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
            customer:customers(user_id, users(name, email,avatar_url,phone)),
            cooker:cookers(user_id,kitchen_name, users(name, email,avatar_url,phone)),
            delivery:deliveries(user_id, users(name, email,avatar_url,phone))
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
    // Update Order
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

    checkDeliveryOutForDelivery: builder.query({
      async queryFn(delivery_id) {
        const { data, error } = await supabase
          .from("orders")
          .select("id")
          .eq("delivery_id", delivery_id)
          .eq("status", "out_for_delivery");

        if (error) return { error: error.message };
        return { data };
      },
    }),
    getDeliveryStatuses: builder.query({
      async queryFn() {
        const { data, error } = await supabase
          .from("orders")
          .select("delivery_id")
          .eq("status", "out_for_delivery");

        if (error) return { error: error.message };

        // Count active orders per delivery
        const map = {};
        data.forEach((order) => {
          map[order.delivery_id] = (map[order.delivery_id] || 0) + 1;
        });

        // Convert map to array if you prefer
        const result = Object.entries(map).map(
          ([delivery_id, activeOrders]) => ({
            delivery_id,
            activeOrders,
          })
        );

        return { data: result };
      },
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
  useCheckDeliveryOutForDeliveryQuery,
  useGetDeliveryStatusesQuery,
} = ordersApi;
