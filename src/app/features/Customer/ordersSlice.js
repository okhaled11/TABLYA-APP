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

          // Decrement stock for each menu item (best-effort, clamp at 0)
          try {
            await Promise.all(
              (items || []).map(async (it) => {
                const qty = it.quantity || 1;
                if (!it?.id || qty <= 0) return;

                // If stock present on item, compute new value locally
                if (typeof it.stock === "number") {
                  const newStock = Math.max(it.stock - qty, 0);
                  await supabase
                    .from("menu_items")
                    .update({ stock: newStock })
                    .eq("id", it.id);
                } else {
                  // Fetch current stock then update
                  const { data: mi } = await supabase
                    .from("menu_items")
                    .select("stock")
                    .eq("id", it.id)
                    .single();
                  const current = typeof mi?.stock === "number" ? mi.stock : 0;
                  const newStock = Math.max(current - qty, 0);
                  await supabase
                    .from("menu_items")
                    .update({ stock: newStock })
                    .eq("id", it.id);
                }
              })
            );
          } catch (e) {
            // ignore stock update errors for order creation success path
          }

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
