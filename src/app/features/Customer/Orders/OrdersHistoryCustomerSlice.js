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
                    const { data, error } = await supabase
                        .from("order_history")
                        .select(`
                            *,
                            orders:order_id (
                                id,
                                customer_id,
                                cooker_id,
                                delivery_id,
                                status,
                                subtotal,
                                tax,
                                delivery_fee,
                                discount,
                                total,
                                notes,
                                type,
                                created_at,
                                updated_at
                            )
                        `)
                        .eq("customer_id", userId)
                        .order("at", { ascending: false });

                    if (error) {
                        return { error: error.message };
                    }

                    return { data };
                } catch (err) {
                    return { error: err.message };
                }
            },
            providesTags: ["OrderHistory"],
        }),
    }),
});

export const { useGetCustomerOrderHistoryQuery } = OrdersHistoryCustomerSlice;
