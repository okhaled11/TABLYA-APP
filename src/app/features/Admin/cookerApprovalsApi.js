//mariam's Api 
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from "../../../services/supabaseClient";

export const cookersApprovalsApi = createApi({
  reducerPath: 'cookersApprovalsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['CookerApprovals', 'Cookers'],
  endpoints: (builder) => ({

    //  Get all cooker approvals with cooker info
    getCookerApprovals: builder.query({
      async queryFn() {
        try {
          const { data: approvals, error: approvalsError } = await supabase
            .from("cooker_approvals")
            .select("*");
          if (approvalsError) return { error: approvalsError };

          const { data: cookers, error: cookersError } = await supabase
            .from("cookers")
            .select("*");
          if (cookersError) return { error: cookersError };

          const { data: users, error: usersError } = await supabase
            .from("users")
            .select("id, name, email, phone, avatar_url");
          if (usersError) return { error: usersError };

          const data = approvals.map((app) => {
            const cooker = cookers.find(c => c.user_id === app.cooker_id) || null;
            const user = users.find(u => u.id === app.cooker_id) || null;

            return { ...app, cooker, user };
          });

          return { data };
        } catch (err) {
          return { error: err };
        }
      },
      providesTags: ['CookerApprovals'],
    }),

    //  Approve cooker
    approveCooker: builder.mutation({
      async queryFn({ id, approved_by }) {
        try {
          // get approval
          const { data: approval, error: fetchError } = await supabase
            .from('cooker_approvals')
            .select('*')
            .eq('id', id)
            .single();
          if (fetchError) return { error: fetchError };

          //update to aproved
          const { data: updatedApproval, error: updateError } = await supabase
            .from('cooker_approvals')
            .update({ status: 'approved', approved_at: new Date().toISOString(), approved_by: null})
            .eq('id', id);
            
          if (updateError) return { error: updateError };

          //add cooker to table if not existed
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
                kitchen_name: approval.name || null,
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
      invalidatesTags: ['CookerApprovals', 'Cookers'],
    }),

    //  Delete cooker approval (and if cooker existed already )
    deleteCookerApproval: builder.mutation({
      async queryFn(id) {
        try {
          const { data: approval, error: fetchError } = await supabase
            .from('cooker_approvals')
            .select('*')
            .eq('id', id)
            .single();
          if (fetchError) return { error: fetchError };

          const cookerId = approval.cooker_id;

         //delete approval
          const { data: deletedApproval, error: deleteApprovalError } = await supabase
            .from('cooker_approvals')
            .delete()
            .eq('id', id);
          if (deleteApprovalError) return { error: deleteApprovalError };

          //delete cooker if existed 
          const { data: existingCooker } = await supabase
            .from('cookers')
            .select('*')
            .eq('user_id', cookerId)
            .single();

          if (existingCooker) {
            const { error: deleteCookerError } = await supabase
              .from('cookers')
              .delete()
              .eq('user_id', cookerId);
            if (deleteCookerError) return { error: deleteCookerError };
          }
          
             const { error: deleteUserError } = await supabase
             .from('users')
             .delete()
             .eq('id', cookerId);

            if (deleteUserError) return { error: deleteUserError };

      return { data: { message: "Cooker approval, cooker, and user deleted successfully" } };
    } catch (err) {
      return { error: err };
    }
      },
      invalidatesTags: ['CookerApprovals', 'Cookers'],
    }),
    
  //reject cooker approval 

//   Reject a cooker
    rejectCookerApproval: builder.mutation({
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
  }),
});

export const {
  useGetCookerApprovalsQuery: useGetAllCookerApprovalsQuery,

  useApproveCookerMutation,
  useDeleteCookerApprovalMutation,
  useRejectCookerApprovalMutation
} = cookersApprovalsApi;
