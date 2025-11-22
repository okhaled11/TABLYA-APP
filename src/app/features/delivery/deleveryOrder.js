import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const deleveryOrder = createApi({
  reducerPath: "deleveryOrder",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["DeliveryOrders"],
  endpoints: (builder) => ({
    getOrdersForDeliveryCity: builder.query({
      async queryFn() {
        try {
          // 1. Get authenticated user
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser();

          if (authError || !user) {
            return {
              error: {
                message: authError?.message || "User not authenticated",
              },
            };
          }

          console.log(" Authenticated user:", user.id);

          const deliveryUserId = user.id;

          // 2. Get delivery person's city
          const { data: deliveryRow, error: deliveryError } = await supabase
            .from("deliveries")
            .select("city")
            .eq("user_id", deliveryUserId)
            .single();

          if (deliveryError) {
            console.error(" Error fetching delivery city:", deliveryError);
            return { error: { message: deliveryError.message } };
          }

          const deliveryCity = deliveryRow?.city || null;

          if (!deliveryCity) {
            console.log(" No city found for delivery person");
            return { data: [] };
          }

          console.log(" Delivery person's city:", deliveryCity);

          // 3. Get orders with addresses
          const { data: ordersData, error: ordersError } = await supabase
            .from("orders")
            .select(
              `
              id,
              status,
              total,
              notes,
              payment_method,
              created_at,
              customer_id,
              address,
              city,
              delivery_id
            `
            )
            .eq("city", deliveryCity)
            .in("status", ["ready_for_pickup", "out_for_delivery", "delivered"])
            // Only show orders that are unassigned or already assigned to this delivery user
            .or(`delivery_id.is.null,delivery_id.eq.${deliveryUserId}`)
            .order("created_at", { ascending: false });

          if (ordersError) {
            console.error(" Error fetching orders:", ordersError);
            return { error: { message: ordersError.message } };
          }

          console.log(" Found orders:", ordersData?.length || 0);

          // If no orders found, check if address-based filtering is needed
          if (!ordersData || ordersData.length === 0) {
            // Try alternative: fetch orders and filter by address city
            const { data: allOrders, error: allOrdersError } = await supabase
              .from("orders")
              .select(
                `
                id,
                status,
                total,
                notes,
                payment_method,
                created_at,
                customer_id,
                address,
                delivery_id
              `
              )
              .in("status", [
                "ready_for_pickup",
                "out_for_delivery",
                "delivered",
              ])
              .order("created_at", { ascending: false });

            if (allOrdersError) {
              return { error: { message: allOrdersError.message } };
            }

            // Only keep orders that are unassigned or already assigned to this delivery user
            const availableOrders = (allOrders || []).filter(
              (order) =>
                !order.delivery_id || order.delivery_id === deliveryUserId
            );

            // Get addresses for these orders
            const addressTexts = availableOrders
              .map((o) => o.address)
              .filter(Boolean);

            if (addressTexts.length === 0) {
              return { data: [] };
            }

            // Fetch matching addresses from addresses table (including coordinates)
            const { data: addressesData } = await supabase
              .from("addresses")
              .select(
                "id, user_id, city, street, building_no, floor, apartment, area, latitude, longitude, is_default"
              )
              .eq("city", deliveryCity);

            // Filter orders that match the delivery city
            const matchedOrders = availableOrders.filter((order) => {
              if (!order.address) return false;
              // Check if order address matches any address in the delivery city
              return addressesData?.some(
                (addr) =>
                  order.address.includes(addr.street) ||
                  order.address.includes(addr.area)
              );
            });

            console.log(" Matched orders by address:", matchedOrders.length);

            if (matchedOrders.length === 0) {
              return { data: [] };
            }

            // Continue with matched orders
            const orderIds = matchedOrders.map((o) => o.id);

            // Get order items
            let orderItemsData = [];
            if (orderIds.length > 0) {
              const { data: itemsRows } = await supabase
                .from("order_items")
                .select("order_id, quantity, title, price_at_order")
                .in("order_id", orderIds);
              orderItemsData = itemsRows || [];
            }

            // Get customer details
            let usersData = [];
            const customerIds = matchedOrders
              .map((o) => o.customer_id)
              .filter(Boolean);

            if (customerIds.length > 0) {
              const { data: usersRows } = await supabase
                .from("users")
                .select("id, name, phone, avatar_url")
                .in("id", customerIds);
              usersData = usersRows || [];
            }

            // Combine all data
            const ordersWithDetails = matchedOrders.map((order) => {
              const items = orderItemsData.filter(
                (i) => i.order_id === order.id
              );
              const customer =
                usersData.find((u) => u.id === order.customer_id) || null;

              // Prefer customer's default address for coordinates; fallback to any
              const customerAddresses = (addressesData || []).filter(
                (addr) => addr.user_id === order.customer_id
              );
              const defaultAddress =
                customerAddresses.find((addr) => addr.is_default) ||
                customerAddresses[0] ||
                null;

              return {
                ...order,
                order_items: items,
                customer,
                city: deliveryCity,
                latitude: defaultAddress?.latitude ?? null,
                longitude: defaultAddress?.longitude ?? null,
              };
            });

            return { data: ordersWithDetails };
          }

          // 4. Get order items for all orders
          const orderIds = ordersData.map((o) => o.id);
          let orderItemsData = [];

          if (orderIds.length > 0) {
            const { data: itemsRows } = await supabase
              .from("order_items")
              .select("order_id, quantity, title, price_at_order")
              .in("order_id", orderIds);
            orderItemsData = itemsRows || [];
          }

          // 5. Get customer details
          let usersData = [];
          const customerIds = ordersData
            .map((o) => o.customer_id)
            .filter(Boolean);

          if (customerIds.length > 0) {
            const { data: usersRows } = await supabase
              .from("users")
              .select("id, name, phone, avatar_url")
              .in("id", customerIds);
            usersData = usersRows || [];
          }

          console.log(" Found customers:", usersData.length);

          // 6. Get customer addresses with coordinates
          let customerAddressesData = [];
          if (customerIds.length > 0) {
            const { data: addrRows } = await supabase
              .from("addresses")
              .select("user_id, latitude, longitude, is_default")
              .in("user_id", customerIds);
            customerAddressesData = addrRows || [];
          }

          // 7. Combine all data
          const ordersWithDetails = ordersData.map((order) => {
            const items = orderItemsData.filter((i) => i.order_id === order.id);
            const customer =
              usersData.find((u) => u.id === order.customer_id) || null;

            const customerAddresses = customerAddressesData.filter(
              (addr) => addr.user_id === order.customer_id
            );
            const defaultAddress =
              customerAddresses.find((addr) => addr.is_default) ||
              customerAddresses[0] ||
              null;

            return {
              ...order,
              order_items: items,
              customer,
              latitude: defaultAddress?.latitude ?? null,
              longitude: defaultAddress?.longitude ?? null,
            };
          });

          console.log(" Final orders with details:", ordersWithDetails.length);

          return { data: ordersWithDetails };
        } catch (e) {
          console.error(" Unexpected error:", e);
          return {
            error: { message: e.message || "Failed to load delivery orders" },
          };
        }
      },
      providesTags: ["DeliveryOrders"],
    }),

    updateOrderStatus: builder.mutation({
      async queryFn({ orderId, status }) {
        try {
          // Get current authenticated user (delivery person)
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser();

          if (authError || !user) {
            return {
              error: {
                message: authError?.message || "User not authenticated",
              },
            };
          }

          let updatePayload = { status };

          // When claiming or completing an order, attach it to this delivery user
          if (status === "out_for_delivery" || status === "delivered") {
            updatePayload = { ...updatePayload, delivery_id: user.id };
          }

          // When sending back to ready_for_pickup, release the order
          if (status === "ready_for_pickup") {
            updatePayload = { ...updatePayload, delivery_id: null };
          }

          let query = supabase
            .from("orders")
            .update(updatePayload)
            .eq("id", orderId);

          // Only allow claiming/completing if the order is unassigned or already assigned to this driver
          if (status === "out_for_delivery" || status === "delivered") {
            query = query.or(`delivery_id.is.null,delivery_id.eq.${user.id}`);
          }

          const { data, error } = await query.select().single();

          if (error) {
            return { error: { message: error.message } };
          }

          console.log(
            " Order status updated:",
            orderId,
            "->",
            status,
            "by",
            user.id
          );

          return { data };
        } catch (e) {
          return { error: { message: e.message || "Failed to update status" } };
        }
      },
      invalidatesTags: ["DeliveryOrders"],
    }),
  }),
});

export const {
  useGetOrdersForDeliveryCityQuery,
  useUpdateOrderStatusMutation,
} = deleveryOrder;
