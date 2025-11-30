//mariam's Api 
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from "../../../services/supabaseClient";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbweSse7fRAIWyrX7oxdgvCGew0czAInkhrTnOfLed5g-hNvqqVdUAc1tC9o28fLcwsk9w/exec";

const sendStatusEmail = async (email, name, status, note = "") => {
  console.log("Attempting to send email:", { email, name, status, note });
  if (!email) {
      console.warn("No email provided to sendStatusEmail. Skipping.");
      return;
  }
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({ email, name, status, note }),
    });
    console.log("Email request sent to Google Script");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

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

          // Send email notification using the email column in cooker_approvals
          if (approval.email) {
            await sendStatusEmail(approval.email, approval.name || "Chef", 'approved');
          } else {
             console.warn("No email found in cooker_approvals table for this request.");
          }

          return { data: updatedApproval };
        } catch (err) {
          return { error: err };
        }
      },
      invalidatesTags: ['CookerApprovals', 'Cookers'],
    }),

    //  Delete cooker approval
    deleteCookerApproval: builder.mutation({
      async queryFn({id}) {
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
    rejectCookerApproval: builder.mutation({
      async queryFn({ id }) {
        console.log("rejectCookerApproval called for id:", id);
        
        // Fetch approval first to get email
        const { data: approval } = await supabase
            .from('cooker_approvals')
            .select('*')
            .eq('id', id)
            .single();

        const { data, error } = await supabase
          .from('cooker_approvals')
          .update({ status: 'rejected'})
          .eq('id', id);
        
        if (error) {
            console.error("Error rejecting approval:", error);
            return { error :error };
        }

        // Send email notification
        if (approval && approval.email) {
             await sendStatusEmail(approval.email, approval.name || "Chef", 'rejected');
        } else {
             console.warn("No email found in cooker_approvals for rejection.");
        }

        return { data };
      },
      invalidatesTags: ['CookerApprovals'],
    }),

//send notes 

sendNotes : builder.mutation ({
async queryFn ({id , notes}){
     console.log("sendNotes mutation called with:", { id, notes });

     const {data , error}= await supabase 
     .from ('cooker_approvals')
     .update({notes})
     .eq ('id' , id);
     
     if (error) {
        console.error("Error updating notes in Supabase:", error);
        return {error: error};
     }

     // Fetch approval to get email
     const { data: approval } = await supabase
        .from('cooker_approvals')
        .select('*')
        .eq('id', id)
        .maybeSingle();

     if (approval && approval.email) {
        await sendStatusEmail(approval.email, approval.name || "Chef", 'note', notes);
     } else {
        console.warn("No email found in cooker_approvals for sending note.");
     }

     return {data}

}, invalidatesTags: [ 'CookerApprovals'], 

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
