import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const cookerApprovalsApi = createApi({
  reducerPath: "cookerApprovalsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Approval"],
  endpoints: (builder) => ({
    getCookerApprovals: builder.query({
      async queryFn() {
        const { data, error } = await supabase
          .from("cooker_approvals")
          .select("*");
        if (error) {
          return { error: error.message };
        }
        return { data };
      },
      providesTags: ["Approval"],
    }),

    getApprovalsByCookerId: builder.query({
      async queryFn(cooker_id) {
        const { data, error } = await supabase
          .from("cooker_approvals")
          .select("*")
          .eq("cooker_id", cooker_id);
        if (error) {
          return { error: error.message };
        }
        return { data };
      },
      providesTags: (result, error, arg) => [{ type: "Approval", id: arg }],
    }),

    submitCookerApproval: builder.mutation({
      async queryFn(payload) {
        const { error } = await supabase
          .from("cooker_approvals")
          .insert([payload]);
        if (error) {
          return { error: error.message };
        }
        return { data: payload };
      },
      invalidatesTags: ["Approval"],
    }),

    updateApprovalStatus: builder.mutation({
      async queryFn({ id, status, notes, approved_by }) {
        const updateData = {
          status,
          notes,
          approved_by: approved_by || null,
          approved_at: status === "approved" ? new Date().toISOString() : null,
        };

        const { error } = await supabase
          .from("cooker_approvals")
          .update(updateData)
          .eq("id", id);

        if (error) {
          return { error: error.message };
        }
        return { data: { id, status } };
      },
      invalidatesTags: ["Approval"],
    }),
  }),
});

export const {
  useGetCookerApprovalsQuery,
  useGetApprovalsByCookerIdQuery,
  useSubmitCookerApprovalMutation,
  useUpdateApprovalStatusMutation,
} = cookerApprovalsApi;
