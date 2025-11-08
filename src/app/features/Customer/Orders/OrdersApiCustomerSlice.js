import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../../services/supabaseClient";

export const OrdersApiCustomerSlice = createApi({
    reducerPath: "OrdersApiCustomerSlice",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["Orders", "OrderHistory", "OrderDetails", "MealDetails"],
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
                    const { data: orderData, error: orderError } = await supabase
                        .from("orders")
                        .select("*")
                        .eq("id", orderId)
                        .single();

                    if (orderError) return { error: orderError.message };

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

                    const { data: orderDelivery, error: deliveryError } = await supabase
                        .from("order_delivery")
                        .select("*")
                        .eq("order_id", orderId)
                        .single();

                    
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

        getMealAndChefDetails: builder.query({
            async queryFn({ mealId, chefId }) {
                try {
                    const { data: mealData, error: mealError } = await supabase
                        .from("menu_items")
                        .select("*")
                        .eq("id", mealId)
                        .single();

                    if (mealError) return { error: mealError.message };

                    // جلب بيانات الطاهي مع بيانات المستخدم
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
                    return { error: err.message };
                }
            },
            providesTags: ["MealDetails"],
        }),

        updateMealStock: builder.mutation({
            async queryFn({ mealId, quantityToReduce }) {
                try {
                    // Get current stock
                    const { data: currentItem, error: fetchError } = await supabase
                        .from("menu_items")
                        .select("stock")
                        .eq("id", mealId)
                        .single();

                    if (fetchError) return { error: fetchError.message };

                    const newStock = currentItem.stock - quantityToReduce;

                    // Update stock in database
                    const { data, error: updateError } = await supabase
                        .from("menu_items")
                        .update({ stock: newStock })
                        .eq("id", mealId)
                        .select()
                        .single();

                    if (updateError) return { error: updateError.message };

                    return { data: { ...data, newStock } };
                } catch (err) {
                    return { error: err.message };
                }
            },
            invalidatesTags: ["MealDetails"],
        }),

    }),
});

export const {
    useGetCustomerOrdersQuery,
    useGetOrderDetailsQuery,
    useGetMealAndChefDetailsQuery,
    useUpdateMealStockMutation,
} = OrdersApiCustomerSlice;
