import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../../services/supabaseClient";

export const OrdersHistoryCustomerSlice = createApi({
    reducerPath: "OrdersHistoryCustomerSlice",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["OrderHistory"],
    endpoints: (builder) => ({
        getCustomerOrderHistory: builder.query({
            async queryFn(userId) {
                try {
                    if (!userId) {
                        return { error: "User ID is required" };
                    }
                    
                    // First, get order history records
                    const { data: historyData, error: historyError } = await supabase
                        .from("order_history")
                        .select("*")
                        .eq("customer_id", userId)
                        .order("at", { ascending: false });

                    if (historyError) {
                        return { error: historyError.message };
                    }

                    if (!historyData || historyData.length === 0) {
                        return { data: [] };
                    }

                    // Get unique order IDs
                    const orderIds = [...new Set(historyData.map(h => h.order_id).filter(Boolean))];

                    // Fetch all related orders
                    const { data: ordersData, error: ordersError } = await supabase
                        .from("orders")
                        .select(`
                            id,
                            customer_id,
                            cooker_id,
                            delivery_id,
                            status,
                            subtotal,
                            delivery_fee,
                            discount,
                            total,
                            notes,
                            type,
                            created_at,
                            updated_at
                        `)
                        .in("id", orderIds);

                    // Fetch order items with menu items for all orders
                    const ordersWithItems = await Promise.all(
                        (ordersData || []).map(async (order) => {
                            const { data: items } = await supabase
                                .from("order_items")
                                .select(`
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
                                `)
                                .eq("order_id", order.id);

                            return {
                                ...order,
                                order_items: items || []
                            };
                        })
                    );

                    // Create a map of orders by ID for quick lookup
                    const ordersMap = {};
                    ordersWithItems.forEach(order => {
                        ordersMap[order.id] = order;
                    });

                    // Combine history data with order data
                    const combinedData = historyData.map(history => ({
                        ...history,
                        orders: ordersMap[history.order_id] || null
                    }));

                    return { data: combinedData };
                } catch (err) {
                    return { error: err.message };
                }
            },
            providesTags: ["OrderHistory"],
            async onCacheEntryAdded(
                userId,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                let channel;
                try {
                    await cacheDataLoaded;

                    // Subscribe to realtime changes for order_history
                    channel = supabase
                        .channel(`order-history-${userId}`)
                        .on(
                            'postgres_changes',
                            {
                                event: '*',
                                schema: 'public',
                                table: 'order_history',
                                filter: `customer_id=eq.${userId}`
                            },
                            async (payload) => {
                                // Handle different event types
                                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                                    // Get the order details for the new/updated history entry
                                    const { data: orderData } = await supabase
                                        .from('orders')
                                        .select(`
                                            id,
                                            customer_id,
                                            cooker_id,
                                            delivery_id,
                                            status,
                                            subtotal,
                                            delivery_fee,
                                            discount,
                                            total,
                                            notes,
                                            type,
                                            created_at,
                                            updated_at
                                        `)
                                        .eq('id', payload.new.order_id)
                                        .single();

                                    updateCachedData((draft) => {
                                        if (payload.eventType === 'INSERT') {
                                            // Add new history entry at the beginning
                                            draft.unshift({
                                                ...payload.new,
                                                orders: orderData || null
                                            });
                                        } else if (payload.eventType === 'UPDATE') {
                                            // Update existing entry using order_id and at as composite key
                                            const index = draft.findIndex(h => 
                                                h.order_id === payload.new.order_id && 
                                                h.at === payload.new.at
                                            );
                                            if (index !== -1) {
                                                draft[index] = {
                                                    ...payload.new,
                                                    orders: orderData || draft[index].orders
                                                };
                                            }
                                        }
                                    });
                                } else if (payload.eventType === 'DELETE') {
                                    updateCachedData((draft) => {
                                        const index = draft.findIndex(h => 
                                            h.order_id === payload.old.order_id && 
                                            h.at === payload.old.at
                                        );
                                        if (index !== -1) {
                                            draft.splice(index, 1);
                                        }
                                    });
                                }
                            }
                        )
                        .subscribe();
                } catch (err) {
                    console.error('Realtime subscription error:', err);
                }

                // Cleanup subscription when cache entry is removed
                await cacheEntryRemoved;
                if (channel) {
                    supabase.removeChannel(channel);
                }
            },
        }),
    }),
});

export const { useGetCustomerOrderHistoryQuery } = OrdersHistoryCustomerSlice;
