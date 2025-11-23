import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../../services/supabaseClient";

// Function to automatically reduce stock when order status changes to confirmed
const autoReduceStock = async (orderId) => {
  try {
    console.log("🔥 Auto-reducing stock for order:", orderId);

    // Get the order items to reduce stock
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("menu_item_id, quantity")
      .eq("order_id", orderId);

    if (itemsError) {
      console.error("❌ Error fetching order items:", itemsError);
      return;
    }

    console.log("📦 Order items found:", orderItems);

    // Reduce stock for each menu item
    if (orderItems && orderItems.length > 0) {
      console.log("🔄 Auto stock reduction for", orderItems.length, "items");

      await Promise.all(
        orderItems.map(async (item) => {
          console.log(
            `📊 Processing item: ${item.menu_item_id}, quantity: ${item.quantity}`
          );

          const { data: menuItem, error: fetchError } = await supabase
            .from("menu_items")
            .select("stock")
            .eq("id", item.menu_item_id)
            .single();

          if (fetchError) {
            console.error("❌ Error fetching menu item stock:", fetchError);
            return;
          }

          const currentStock = menuItem?.stock ?? 0;
          console.log(
            `📈 Current stock for item ${item.menu_item_id}:`,
            currentStock
          );

          const newStock = Math.max(currentStock - item.quantity, 0);
          console.log(`📉 New stock for item ${item.menu_item_id}:`, newStock);

          const { data: updateResult, error: updateError } = await supabase
            .from("menu_items")
            .update({ stock: newStock })
            .eq("id", item.menu_item_id)
            .select();

          if (updateError) {
            console.error("❌ Error updating stock:", updateError);
          } else {
            console.log(
              "✅ Stock updated successfully for",
              item.menu_item_id,
              updateResult
            );
          }
        })
      );
    }
  } catch (err) {
    console.error("❌ Auto stock reduction error:", err);
  }
};

export const OrdersApiCustomerSlice = createApi({
  reducerPath: "OrdersApiCustomerSlice",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Orders", "OrderHistory", "OrderDetails", "MealDetails"],
  endpoints: (builder) => ({
    // Get all orders for a customer with their items and menu items
    getCustomerOrders: builder.query({
      async queryFn(userId) {
        try {
          const { data: ordersData, error: ordersError } = await supabase
            .from("orders")
            .select("*")
            .eq("customer_id", userId)
            .order("created_at", { ascending: false });

          if (ordersError) {
            console.error("Orders error:", ordersError);
            return { error: ordersError.message };
          }

          const ordersWithItems = await Promise.all(
            (ordersData || []).map(async (order) => {
              const { data: items, error: itemsError } = await supabase
                .from("order_items")
                .select(
                  `
                  id,
                  title,
                  quantity,
                  price_at_order,
                  menu_item_id,
                  menu_items (
                    id,
                    title,
                    menu_img,
                    price
                  )
                `
                )
                .eq("order_id", order.id);

              if (itemsError) {
                console.warn(
                  "Warning: error fetching items for order",
                  order.id,
                  itemsError
                );
              }

              return {
                ...order,
                order_items: items || [],
              };
            })
          );

          return { data: ordersWithItems };
        } catch (err) {
          console.error("Query error:", err);
          return { error: err.message };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({ type: "Orders", id: r.id })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
      async onCacheEntryAdded(
        userId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let channel;
        try {
          await cacheDataLoaded;

          channel = supabase
            .channel(`orders-${userId}`)
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: "orders",
                filter: `customer_id=eq.${userId}`,
              },
              async (payload) => {
                try {
                  if (
                    payload.eventType === "INSERT" ||
                    payload.eventType === "UPDATE"
                  ) {
                    // Fetch order items for the new/updated order
                    const { data: items } = await supabase
                      .from("order_items")
                      .select(
                        `
                        id,
                        title,
                        quantity,
                        price_at_order,
                        menu_item_id,
                        menu_items (
                          id,
                          title,
                          menu_img,
                          price
                        )
                      `
                      )
                      .eq("order_id", payload.new.id);

                    const orderWithItems = {
                      ...payload.new,
                      order_items: items || [],
                    };

                    updateCachedData((draft) => {
                      if (payload.eventType === "INSERT") {
                        draft.unshift(orderWithItems);
                      } else if (payload.eventType === "UPDATE") {
                        const index = draft.findIndex(
                          (order) => order.id === payload.new.id
                        );
                        if (index !== -1) draft[index] = orderWithItems;
                      }
                    });
                  } else if (payload.eventType === "DELETE") {
                    updateCachedData((draft) => {
                      const index = draft.findIndex(
                        (order) => order.id === payload.old.id
                      );
                      if (index !== -1) draft.splice(index, 1);
                    });
                  }

                  // Auto-reduce stock when order status changes from created to confirmed
                  if (
                    payload.eventType === "UPDATE" &&
                    payload.old?.status === "created" &&
                    payload.new?.status === "confirmed"
                  ) {
                    console.log(
                      "🔥 Order status changed from created to confirmed, reducing stock..."
                    );
                    autoReduceStock(payload.new.id);
                  }
                } catch (e) {
                  console.error("Realtime payload handler error:", e);
                }
              }
            )
            .subscribe();
        } catch (err) {
          console.error("Realtime subscription error:", err);
        }

        await cacheEntryRemoved;
        if (channel) {
          supabase.removeChannel(channel);
        }
      },
    }),

    // Get detailed order information including customer, cooker, items and delivery
    getOrderDetails: builder.query({
      async queryFn(orderId) {
        try {
          const { data: orderData, error: orderError } = await supabase
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();

          if (orderError) return { error: orderError.message };

          const { data: customerData, error: customerError } = await supabase
            .from("users")
            .select("id, name, email, phone, avatar_url")
            .eq("id", orderData.customer_id)
            .single();

          const { data: customerAddressData } = await supabase
            .from("customers")
            .select("address")
            .eq("user_id", orderData.customer_id)
            .single();

          const { data: cookerData, error: cookerError } = await supabase
            .from("cookers")
            .select("user_id, kitchen_name, avg_rating, total_reviews")
            .eq("user_id", orderData.cooker_id)
            .single();

          let cookerUserData = null;
          if (cookerData?.user_id) {
            const { data: userData } = await supabase
              .from("users")
              .select("name, avatar_url, email, phone")
              .eq("id", cookerData.user_id)
              .single();
            cookerUserData = userData;
          }

          let deliveryUserData = null;
          if (orderData?.delivery_id) {
            const { data: deliveryUser, error: deliveryUserError } =
              await supabase
                .from("users")
                .select("id, name, avatar_url, email, phone")
                .eq("id", orderData.delivery_id)
                .single();

            if (deliveryUserError) {
              console.warn("Error fetching delivery user:", deliveryUserError);
            } else {
              deliveryUserData = deliveryUser;
            }
          }

          const { data: orderItems, error: itemsError } = await supabase
            .from("order_items")
            .select(
              `
              *,
              menu_items:menu_item_id (
                id,
                title,
                description,
                price,
                menu_img,
                category
              )
            `
            )
            .eq("order_id", orderId);

          if (itemsError) return { error: itemsError.message };

          const { data: orderDelivery, error: deliveryError } = await supabase
            .from("order_delivery")
            .select("*")
            .eq("order_id", orderId)
            .single();

          if (deliveryError && deliveryError.code !== "PGRST116") {
            // ignore not found error code from supabase (depends on setup), but surface others
            console.warn("Warning fetching delivery:", deliveryError);
          }

          const fullOrderData = {
            ...orderData,
            customer: customerData
              ? {
                  ...customerData,
                  address: customerAddressData?.address || null,
                }
              : null,
            cooker: cookerData
              ? {
                  ...cookerData,
                  users: cookerUserData,
                }
              : null,
            delivery_user: deliveryUserData,
            order_items: orderItems || [],
            order_delivery: orderDelivery || null,
          };

          return { data: fullOrderData };
        } catch (err) {
          console.error("getOrderDetails error:", err);
          return { error: err.message };
        }
      },
      providesTags: (result, error, arg) =>
        result ? [{ type: "OrderDetails", id: arg }] : [],
      async onCacheEntryAdded(
        orderId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let channel;
        try {
          await cacheDataLoaded;

          channel = supabase
            .channel(`order-${orderId}`)
            .on(
              "postgres_changes",
              {
                event: "UPDATE",
                schema: "public",
                table: "orders",
                filter: `id=eq.${orderId}`,
              },
              (payload) => {
                updateCachedData((draft) => {
                  if (payload.new) Object.assign(draft, payload.new);
                });
              }
            )
            .subscribe();
        } catch (err) {
          console.error("Realtime subscription error:", err);
        }

        await cacheEntryRemoved;
        if (channel) supabase.removeChannel(channel);
      },
    }),

    // Get meal and chef details
    getMealAndChefDetails: builder.query({
      async queryFn({ mealId, chefId }) {
        try {
          const { data: mealData, error: mealError } = await supabase
            .from("menu_items")
            .select("*")
            .eq("id", mealId)
            .single();

          if (mealError) return { error: mealError.message };

          const { data: chefData, error: chefError } = await supabase
            .from("cookers")
            .select("*, users(name, avatar_url, email, phone)")
            .eq("user_id", chefId)
            .single();

          if (chefError) return { error: chefError.message };

          const fullData = {
            meal: mealData,
            chef: chefData,
          };

          return { data: fullData };
        } catch (err) {
          console.error("getMealAndChefDetails error:", err);
          return { error: err.message };
        }
      },
      providesTags: (result) =>
        result ? [{ type: "MealDetails", id: result.meal?.id }] : [],
    }),

    // Mutation to update meal stock (reduces by quantityToReduce)
    updateMealStock: builder.mutation({
      async queryFn({ mealId, quantityToReduce }) {
        try {
          const { data: currentItem, error: fetchError } = await supabase
            .from("menu_items")
            .select("stock")
            .eq("id", mealId)
            .single();

          if (fetchError) return { error: fetchError.message };

          const currentStock = currentItem?.stock ?? 0;
          const newStock = Math.max(currentStock - quantityToReduce, 0);

          const { data, error: updateError } = await supabase
            .from("menu_items")
            .update({ stock: newStock })
            .eq("id", mealId)
            .select()
            .single();

          if (updateError) return { error: updateError.message };

          return { data };
        } catch (err) {
          console.error("updateMealStock error:", err);
          return { error: err.message };
        }
      },
      invalidatesTags: ["Orders", "OrderDetails"],
    }),

    // Mutation to cancel an order (example) - sets status to 'cancelled' and invalidates caches
    cancelOrder: builder.mutation({
      async queryFn({ orderId }) {
        try {
          console.log("🔥 cancelOrder called with:", { orderId });

          if (!orderId) {
            console.error("❌ orderId is missing or undefined");
            return { error: "Order ID is required" };
          }

          const { data, error } = await supabase
            .from("orders")
            .update({ status: "cancelled" })
            .eq("id", orderId)
            .select();

          console.log("📡 Supabase response:", { data, error });

          if (error) return { error: error.message };

          // Add entry to order history for cancelled order
          if (data && data.length > 0) {
            const cancelledOrder = data[0];
            await supabase.from("order_history").insert({
              customer_id: cancelledOrder.customer_id,
              order_id: orderId,
              status: "cancelled",
              at: new Date().toISOString(),
            });
          }

          return { data };
        } catch (err) {
          console.error("cancelOrder error:", err);
          return { error: err.message };
        }
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Orders", id: arg.customerId || "LIST" },
        { type: "OrderDetails", id: arg.orderId },
        { type: "OrderHistory", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCustomerOrdersQuery,
  useGetOrderDetailsQuery,
  useGetMealAndChefDetailsQuery,
  useUpdateMealStockMutation,
  useCancelOrderMutation,
} = OrdersApiCustomerSlice;
