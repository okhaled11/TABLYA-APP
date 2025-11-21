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
                        return { error: { message: authError?.message || "User not authenticated" } };
                    }

                    console.log("🔐 Authenticated user:", user.id);

                    // 2. Get delivery person's city
                    const { data: deliveryRow, error: deliveryError } = await supabase
                        .from("deliveries")
                        .select("city")
                        .eq("user_id", user.id)
                        .single();

                    if (deliveryError) {
                        console.error("❌ Error fetching delivery city:", deliveryError);
                        return { error: { message: deliveryError.message } };
                    }

                    const deliveryCity = deliveryRow?.city || null;

                    if (!deliveryCity) {
                        console.log("📭 No city found for delivery person");
                        return { data: [] };
                    }

                    console.log("🏙️ Delivery person's city:", deliveryCity);

                    // 3. Get orders with addresses
                    const { data: ordersData, error: ordersError } = await supabase
                        .from("orders")
                        .select(`
              id,
              status,
              total,
              notes,
              payment_method,
              created_at,
              customer_id,
              address,
              city
            `)
                        .eq("city", deliveryCity)
                        .in("status", ["ready_for_pickup", "out_for_delivery", "delivered"])
                        .order("created_at", { ascending: false });

                    if (ordersError) {
                        console.error("❌ Error fetching orders:", ordersError);
                        return { error: { message: ordersError.message } };
                    }

                    console.log("📦 Found orders:", ordersData?.length || 0);

                    // If no orders found, check if address-based filtering is needed
                    if (!ordersData || ordersData.length === 0) {
                        // Try alternative: fetch orders and filter by address city
                        const { data: allOrders, error: allOrdersError } = await supabase
                            .from("orders")
                            .select(`
                id,
                status,
                total,
                notes,
                payment_method,
                created_at,
                customer_id,
                address
              `)
                            .in("status", ["ready_for_pickup", "out_for_delivery", "delivered"])
                            .order("created_at", { ascending: false });

                        if (allOrdersError) {
                            return { error: { message: allOrdersError.message } };
                        }

                        // Get addresses for these orders
                        const addressTexts = (allOrders || [])
                            .map(o => o.address)
                            .filter(Boolean);

                        if (addressTexts.length === 0) {
                            return { data: [] };
                        }

                        // Fetch matching addresses from addresses table
                        const { data: addressesData } = await supabase
                            .from("addresses")
                            .select("id, city, street, building_no, floor, apartment, area")
                            .eq("city", deliveryCity);

                        // Filter orders that match the delivery city
                        const matchedOrders = (allOrders || []).filter(order => {
                            if (!order.address) return false;
                            // Check if order address matches any address in the delivery city
                            return addressesData?.some(addr =>
                                order.address.includes(addr.street) ||
                                order.address.includes(addr.area)
                            );
                        });

                        console.log("🔍 Matched orders by address:", matchedOrders.length);

                        if (matchedOrders.length === 0) {
                            return { data: [] };
                        }

                        // Continue with matched orders
                        const orderIds = matchedOrders.map(o => o.id);

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
                            .map(o => o.customer_id)
                            .filter(Boolean);

                        if (customerIds.length > 0) {
                            const { data: usersRows } = await supabase
                                .from("users")
                                .select("id, name, phone, avatar_url")
                                .in("id", customerIds);
                            usersData = usersRows || [];
                        }

                        // Combine all data
                        const ordersWithDetails = matchedOrders.map(order => {
                            const items = orderItemsData.filter(i => i.order_id === order.id);
                            const customer = usersData.find(u => u.id === order.customer_id) || null;
                            return {
                                ...order,
                                order_items: items,
                                customer,
                                city: deliveryCity,
                            };
                        });

                        return { data: ordersWithDetails };
                    }

                    // 4. Get order items for all orders
                    const orderIds = ordersData.map(o => o.id);
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
                        .map(o => o.customer_id)
                        .filter(Boolean);

                    if (customerIds.length > 0) {
                        const { data: usersRows } = await supabase
                            .from("users")
                            .select("id, name, phone, avatar_url")
                            .in("id", customerIds);
                        usersData = usersRows || [];
                    }

                    console.log("👥 Found customers:", usersData.length);

                    // 6. Combine all data
                    const ordersWithDetails = ordersData.map(order => {
                        const items = orderItemsData.filter(i => i.order_id === order.id);
                        const customer = usersData.find(u => u.id === order.customer_id) || null;
                        return {
                            ...order,
                            order_items: items,
                            customer,
                        };
                    });

                    console.log("✅ Final orders with details:", ordersWithDetails.length);

                    return { data: ordersWithDetails };
                } catch (e) {
                    console.error("💥 Unexpected error:", e);
                    return { error: { message: e.message || "Failed to load delivery orders" } };
                }
            },
            providesTags: ["DeliveryOrders"],
        }),

        updateOrderStatus: builder.mutation({
            async queryFn({ orderId, status }) {
                try {
                    const { data, error } = await supabase
                        .from("orders")
                        .update({ status })
                        .eq("id", orderId)
                        .select()
                        .single();

                    if (error) {
                        return { error: { message: error.message } };
                    }

                    console.log("✅ Order status updated:", orderId, "->", status);

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
    useUpdateOrderStatusMutation
} = deleveryOrder;