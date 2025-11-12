import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const CookerAcceptOrder = createApi({
  reducerPath: "CookerAcceptOrder",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["CookerOrders"],
  endpoints: (builder) => ({
    // Get orders for the logged-in chef
    getCookerOrders: builder.query({
      async queryFn() {
        try {
          // Get the current logged-in user
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            return { error: { message: userError?.message || "User not found" } };
          }

          // Get orders where cooker_id matches the logged-in user's ID
          const { data: ordersData, error: ordersError } = await supabase
            .from("orders")
            .select("*")
            .eq("cooker_id", user.id)
            .order("created_at", { ascending: false });

          if (ordersError) {
            return { error: { message: ordersError.message } };
          }

          // If no orders, return empty array
          if (!ordersData || ordersData.length === 0) {
            return { data: [] };
          }

          // Get all order IDs and customer IDs
          const orderIds = ordersData.map((order) => order.id);
          const customerIds = ordersData.map((order) => order.customer_id).filter(Boolean);

          // Fetch order items for all orders
          const { data: orderItemsData, error: itemsError } = await supabase
            .from("order_items")
            .select("*")
            .in("order_id", orderIds);

          if (itemsError) {
            console.error("Error fetching order items:", itemsError);
          }

          // Fetch users data for customers
          let usersData = [];
          if (customerIds.length > 0) {
            const { data: users, error: usersError } = await supabase
              .from("users")
              .select("*")
              .in("id", customerIds);

            if (usersError) {
              console.error("Error fetching users:", usersError);
            } else {
              usersData = users || [];
            }
          }

          // Combine orders with their items and customer data
          const ordersWithItems = ordersData.map((order) => {
            const items = orderItemsData ? orderItemsData.filter(
              (item) => item.order_id === order.id
            ) : [];

            const user = usersData.find(
              (u) => u.id === order.customer_id
            );

            return {
              ...order,
              order_items: items,
              customer: user || null
            };
          });

          console.log("Cooker Orders with Items:", ordersWithItems);
          return { data: ordersWithItems };
        } catch (error) {
          return {
            error: { message: error.message || "Failed to fetch orders" },
          };
        }
      },
      providesTags: ["CookerOrders"],
    }),

    // Update order status
    updateOrderStatus: builder.mutation({
      async queryFn({ orderId, status }) {
        try {
          const { data, error } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", orderId)
            .select();

          if (error) {
            return { error: { message: error.message } };
          }

          return { data: data[0] };
        } catch (error) {
          return {
            error: { message: error.message || "Failed to update order status" },
          };
        }
      },
      invalidatesTags: ["CookerOrders"],
    }),

    // Delete order
    deleteOrder: builder.mutation({
      async queryFn(orderId) {
        try {
          // First delete order items
          const { error: itemsError } = await supabase
            .from("order_items")
            .delete()
            .eq("order_id", orderId);

          if (itemsError) {
            return { error: { message: itemsError.message } };
          }

          // Then delete the order
          const { data, error } = await supabase
            .from("orders")
            .delete()
            .eq("id", orderId)
            .select();

          if (error) {
            return { error: { message: error.message } };
          }

          return { data: { success: true, orderId } };
        } catch (error) {
          return {
            error: { message: error.message || "Failed to delete order" },
          };
        }
      },
      invalidatesTags: ["CookerOrders"],
    }),
  }),
});

export const { 
  useGetCookerOrdersQuery, 
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation 
} = CookerAcceptOrder;