//mariam's Api 
import { createApi, fakeBaseQuery, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from "../../../services/supabaseClient";

export const cookersApprovalsApi = createApi({
  reducerPath: 'cookersApprovalsApi',
  // baseQuery: fakeBaseQuery(),
  baseQuery: fetchBaseQuery({ baseUrl: '' }),

  tagTypes: ['CookerApprovals', 'Cookers'],
  endpoints: (builder) => ({

    //  Get all cooker approvals with cooker info
    // getCookerApprovals: builder.query({
    //   async queryFn() {
    //     try {
    //       const { data: approvals, error: approvalsError } = await supabase
    //         .from("cooker_approvals")
    //         .select("*");
    //       if (approvalsError) return { error: approvalsError };

    //       const { data: cookers, error: cookersError } = await supabase
    //         .from("cookers")
    //         .select("*");
    //       if (cookersError) return { error: cookersError };

    //       // fetch user info from authentication table 

    //       const {data : authUsers , error :authError } = await supabase.auth.admin.listUsers ({
    //         filter : { in : {column : "id" , values : approvals.map (app => app.cooker_id) } }


    //       });
    //       if (authError) return {error: authError};
    //       const users = authUsers.users;
    //       //merge data 
    //       const data = approvals.map((app) => {
    //         const cooker = cookers.find(c => c.user_id === app.cooker_id) || null;
    //         const authuser = users.find(u => u.id === app.cooker_id) || null;

    //         return { ...app, cooker, user: authuser? {
    //           name : authuser.user_metadata?.name ||"",
    //           email : authuser.email || "",
    //           id : authuser.id,
    //           avatar_url : authuser.user_metadata?.avatar_url || "",
    //           metadata : authuser.user_metadata || {},
    //         }: null




    //         } ;
    //       });

    //       return { data };
    //     } catch (err) {
    //       return { error: err };
    //     }
    //   },
    //   providesTags: ['CookerApprovals'],
    // }),





    //get data of cookers from cookers_approvals and authentication and users by fetching edge function on supabase

    getCookerApprovals: builder.query({
      async queryFn() {
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
         

          const res = await fetch(`${supabaseUrl}/functions/v1/get-cooker-approvals`, {
            headers: {
              "Content-Type": "application/json",

              "apikey":supabaseKey ,
              "Authorization": `Bearer ${supabaseKey}`,
            },
          });


          const json = await res.json();

          if (!res.ok) {
            return { error: { message: "Failed to fetch data", status: res.status, details: json } };
          }

          return { data: json.data || [] };
        } catch (err) {
          console.error("Fetch error:", err);
          return { error: { message: err.message || "Unknown error" } };
        }
      },

      providesTags : ['CookerApprovals', 'Cookers']
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
            .update({ status: 'approved', approved_at: new Date().toISOString(), approved_by: null })
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
      async queryFn({ id }) {
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
      async queryFn({ id }) {
        const { data, error } = await supabase
          .from('cooker_approvals')
          .update({ status: 'rejected' })
          .eq('id', id);
        if (error) return { error: error };
        return { data };
      },
      invalidatesTags: ['CookerApprovals'],
    }),

    //send notes 

    sendNotes: builder.mutation({
      async queryFn({ id, notes }) {

        const { data, error } = await supabase
          .from('cooker_approvals')
          .update({ notes , status: 'pending'})
          .eq('id', id);

        if (error) return { error: error };
        return { data }



      }, invalidatesTags: ['CookerApprovals'],

    }),
  })

});



export const {
  useGetCookerApprovalsQuery: useGetAllCookerApprovalsQuery,

  useApproveCookerMutation,
  useDeleteCookerApprovalMutation,
  useRejectCookerApprovalMutation,
  useSendNotesMutation

} = cookersApprovalsApi;
