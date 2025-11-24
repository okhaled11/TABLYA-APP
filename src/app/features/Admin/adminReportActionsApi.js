import { supabase } from "../../../services/supabaseClient";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminReportActionsApi = createApi({
  reducerPath: "reportActionsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["ReportAction"],

  endpoints: (builder) => ({
    getReportActions: builder.query({
      async queryFn(reportId) {
        const { data, error } = await supabase
          .from("report_actions")
          .select("*")
          .order("at", { ascending: false });

        if (error) return { error: error.message };
        return { data };
      },
      providesTags: ["ReportAction"],
    }),
    addReportAction: builder.mutation({
      async queryFn(newAction) {
        const { data, error } = await supabase
          .from("report_actions")
          .insert([newAction])
          .select()
          .single();

        if (error) return { error: error.message };
        return { data };
      },
      invalidatesTags: ["ReportAction", "Report"],
    }),
  }),
});

export const { useGetReportActionsQuery, useAddReportActionMutation } =
  adminReportActionsApi;
