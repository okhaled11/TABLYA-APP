import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

//Mariam's APIs 


export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({

    // total revenue

    getTotalRevenue: builder.query({
      async queryFn(period = "monthly") {
        const now = new Date();
        let fromDate;

        if (period === "daily") {

          fromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        } else if (period === "weekly") {

          const day = now.getUTCDay(); // 0 = Sunday, 6 = Saturday
          const diffToSaturday = (day === 6 ? 0 : day + 1);
          fromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - diffToSaturday));
        } else {

          fromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        }

        const { data, error } = await supabase
          .from("orders")
          .select("total")
          .gte("created_at", fromDate.toISOString());

        if (error) return { error };

        const totalRevenue = data.reduce((acc, cur) => acc + Number(cur.total || 0), 0);

        function formatNumber(num) {
          if (num >= 1000) return (num / 1000).toFixed(3) + "k";
          return num;
        }

        return { data: formatNumber(totalRevenue) };
      },
    }),



    // ***********************************************************
    //  Revenue Trend (Monthly)
    // ***********************************************************
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



    // ***************************************************
    // total orders
    // ***************************************************
    getTotalOrders: builder.query({
      async queryFn(period = "monthly") {
        const now = new Date();
        let fromDate;

        if (period === "daily") {

          fromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        } else if (period === "weekly") {

          const day = now.getUTCDay(); // 0 = Sunday, 6 = Saturday
          const diffToSaturday = (day === 6 ? 0 : day + 1);
          fromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - diffToSaturday));
        } else {

          fromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        }

        const { count, error } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .gte("created_at", fromDate.toISOString());

        if (error) return { error };

        return { data: count };
      },
    }),


    // *************************************************
    // average order value 
    // *************************************************
    // getAverageOrderValue: builder.query({
    //   async queryFn() {
    //     const { data, error } = await supabase.from("orders").select("total");
    //     if (error) return { error };
    //     const totalRevenue = data.reduce((acc, cur) => acc + Number(cur.total || 0), 0);
    //     const average = data.length ? totalRevenue / data.length : 0;
    //     return { data: average };
    //   },
    // }),

    getAverageOrderValue: builder.query({
  async queryFn() {
    const now = new Date();
    
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  
    const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

    const { data, error } = await supabase
      .from("orders")
      .select("total")
      .gte("created_at", firstDayThisMonth)  
      .lt("created_at", firstDayNextMonth); 

    if (error) return { error };

    const totalRevenue = data.reduce((acc, cur) => acc + Number(cur.total || 0), 0);
    const average = data.length ? totalRevenue / data.length : 0;

    return { data: average };
  },
}),


    //************************************************** */
    // platform profit >> after the percentage 10% of the chef profit from revenue 




    getPlatformProfit: builder.query({
      async queryFn(period = "monthly") {
        const now = new Date();
        let fromDate;

        if (period === "daily") {

          fromDate = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate()
          ));

        } else if (period === "weekly") {

          const day = now.getUTCDay(); // 0=Sun, 6=Sat
          const diffToSaturday = (day === 6 ? 0 : day + 1);
          fromDate = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() - diffToSaturday
          ));

        } else {

          fromDate = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            1
          ));
        }

        // Get platform settings
        const { data: settings, error: settingserror } = await supabase
          .from("platform_settings")
          .select("*")
          .eq("id", "b63fcd43-7207-4ddf-a735-24467a0293dc");

        if (settingserror) return { error: settingserror };

        // Get orders
        const { data, error } = await supabase
          .from("orders")
          .select("total, created_at")
          .gte("created_at", fromDate.toISOString());

        if (error) return { error };

        // Calculate profit
        const totalRevenue = data.reduce((acc, cur) => acc + Number(cur.total || 0), 0);
        const pct = settings[0]?.platform_commission_pct || 0;
        const profit = Number((totalRevenue * (pct / 100)).toFixed(2));

        // Format
        function format(num) {
          if (num >= 1000) return (num / 1000).toFixed(3) + "k";
          return num;
        }

        return { data: format(profit) };
      },
    }),


    // *********************************************************************
    // growth rate monthly (determine the date first day of current month and last month and upcomming month then  )then 
    //get orders that created at current month 
    //then get orders that created at last month 
    //then calculate the total orders revenue 
    //then growth rate >> currentsum - prevsum /prevsum * 100 >> if it's 0 that's meaning there was no incom in lastb month 

    // ***********************************************************************
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

    //orders growth rate 

    getOrdersGrowthRate: builder.query({

      async queryFn() {

        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const firstDayLastMonth = new Date(now.getUTCFullYear(), now.getMonth() - 1, 1).toISOString();
        const firstDayThisMonthNext = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();


        const { data: current, error: e1 } = await supabase
          .from("orders")
          .select("id, created_at")
          .gte("created_at", firstDayThisMonth)
          .lt("created_at", firstDayThisMonthNext)
        if (e1) return { error: e1 };


        const { data: prev, error: e2 } = await supabase
          .from("orders")
          .select("id, created_at")
          .gte("created_at", firstDayLastMonth)
          .lt("created_at", firstDayThisMonth)

        if (e2) return { error: e2 };


        const growthRate = prev.length > 0 ? ((current.length - prev.length) / prev.length) * 100 : 0;
        return { data: growthRate };

      }

    }),




    //******************************************************** */
    // Sales Trend (This Month)>> revenue of every day in month 
    // ********************************************************
    getSalesTrend: builder.query({
      async queryFn() {
        const now = new Date();
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const { data, error } = await supabase
          .from("orders")
          .select("total, created_at")
          .gte("created_at", firstDayThisMonth);      //get all orders in month 
        if (error) return { error };

        const dailySales = {};                        //to get all orders of the day we must get day first 
        data.forEach((order) => {
          const day = new Date(order.created_at).toLocaleDateString("en-CA");
          dailySales[day] = (dailySales[day] || 0) + Number(order.total || 0);
        });

        /* to get sales trend we need to calculate total revenue of every day of month so dailysales is an empty object 
          we get first the day order created at afer mapping data of orders the we create key day if not found >> 0 and add the order total so we have 
          data like day: 100EGP    */

        const chartData = Object.entries(dailySales).map(([date, revenue]) => ({
          date,
          revenue,
        }));     //object.entries to convert object to array of arrays then mapping it to convert it to array of objects to be used in chart 

        return { data: chartData.sort((a, b) => new Date(a.date) - new Date(b.date)) };
      },
    }),






    // -------------------------------
    //  Top Performing Cuisines ( from order_items)
    // -------------------------------
    // getTopPerformingCuisines: builder.query({
    //   async queryFn() {
    //     const { data, error } = await supabase
    //       .from("order_items")
    //       .select("title, quantity");

    //     if (error) return { error };

    //     //count total quantity of every type
    //     const cuisineCount = {};
    //     data.forEach((item) => {
    //       const name = item.title || "Unknown";
    //       cuisineCount[name] = (cuisineCount[name] || 0) + Number(item.quantity || 0);
    //     });

    //     //convert it to array and sort it desecending
    //     const sorted = Object.entries(cuisineCount)
    //       .map(([title, count]) => ({ title, count }))
    //       .sort((a, b) => b.count - a.count)
    //       .slice(0, 5); //the best 5 

    //     return { data: sorted };
    //   },
    // }),


  getTopPerformingCuisines: builder.query({
  async queryFn() {
    const { data, error } = await supabase
      .from("order_items")
      .select(`
        title,
        quantity,
        menu_items:menu_item_id (
          cookers:cooker_id (
            kitchen_name
          )
        )
      `);

    if (error) return { error };

    const cuisineCount = {};

    data.forEach((item) => {
      const name = item.title || "Unknown";
      const qty = Number(item.quantity || 0);

      const kitchen =
        item.menu_items?.cookers?.kitchen_name || "-";

      if (!cuisineCount[name]) {
        cuisineCount[name] = { count: 0, kitchen_name: kitchen };
      }

      cuisineCount[name].count += qty;
    });

    const sorted = Object.entries(cuisineCount)
      .map(([title, e]) => ({
        title,
        count: e.count,
        kitchen_name: e.kitchen_name,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { data: sorted };
  },
}),


    // -------------------------------
    // Weekly Order Activity //orders quantity for every day
    // -------------------------------

    getWeeklyOrderActivity: builder.query({
      async queryFn() {
        const today = new Date(); //current day
        const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

        //determine start of current week in utc 
        const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        const day = todayUTC.getUTCDay(); // 0 = Sunday, 6 = Saturday
        const diffToSaturday = (day === 6 ? 0 : day + 1); //difference number of days to saturday 
        const startOfWeekUTC = new Date(todayUTC);
        startOfWeekUTC.setUTCDate(todayUTC.getUTCDate() - diffToSaturday);
        startOfWeekUTC.setUTCHours(0, 0, 0, 0);


        const endOfTodayUTC = new Date(todayUTC);
        endOfTodayUTC.setUTCHours(23, 59, 59, 999);


        const { data, error } = await supabase
          .from("orders")
          .select("id, created_at")
          .gte("created_at", startOfWeekUTC.toISOString())
          .lte("created_at", endOfTodayUTC.toISOString());

        if (error) return { error };


        const weeklyCount = Object.fromEntries(days.map((d) => [d, 0]));

        data.forEach((order) => {
          const orderDate = new Date(order.created_at);
          const orderDayUTC = orderDate.getUTCDay(); // 0=Sun .. 6=Sat
          const dayName = days[(orderDayUTC + 1) % 7]; //array start with saturday 
          weeklyCount[dayName]++;
        });

        //sort days
        const formatted = days.map((day) => ({
          day,
          orders: weeklyCount[day],
        }));

        return { data: formatted };
      },
    }),






    //if i want to replace growth by month instead of day (data doesn't help now to draw chart actuallly)

 getUserGrowthByType: builder.query({
  async queryFn() {
    const { data, error } = await supabase
      .from("users")
      .select("role, created_at");

    if (error) return { error };

    const counts = {};
    const currentYear = new Date().getFullYear();

    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    
    monthNames.forEach((name, idx) => {
      counts[name] = { cooker: 0, customer: 0, delivery: 0, Unknown: 0, monthIndex: idx };
    });

    data.forEach((user) => {
      const date = new Date(user.created_at);
      if (date.getFullYear() !== currentYear) return;

      const monthName = monthNames[date.getMonth()];
      const role = user.role || "Unknown";
      counts[monthName][role] = (counts[monthName][role] || 0) + 1;
    });

    const chartData = Object.entries(counts)
      .map(([month, roles]) => ({
        month,  
        ...roles,
      }))
      .sort((a, b) => a.monthIndex - b.monthIndex); 

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
  useGetUserGrowthByTypeQuery,
  useGetOrdersGrowthRateQuery,
  useGetTodayOrdersQuery,
} = dashboardApi;
