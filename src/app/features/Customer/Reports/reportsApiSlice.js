import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../../services/supabaseClient";

export const ReportsApiSlice = createApi({
  reducerPath: "ReportsApiSlice",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Reports"],
  endpoints: (builder) => ({
    getUserReports: builder.query({
      async queryFn(userId) {
        try {
          const { data, error } = await supabase
            .from("reports")
            .select("target_id")
            .eq("reporter_user_id", userId);

          if (error) {
            console.error("Get user reports error:", error);
            return { error: error.message };
          }

          return { data: data || [] };
        } catch (err) {
          console.error("Get user reports exception:", err);
          return { error: err.message };
        }
      },
      providesTags: ["Reports"],
    }),
    createReport: builder.mutation({
      async queryFn({
        reporterUserId,
        orderId,
        targetId,
        targetType,
        reason,
        details,
      }) {
        try {
          const { data, error } = await supabase
            .from("reports")
            .insert({
              reporter_user_id: reporterUserId,
              order_id: orderId,
              target_id: targetId,
              target_type: targetType,
              reason: reason,
              details: details,
              status: "open",
            })
            .select()
            .single();

          if (error) {
            console.error("Report creation error:", error);
            return { error: error.message };
          }

          return { data };
        } catch (err) {
          console.error("Report creation exception:", err);
          return { error: err.message };
        }
      },
      invalidatesTags: ["Reports"],
    }),
    createSystemReport: builder.mutation({
      async queryFn({ details, targetId }) {
        try {
          // Get current user
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser();
          if (authError || !user) {
            return { error: "User not authenticated" };
          }

          const { data, error } = await supabase
            .from("reports")
            .insert({
              reporter_user_id: user.id,
              target_id: targetId,
              target_type: "system",
              reason: "system_problem",
              details: details,
              status: "open",
            })
            .select()
            .single();

          if (error) {
            console.error("System report creation error:", error);
            return { error: error.message };
          }

          return { data };
        } catch (err) {
          console.error("System report creation exception:", err);
          return { error: err.message };
        }
      },
      invalidatesTags: ["Reports"],
    }),
  }),
});

export const {
  useCreateReportMutation,
  useCreateSystemReportMutation,
  useGetUserReportsQuery,
} = ReportsApiSlice;
