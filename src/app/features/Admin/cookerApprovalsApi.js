import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from "../../../services/supabaseClient";

export const cookerApprovalsApi = createApi({
  reducerPath: 'cookerApprovalsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['CookerApprovals'],
  endpoints: (builder) => ({

    // 1️⃣ Get all cooker approvals with cooker info
    getCookerApprovals: builder.query({
      async queryFn() {
        try {
         // get approvals data
          const { data: approvals, error: approvalsError } = await supabase
            .from('cooker_approvals')
            .select('*');
          if (approvalsError) return { error: approvalsError };

         //get cookers data 
          const { data: cookers, error: cookersError } = await supabase
            .from('cookers')
            .select('*');
          if (cookersError) return { error: cookersError };

         // join manually cookers and cooker approval
          const data = approvals.map(app => ({
            ...app,
            cooker: cookers.find(c => c.user_id === app.cooker_id) || null
          }));

          return { data };
        } catch (err) {
          return { error: err };
        }
      },
      providesTags: ['CookerApprovals'],
    }),




  approveCooker: builder.mutation({
  async queryFn({ id, approved_by }) {
    try {


     const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select(`
          user_id,
          users(name)
        `)
        .eq('user_id', approved_by)
        .single();

      if (adminError) return { error: adminError };

      const adminName = adminData?.users?.name || "Unknown Admin";

      
      const { data: approval, error: fetchError } = await supabase
        .from('cooker_approvals')
        .select('*')
        .eq('id', id)
        .single();
      if (fetchError) return { error: fetchError };

      //update approval
      const { data: updatedApproval, error: updateError } = await supabase
        .from('cooker_approvals')
        .update({ status: 'approved', approved_at: new Date(), approved_by: adminName })
        .eq('id', id);
      if (updateError) return { error: updateError };

      //if cooker not found add him to the table
      const { data: existingCooker } = await supabase
        .from('cookers')
        .select('*')
        .eq('user_id', approval.cooker_id)
        .single();

      if (!existingCooker) {
        const { data: newCooker, error: insertError } = await supabase
          .from('cookers')
          .insert([{
            user_id: approval.cooker_id,
            kitchen_name: approval.name,
            bio: '', 
            specialty: '',
            avg_rating: 0,
            is_approved: true,
            is_available: true,
            total_reviews: 0,
          }]);
        if (insertError) return { error: insertError };
      }

      return { data: updatedApproval };
    } catch (err) {
      return { error: err };
    }
  },
  invalidatesTags: ['CookerApprovals', 'cookers'],
}),


    // 3️⃣ Reject a cooker
    rejectCooker: builder.mutation({
      async queryFn({ id, notes }) {
        const { data, error } = await supabase
          .from('cooker_approvals')
          .update({ status: 'rejected', notes })
          .eq('id', id);
        if (error) return { error };
        return { data };
      },
      invalidatesTags: ['CookerApprovals'],
    }),

    // 4️⃣ Delete a cooker approval
    deleteCookerApproval: builder.mutation({
      async queryFn(id) {
        const { data, error } = await supabase
          .from('cooker_approvals')
          .delete()
          .eq('id', id);
        if (error) return { error };
        return { data };
      },
      invalidatesTags: ['CookerApprovals'],
    }),

  }),
});

export const {
  useGetCookerApprovalsQuery,
  useApproveCookerMutation,
  useRejectCookerMutation,
  useDeleteCookerApprovalMutation,
} = cookerApprovalsApi;
