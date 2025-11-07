import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../../services/supabaseClient";

export const OrdersApiCustomerSlice = createApi({
    reducerPath: "OrdersApiCustomerSlice",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["Orders", "OrderHistory", "OrderDetails"],
    endpoints: (builder) => ({

        getCustomerOrders: builder.query({
            async queryFn(userId) {
                try {
                    const { data, error } = await supabase
                        .from("orders")
                        .select("*")
                        .eq("customer_id", userId)
                        .order("created_at", { ascending: false });

                    if (error) return { error: error.message };
                    return { data };
                } catch (err) {
                    return { error: err.message };
                }
            },
            providesTags: ["Orders"],
        }),

        getOrderDetails: builder.query({
            async queryFn(orderId) {
                try {
                    // جلب بيانات الـ order الأساسية
                    const { data: orderData, error: orderError } = await supabase
                        .from("orders")
                        .select("*")
                        .eq("id", orderId)
                        .single();

                    if (orderError) return { error: orderError.message };

                    // جلب order_items مع تفاصيل menu_items
                    const { data: orderItems, error: itemsError } = await supabase
                        .from("order_items")
                        .select(`
                            *,
                            menu_items:menu_item_id (
                                id,
                                title,
                                description,
                                price,
                                menu_img,
                                category
                            )
                        `)
                        .eq("order_id", orderId);

                    if (itemsError) return { error: itemsError.message };

                    // جلب order_delivery
                    const { data: orderDelivery, error: deliveryError } = await supabase
                        .from("order_delivery")
                        .select("*")
                        .eq("order_id", orderId)
                        .single();

                    // delivery قد لا يكون موجود، لذلك لا نرجع error
                    
                    // دمج البيانات
                    const fullOrderData = {
                        ...orderData,
                        order_items: orderItems || [],
                        order_delivery: orderDelivery || null,
                    };

                    return { data: fullOrderData };
                } catch (err) {
                    return { error: err.message };
                }
            },
            providesTags: ["OrderDetails"],
        }),

    }),
});

export const {
    useGetCustomerOrdersQuery,
    useGetOrderDetailsQuery,
} = OrdersApiCustomerSlice;
