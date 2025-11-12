import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const ordersApi = createApi({
  reducerPath: "customerOrdersApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      async queryFn({
        cooker_id,
        subtotal,
        delivery_fee = 0,
        discount = 0,
        address = "",
        notes = "",
        payment_method = "cash",
        payment_status = "pending",
        items = [],
      }) {
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
            discount,
            address,
            notes,
            payment_method,
            payment_status,
          };

          const { data: order, error } = await supabase
            .from("orders")
            .insert(insertPayload)
            .select()
            .single();

          if (error) {
            return { error: { message: error.message } };
          }

          // Map cart items to order_items
          const orderItems = (items || []).map((it) => ({
            order_id: order.id,
            menu_item_id: it.id,
            title: it.title || it.name || "",
            quantity: it.quantity || 1,
            price_at_order: it.price,
          }));

          if (orderItems.length > 0) {
            const { error: itemsError } = await supabase
              .from("order_items")
              .insert(orderItems);
            if (itemsError) {
              return { error: { message: itemsError.message } };
            }
          }

          // Stock will be decremented when chef confirms the order
          // No stock reduction at checkout time

          return { data: order };
        } catch (error) {
          return { error: { message: error.message || "Failed to create order" } };
        }
      },
      invalidatesTags: (result, error, arg) => [
        "Orders",
        arg?.cooker_id ? { type: "Cooker", id: arg.cooker_id } : undefined,
      ].filter(Boolean),
    }),
    
    updateOrderPaymentStatus: builder.mutation({
      async queryFn({ orderId, payment_status = "paid", payment_details = null }) {
        try {
          // Simple update - only payment_status
          const { data: order, error } = await supabase
            .from("orders")
            .update({ payment_status })
            .eq("id", orderId)
            .select()
            .single();

          if (error) {
            console.error("Supabase update error:", error);
            return { error: { message: error.message } };
          }

          return { data: order };
        } catch (error) {
          console.error("Update payment status error:", error);
          return { error: { message: error.message || "Failed to update payment status" } };
        }
      },
      invalidatesTags: ["orders"],
    }),
  }),
});

export const { useCreateOrderMutation, useUpdateOrderPaymentStatusMutation } = ordersApi;
