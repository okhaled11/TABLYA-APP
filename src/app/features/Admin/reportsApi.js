// src/app/features/Reports/reportsApi.js
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Report"],
  endpoints: (builder) => ({
    getReports: builder.query({
      async queryFn() {
        const { data, error } = await supabase
          .from("reports")
          .select(
            `
            id,
            reporter_user_id,
            target_id,
            target_type,
            reason,
            details,
            status,
            assigned_to_admin,
            created_at,

            reporter:users!reports_reporter_user_id_fkey (
              id,
              name,
              email,
              role,
              avatar_url
            ),

            admin:admins!reports_assigned_to_admin_fkey (
              user_id,
              users (
                id,
                name,
                email,
                avatar_url
              )
            )
          `
          )
          .order("created_at", { ascending: false });

        if (error) return { error: error.message };
        return { data };
      },
      providesTags: ["Report"],
    }),
    getReportById: builder.query({
      async queryFn(id) {
        const { data, error } = await supabase
          .from("reports")
          .select(
            `
            *,
            reporter:users!reports_reporter_user_id_fkey(name, email),
            assigned_admin:admins!reports_assigned_to_admin_fkey(user_id, users(name, email)),
            order:orders(
              id,
              status,
              total,
              customer:customers(user_id, users(name, email)),
              cooker:cookers(user_id, users(name, email))
            )
          `
          )
          .eq("id", id)
          .single();

        if (error) return { error: error.message };
        return { data };
      },
      providesTags: (result, error, id) => [{ type: "Report", id }],
    }),

    createReport: builder.mutation({
      async queryFn(newReport) {
        const { data, error } = await supabase
          .from("reports")
          .insert([newReport])
          .select()
          .single();

        if (error) return { error: error.message };
        return { data };
      },
      invalidatesTags: ["Report"],
    }),

    updateReport: builder.mutation({
      async queryFn({ id, updates }) {
        const { data, error } = await supabase
          .from("reports")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) return { error: error.message };
        return { data };
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Report", id }],
    }),
   
  }),
});

export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  
} = reportsApi;
