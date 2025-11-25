import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

const buildWeekBuckets = (orders, targetYear, targetMonth) => {
    const weekBuckets = [0, 0, 0, 0];

    (orders || []).forEach((order) => {
        const createdAt = order?.created_at;
        if (!createdAt) return;

        const orderDate = new Date(createdAt);

        if (
            Number.isNaN(orderDate.getTime()) ||
            orderDate.getUTCFullYear() !== targetYear ||
            orderDate.getUTCMonth() !== targetMonth - 1
        ) {
            return;
        }

        const dayOfMonth = orderDate.getUTCDate();
        const weekIndex = Math.min(Math.floor((dayOfMonth - 1) / 7), 3);
        weekBuckets[weekIndex] += 1;
    });

    return weekBuckets.map((count, index) => ({
        week: `week${index + 1}`,
        orders: count,
    }));
};

const buildDailyBuckets = (orders, targetYear, targetWeek) => {
    const dayBuckets = [0, 0, 0, 0, 0, 0, 0]; // Sunday to Saturday
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Calculate the start date of the week
    const jan1 = new Date(Date.UTC(targetYear, 0, 1));
    const daysOffset = (7 - jan1.getUTCDay()) % 7;
    const firstMonday = new Date(Date.UTC(targetYear, 0, 1 + daysOffset));
    const weekStart = new Date(firstMonday);
    weekStart.setUTCDate(firstMonday.getUTCDate() + (targetWeek - 1) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekStart.getUTCDate() + 7);

    (orders || []).forEach((order) => {
        const createdAt = order?.created_at;
        if (!createdAt) return;

        const orderDate = new Date(createdAt);
        if (Number.isNaN(orderDate.getTime())) return;

        if (orderDate >= weekStart && orderDate < weekEnd) {
            const dayOfWeek = orderDate.getUTCDay();
            dayBuckets[dayOfWeek] += 1;
        }
    });

    return dayBuckets.map((count, index) => ({
        day: dayNames[index],
        orders: count,
    }));
};

const buildHourlyBuckets = (orders, targetYear, targetMonth, targetDay) => {
    const hourBuckets = new Array(24).fill(0);

    (orders || []).forEach((order) => {
        const createdAt = order?.created_at;
        if (!createdAt) return;

        const orderDate = new Date(createdAt);
        if (Number.isNaN(orderDate.getTime())) return;

        if (
            orderDate.getUTCFullYear() === targetYear &&
            orderDate.getUTCMonth() === targetMonth - 1 &&
            orderDate.getUTCDate() === targetDay
        ) {
            const hour = orderDate.getUTCHours();
            hourBuckets[hour] += 1;
        }
    });

    return hourBuckets.map((count, index) => ({
        hour: `${index.toString().padStart(2, '0')}:00`,
        orders: count,
    }));
};

export const CookerAnalyticsApi = createApi({
    reducerPath: "CookerAnalyticsApi",
    baseQuery: fakeBaseQuery(),
    tagTypes: ["CookerAnalytics"],
    endpoints: (builder) => ({
        getCookerMonthlyOrders: builder.query({
            async queryFn({ month, year } = {}) {
                try {
                    const selectedMonth = Number(month);
                    if (!selectedMonth || selectedMonth < 1 || selectedMonth > 12) {
                        return {
                            error: {
                                message: "Invalid month supplied. Month should be between 1 and 12.",
                            },
                        };
                    }

                    const targetYear = Number(year) || new Date().getUTCFullYear();
                    const monthStart = new Date(Date.UTC(targetYear, selectedMonth - 1, 1));
                    const nextMonthStart = new Date(Date.UTC(targetYear, selectedMonth, 1));

                    const {
                        data: { user },
                        error: authError,
                    } = await supabase.auth.getUser();

                    if (authError || !user) {
                        return {
                            error: {
                                message: authError?.message || "User not authenticated.",
                            },
                        };
                    }

                    const { data: orders, error: ordersError } = await supabase
                        .from("orders")
                        .select("id, created_at")
                        .eq("cooker_id", user.id)
                        .gte("created_at", monthStart.toISOString())
                        .lt("created_at", nextMonthStart.toISOString());

                    if (ordersError) {
                        return { error: { message: ordersError.message } };
                    }

                    const weeklyOrders = buildWeekBuckets(orders, targetYear, selectedMonth);

                    let weeklyEarnings = [
                        { week: "week1", earning: 0 },
                        { week: "week2", earning: 0 },
                        { week: "week3", earning: 0 },
                        { week: "week4", earning: 0 },
                    ];

                    const orderIds = (orders || []).map((o) => o.id);
                    if (orderIds.length > 0) {
                        const orderDateMap = new Map((orders || []).map((o) => [o.id, o.created_at]));
                        const { data: itemsRows, error: itemsError } = await supabase
                            .from("order_items")
                            .select(`
                              order_id,
                              quantity,
                              menu_item_id,
                              menu_items:menu_item_id (
                                id,
                                chef_profit
                              )
                            `)
                            .in("order_id", orderIds);

                        if (!itemsError && itemsRows) {
                            const earnings = [0, 0, 0, 0];
                            for (const it of itemsRows) {
                                const createdAt = orderDateMap.get(it.order_id);
                                if (!createdAt) continue;
                                const d = new Date(createdAt);
                                if (Number.isNaN(d.getTime())) continue;
                                if (
                                    d.getUTCFullYear() !== targetYear ||
                                    d.getUTCMonth() !== selectedMonth - 1
                                ) continue;
                                const qty = Number(it.quantity || 0);
                                const profitPer = Number(it?.menu_items?.chef_profit ?? 0);
                                const weekIdx = Math.min(Math.floor((d.getUTCDate() - 1) / 7), 3);
                                earnings[weekIdx] += qty * profitPer;
                            }
                            weeklyEarnings = earnings.map((val, idx) => ({
                                week: `week${idx + 1}`,
                                earning: Math.round(val * 100) / 100,
                            }));
                        }
                    }

                    return {
                        data: {
                            month: selectedMonth,
                            year: targetYear,
                            weeklyOrders,
                            weeklyEarnings,
                            totalOrders: orders?.length || 0,
                        },
                    };
                } catch (error) {
                    return {
                        error: {
                            message: error.message || "Failed to fetch cooker analytics.",
                        },
                    };
                }
            },
            providesTags: ["CookerAnalytics"],
        }),

        getCookerWeeklyOrders: builder.query({
            async queryFn({ week, year } = {}) {
                try {
                    const targetWeek = Number(week);
                    if (!targetWeek || targetWeek < 1 || targetWeek > 52) {
                        return {
                            error: {
                                message: "Invalid week supplied. Week should be between 1 and 52.",
                            },
                        };
                    }

                    const targetYear = Number(year) || new Date().getUTCFullYear();

                    // Calculate the start date of the week
                    const jan1 = new Date(Date.UTC(targetYear, 0, 1));
                    const daysOffset = (7 - jan1.getUTCDay()) % 7;
                    const firstMonday = new Date(Date.UTC(targetYear, 0, 1 + daysOffset));
                    const weekStart = new Date(firstMonday);
                    weekStart.setUTCDate(firstMonday.getUTCDate() + (targetWeek - 1) * 7);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setUTCDate(weekStart.getUTCDate() + 7);

                    const {
                        data: { user },
                        error: authError,
                    } = await supabase.auth.getUser();

                    if (authError || !user) {
                        return {
                            error: {
                                message: authError?.message || "User not authenticated.",
                            },
                        };
                    }

                    const { data: orders, error: ordersError } = await supabase
                        .from("orders")
                        .select("id, created_at")
                        .eq("cooker_id", user.id)
                        .gte("created_at", weekStart.toISOString())
                        .lt("created_at", weekEnd.toISOString());

                    if (ordersError) {
                        return { error: { message: ordersError.message } };
                    }

                    const dailyOrders = buildDailyBuckets(orders, targetYear, targetWeek);

                    return {
                        data: {
                            week: targetWeek,
                            year: targetYear,
                            dailyOrders,
                            totalOrders: orders?.length || 0,
                        },
                    };
                } catch (error) {
                    return {
                        error: {
                            message: error.message || "Failed to fetch cooker weekly analytics.",
                        },
                    };
                }
            },
            providesTags: ["CookerAnalytics"],
        }),

        getCookerDailyOrders: builder.query({
            async queryFn({ month, year, day } = {}) {
                try {
                    const selectedMonth = Number(month);
                    const selectedDay = Number(day);

                    if (!selectedMonth || selectedMonth < 1 || selectedMonth > 12) {
                        return {
                            error: {
                                message: "Invalid month supplied. Month should be between 1 and 12.",
                            },
                        };
                    }

                    if (!selectedDay || selectedDay < 1 || selectedDay > 31) {
                        return {
                            error: {
                                message: "Invalid day supplied. Day should be between 1 and 31.",
                            },
                        };
                    }

                    const targetYear = Number(year) || new Date().getUTCFullYear();
                    const dayStart = new Date(Date.UTC(targetYear, selectedMonth - 1, selectedDay));
                    const dayEnd = new Date(dayStart);
                    dayEnd.setUTCDate(dayStart.getUTCDate() + 1);

                    const {
                        data: { user },
                        error: authError,
                    } = await supabase.auth.getUser();

                    if (authError || !user) {
                        return {
                            error: {
                                message: authError?.message || "User not authenticated.",
                            },
                        };
                    }

                    const { data: orders, error: ordersError } = await supabase
                        .from("orders")
                        .select("id, created_at")
                        .eq("cooker_id", user.id)
                        .gte("created_at", dayStart.toISOString())
                        .lt("created_at", dayEnd.toISOString());

                    if (ordersError) {
                        return { error: { message: ordersError.message } };
                    }

                    const hourlyOrders = buildHourlyBuckets(orders, targetYear, selectedMonth, selectedDay);

                    return {
                        data: {
                            month: selectedMonth,
                            day: selectedDay,
                            year: targetYear,
                            hourlyOrders,
                            totalOrders: orders?.length || 0,
                        },
                    };
                } catch (error) {
                    return {
                        error: {
                            message: error.message || "Failed to fetch cooker daily analytics.",
                        },
                    };
                }
            },
            providesTags: ["CookerAnalytics"],
        }),
    }),
});

export const {
    useGetCookerMonthlyOrdersQuery,
    useGetCookerWeeklyOrdersQuery,
    useGetCookerDailyOrdersQuery
} = CookerAnalyticsApi;

