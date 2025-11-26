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
              delivery_fee,
              notes,
              payment_method,
              created_at,
              updated_at,
              customer_id,
              cooker_id,
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
                delivery_fee,
                notes,
                payment_method,
                created_at,
                updated_at,
                customer_id,
                cooker_id,
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

            // Cooker addresses for matched orders (to show chef address text)
            const cookerIds = matchedOrders
              .map((o) => o.cooker_id)
              .filter(Boolean);
            let cookerAddressesData = [];
            if (cookerIds.length > 0) {
              const { data: cookerAddrRows } = await supabase
                .from("addresses")
                .select("user_id, city, area, street, is_default")
                .in("user_id", cookerIds);
              cookerAddressesData = cookerAddrRows || [];
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

              const cookerAddresses = (cookerAddressesData || []).filter(
                (addr) => addr.user_id === order.cooker_id
              );
              const defaultCookerAddress =
                cookerAddresses.find((addr) => addr.is_default) ||
                cookerAddresses[0] ||
                null;

              const cooker_address = defaultCookerAddress
                ? [
                    defaultCookerAddress.city,
                    defaultCookerAddress.area,
                    defaultCookerAddress.street,
                  ]
                    .filter(Boolean)
                    .join(", ")
                : null;

              return {
                ...order,
                order_items: items,
                customer,
                city: deliveryCity,
                latitude: defaultAddress?.latitude ?? null,
                longitude: defaultAddress?.longitude ?? null,
                cooker_address,
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

          // 6. Get addresses
          let customerAddressesData = [];
          if (customerIds.length > 0) {
            const { data: addrRows } = await supabase
              .from("addresses")
              .select("user_id, latitude, longitude, is_default")
              .in("user_id", customerIds);
            customerAddressesData = addrRows || [];
          }
          // cooker addresses (for displaying chef address text)
          let cookerAddressesData = [];
          const cookerIds = ordersData.map((o) => o.cooker_id).filter(Boolean);
          if (cookerIds.length > 0) {
            const { data: cookerAddrRows } = await supabase
              .from("addresses")
              .select("user_id, city, area, street, is_default")
              .in("user_id", cookerIds);
            cookerAddressesData = cookerAddrRows || [];
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

            const cookerAddresses = cookerAddressesData.filter(
              (addr) => addr.user_id === order.cooker_id
            );
            const defaultCookerAddress =
              cookerAddresses.find((addr) => addr.is_default) ||
              cookerAddresses[0] ||
              null;

            const cooker_address = defaultCookerAddress
              ? [
                  defaultCookerAddress.city,
                  defaultCookerAddress.area,
                  defaultCookerAddress.street,
                ]
                  .filter(Boolean)
                  .join(", ")
              : null;

            return {
              ...order,
              order_items: items,
              customer,
              latitude: defaultAddress?.latitude ?? null,
              longitude: defaultAddress?.longitude ?? null,
              cooker_address,
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
      refetchOnFocus: true,
      refetchOnReconnect: true,
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, cacheEntryRemoved, refetch, updateCachedData }
      ) {
        try {
          await cacheDataLoaded;

          const { data: userRes } = await supabase.auth.getUser();
          const userId = userRes?.user?.id || null;
          let deliveryCity = null;
          if (userId) {
            const { data: deliveryRow } = await supabase
              .from("deliveries")
              .select("city")
              .eq("user_id", userId)
              .single();
            deliveryCity = deliveryRow?.city || null;
          }

          const baseConfig = {
            schema: "public",
            table: "orders",
          };

          const allowedStatuses = [
            "ready_for_pickup",
            "out_for_delivery",
            "delivered",
          ];

          const channel = supabase
            .channel(`delivery-orders-${userId || "all"}`)
            .on("postgres_changes", { ...baseConfig, event: "INSERT" }, async (payload) => {
              const row = payload.new;
              if (!row) return;
              if (!allowedStatuses.includes(row.status)) return;
              if (deliveryCity && row.city && row.city !== deliveryCity) return;
              if (row.delivery_id && userId && row.delivery_id !== userId) return;

              const [
                { data: itemsRows },
                { data: userRow },
                { data: custAddrRows },
                { data: cookerAddrRows },
              ] = await Promise.all([
                supabase
                  .from("order_items")
                  .select("order_id, quantity, title, price_at_order")
                  .eq("order_id", row.id),
                supabase
                  .from("users")
                  .select("id, name, phone, avatar_url")
                  .eq("id", row.customer_id)
                  .single(),
                supabase
                  .from("addresses")
                  .select("user_id, latitude, longitude, is_default")
                  .eq("user_id", row.customer_id),
                supabase
                  .from("addresses")
                  .select("user_id, city, area, street, is_default")
                  .eq("user_id", row.cooker_id),
              ]);

              const defaultAddress = (custAddrRows || []).find((a) => a.is_default) || (custAddrRows || [])[0] || null;
              const cookerAddresses = cookerAddrRows || [];
              const defaultCookerAddress =
                cookerAddresses.find((a) => a.is_default) || cookerAddresses[0] || null;
              const cooker_address = defaultCookerAddress
                ? [defaultCookerAddress.city, defaultCookerAddress.area, defaultCookerAddress.street]
                    .filter(Boolean)
                    .join(", ")
                : null;

              updateCachedData((draft) => {
                const exists = draft.some((o) => o.id === row.id);
                if (!exists) {
                  draft.unshift({
                    ...row,
                    order_items: itemsRows || [],
                    customer: userRow || null,
                    latitude: defaultAddress?.latitude ?? null,
                    longitude: defaultAddress?.longitude ?? null,
                    cooker_address,
                  });
                }
              });
            })
            .on(
              "postgres_changes",
              { ...baseConfig, event: "UPDATE" },
              async (payload) => {
                const row = payload.new;
                if (!row) return;

                if (!allowedStatuses.includes(row.status)) return;
                if (deliveryCity && row.city && row.city !== deliveryCity) return;
                if (row.delivery_id && userId && row.delivery_id !== userId) return;

                let handled = false;
                updateCachedData((draft) => {
                  const idx = draft.findIndex((o) => o.id === row.id);
                  if (idx !== -1) {
                    handled = true;
                    draft[idx].status = row.status;
                    draft[idx].delivery_id = row.delivery_id ?? null;
                  }
                });

                if (!handled) {
                  const [
                    { data: itemsRows },
                    { data: userRow },
                    { data: custAddrRows },
                    { data: cookerAddrRows },
                  ] = await Promise.all([
                    supabase
                      .from("order_items")
                      .select("order_id, quantity, title, price_at_order")
                      .eq("order_id", row.id),
                    supabase
                      .from("users")
                      .select("id, name, phone, avatar_url")
                      .eq("id", row.customer_id)
                      .single(),
                    supabase
                      .from("addresses")
                      .select("user_id, latitude, longitude, is_default")
                      .eq("user_id", row.customer_id),
                    supabase
                      .from("addresses")
                      .select("user_id, city, area, street, is_default")
                      .eq("user_id", row.cooker_id),
                  ]);

                  const defaultAddress = (custAddrRows || []).find((a) => a.is_default) || (custAddrRows || [])[0] || null;
                  const cookerAddresses = cookerAddrRows || [];
                  const defaultCookerAddress =
                    cookerAddresses.find((a) => a.is_default) || cookerAddresses[0] || null;
                  const cooker_address = defaultCookerAddress
                    ? [defaultCookerAddress.city, defaultCookerAddress.area, defaultCookerAddress.street]
                        .filter(Boolean)
                        .join(", ")
                    : null;

                  updateCachedData((draft) => {
                    const exists = draft.some((o) => o.id === row.id);
                    if (!exists) {
                      draft.unshift({
                        ...row,
                        order_items: itemsRows || [],
                        customer: userRow || null,
                        latitude: defaultAddress?.latitude ?? null,
                        longitude: defaultAddress?.longitude ?? null,
                        cooker_address,
                      });
                    }
                  });
                }
              }
            )
            .on(
              "postgres_changes",
              { ...baseConfig, event: "DELETE" },
              (payload) => {
                const row = payload.old;
                if (!row) return;
                updateCachedData((draft) => {
                  const idx = draft.findIndex((o) => o.id === row.id);
                  if (idx !== -1) draft.splice(idx, 1);
                });
              }
            )
            .subscribe();

          await cacheEntryRemoved;
          supabase.removeChannel(channel);
        } catch (_) {}
      },
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

          let updatePayload = { status, updated_at: new Date().toISOString() };

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
      async onQueryStarted({ orderId, status }, { dispatch, queryFulfilled }) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const patch = dispatch(
          deleveryOrder.util.updateQueryData(
            "getOrdersForDeliveryCity",
            undefined,
            (draft) => {
              const idx = draft.findIndex((o) => o.id === orderId);
              if (idx !== -1) {
                draft[idx].status = status;
                if (status === "out_for_delivery" || status === "delivered") {
                  draft[idx].delivery_id =
                    user?.id || draft[idx].delivery_id || null;
                }
                if (status === "ready_for_pickup") {
                  draft[idx].delivery_id = null;
                }
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
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
