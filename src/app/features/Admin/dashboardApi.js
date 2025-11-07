import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

const PLATFORM_PROFIT_RATE = 0.1;

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    // -------------------------------
    // total revenue
    // -------------------------------
    getTotalRevenue: builder.query({
      async queryFn() {
        const { data, error } = await supabase.from("orders").select("total");
        if (error) return { error };
        const totalRevenue = data.reduce((acc, cur) => acc + Number(cur.total || 0), 0);
        return { data: totalRevenue };
      },
    }),

// -------------------------------
//  Revenue Trend (Monthly)
// -------------------------------
getRevenueTrend: builder.query({
  async queryFn() {
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1).toISOString(); //first day in current year

    // all orders in year
    const { data, error } = await supabase
      .from("orders")
      .select("total, created_at")
      .gte("created_at", firstDayOfYear);

    if (error) return { error };

    // monthly revenue
    const monthlyRevenue = {};

    data.forEach((order) => {
      const date = new Date(order.created_at);
      const month = date.toLocaleString("en-US", { month: "long" }); 
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(order.total || 0);
    });

    // convert it to array
    const monthsOrder = [
      "Jan", "Feb", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const chartData = monthsOrder.map((month) => ({
      month,
      revenue: monthlyRevenue[month] || 0,
    }));

    return { data: chartData };
  },
}),



    // -------------------------------
    // total orders
    // -------------------------------
    getTotalOrders: builder.query({
      async queryFn() {
        const { count, error } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });
        if (error) return { error };
        return { data: count };
      },
    }),

    // -------------------------------
    // average order value 
    // -------------------------------
    getAverageOrderValue: builder.query({
      async queryFn() {
        const { data, error } = await supabase.from("orders").select("total");
        if (error) return { error };
        const totalRevenue = data.reduce((acc, cur) => acc + Number(cur.total || 0), 0);
        const average = data.length ? totalRevenue / data.length : 0;
        return { data: average };
      },
    }),

    // -------------------------------
    // paltform profit
    // -------------------------------
    getPlatformProfit: builder.query({
      async queryFn() {
        const { data, error } = await supabase.from("orders").select("total");
        if (error) return { error };
        const totalRevenue = data.reduce((acc, cur) => acc + Number(cur.total || 0), 0);
        const profit = totalRevenue * PLATFORM_PROFIT_RATE;
        return { data: profit };
      },
    }),

    // -------------------------------
    // growth rate monthly
    // -------------------------------
    getGrowthRate: builder.query({
      async queryFn() {
        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const firstDayThisMonthNext = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

        const { data: current, error: e1 } = await supabase
          .from("orders")
          .select("total, created_at")
          .gte("created_at", firstDayThisMonth)
          .lt("created_at", firstDayThisMonthNext);
        if (e1) return { error: e1 };

        const { data: prev, error: e2 } = await supabase
          .from("orders")
          .select("total, created_at")
          .gte("created_at", firstDayLastMonth)
          .lt("created_at", firstDayThisMonth);
        if (e2) return { error: e2 };

        const currentSum = current.reduce((acc, cur) => acc + Number(cur.total || 0), 0);
        const prevSum = prev.reduce((acc, cur) => acc + Number(cur.total || 0), 0);
        const growthRate = prevSum ? ((currentSum - prevSum) / prevSum) * 100 : 0;

        return { data: growthRate };
      },
    }),

    // -------------------------------
    // Sales Trend (This Month)
    // -------------------------------
    getSalesTrend: builder.query({
      async queryFn() {
        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const { data, error } = await supabase
          .from("orders")
          .select("total, created_at")
          .gte("created_at", firstDayThisMonth);
        if (error) return { error };

        const dailySales = {};
        data.forEach((order) => {
          const day = new Date(order.created_at).toLocaleDateString("en-CA");
          dailySales[day] = (dailySales[day] || 0) + Number(order.total || 0);
        });

        const chartData = Object.entries(dailySales).map(([date, revenue]) => ({
          date,
          revenue,
        }));

        return { data: chartData.sort((a, b) => new Date(a.date) - new Date(b.date)) };
      },
    }),

    // -------------------------------
    //  Top Performing Cuisines ( from order_items)
    // -------------------------------
    getTopPerformingCuisines: builder.query({
      async queryFn() {
        const { data, error } = await supabase
          .from("order_items")
          .select("title, quantity");

        if (error) return { error };

       //count total quantity of every type
        const cuisineCount = {};
        data.forEach((item) => {
          const name = item.title || "Unknown";
          cuisineCount[name] = (cuisineCount[name] || 0) + Number(item.quantity || 0);
        });

        //convert it to array and sort it desecending
        const sorted = Object.entries(cuisineCount)
          .map(([title, count]) => ({ title, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); //the best 5 

        return { data: sorted };
      },
    }),

    // -------------------------------
    // Weekly Order Activity //orders quantity for every day
    // -------------------------------
    getWeeklyOrderActivity: builder.query({
      async queryFn() {
        const { data, error } = await supabase.from("orders").select("id, created_at");
        if (error) return { error };

        const days = ["Saturday","Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        const weeklyCount = Object.fromEntries(days.map((d) => [d, 0]));

        data.forEach((order) => {
          const day = days[new Date(order.created_at).getDay()];
          weeklyCount[day]++;
        });

        const formatted = days.map((day) => ({
          day,
          orders: weeklyCount[day],
        }));

        return { data: formatted };
      },
    }),


getUserGrowthByType: builder.query({
  async queryFn() {
    // 1️⃣ جلب البيانات من جدول users مع role و created_at
    const { data, error } = await supabase
      .from("users")
      .select("role, created_at");

    if (error) return { error };

    //
    const counts = {};

    data.forEach((user) => {
      const date = new Date(user.created_at);
      // to convert date
      const month = date.toLocaleString("default", { month: "short", year: "numeric" });
      const role = user.role || "Unknown";

      if (!counts[month]) counts[month] = { cooker: 0 , customer: 0, delivery: 0, Unknown: 0 };
      counts[month][role] = (counts[month][role] || 0) + 1;
    });

   //to convert object to array
    const chartData = Object.entries(counts)
      .map(([month, roles]) => ({
        month,
        ...roles,
      }))
     //sort them ascending
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    return { data: chartData };
  },
}),




  }),
});

export const {
  useGetTotalRevenueQuery,
  useGetTotalOrdersQuery,
  useGetAverageOrderValueQuery,
  useGetPlatformProfitQuery,
  useGetGrowthRateQuery,
  useGetSalesTrendQuery,
  useGetTopPerformingCuisinesQuery,
  useGetWeeklyOrderActivityQuery,
  useGetRevenueTrendQuery,
  useGetUserGrowthByTypeQuery
} = dashboardApi;
