//mariam's Api 
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from "../../../services/supabaseClient";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyL2REpwX4XmSH5vhQG-cDHvzHG3MF0gn9CgFZ6nw6l8G1_zHJ_xMdw_QyyuQVa89jA/exec";

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
    //  Get all cooker approvals with cooker info
    getCookerApprovals: builder.query({
      async queryFn() {
        try {
          const { data: approvals, error: approvalsError } = await supabase
            .from("cooker_approvals")
            .select("*");
          if (approvalsError) {
            console.error("Error fetching approvals:", approvalsError);
            return { error: approvalsError };
          }

          console.log("📊 Total approvals fetched:", approvals.length);

          const { data: cookers, error: cookersError } = await supabase
            .from("cookers")
            .select("*");
          if (cookersError) {
            console.error("Error fetching cookers:", cookersError);
            return { error: cookersError };
          }

          const { data: users, error: usersError } = await supabase
            .from("users")
            .select("id, name, email, phone, avatar_url");
          if (usersError) {
            console.error("Error fetching users:", usersError);
            return { error: usersError };
          }

          const data = approvals.map((app) => {
            const cooker = cookers.find(c => c.user_id === app.cooker_id) || null;
            const user = users.find(u => u.id === app.cooker_id) || null;

            // إذا لم يكن هناك user في جدول users، استخدم البيانات من cooker_approvals نفسه
            const userData = user || {
              id: app.cooker_id,
              name: app.name || "Unknown",
              email: app.email || "",
              phone: app.phone || "",
              avatar_url: null
            };

            return { ...app, cooker, user: userData };
          });

          console.log("✅ Data after mapping:", data.length);
          console.log("📋 Sample data:", data[0]);

          return { data };
        } catch (err) {
          console.error("❌ Unexpected error in getCookerApprovals:", err);
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
    rejectCookerApproval: builder.mutation({
      async queryFn({ id }) {
        try {
          console.log("rejectCookerApproval called for id:", id);
          
          // خطوة 1: جلب بيانات الـ approval (بما فيها الإيميل) قبل التحديث
          const { data: approval, error: fetchError } = await supabase
            .from('cooker_approvals')
            .select('*')
            .eq('id', id)
            .single();

          if (fetchError) {
            console.error("Error fetching approval:", fetchError);
            return { error: fetchError };
          }

          if (!approval) {
            console.error("Approval not found for id:", id);
            return { error: { message: "Approval not found" } };
          }

          console.log("Approval fetched successfully:", approval);

          // خطوة 2: تحديث الـ status إلى rejected
          const { data, error: updateError } = await supabase
            .from('cooker_approvals')
            .update({ status: 'rejected' })
            .eq('id', id);
          
          if (updateError) {
            console.error("Error rejecting approval:", updateError);
            return { error: updateError };
          }

          console.log("Status updated to rejected successfully");

          // خطوة 3: إرسال الإيميل
          if (approval.email) {
            console.log("Sending rejection email to:", approval.email);
            await sendStatusEmail(approval.email, approval.name || "Chef", 'rejected');
          } else {
            console.warn("No email found in cooker_approvals for rejection. Approval data:", approval);
          }

          return { data };
        } catch (err) {
          console.error("Unexpected error in rejectCookerApproval:", err);
          return { error: err };
        }
      },
      invalidatesTags: ['CookerApprovals'],
    }),

    //send notes 

      sendNotes: builder.mutation({
        async queryFn({ id, notes }) {
          console.log("sendNotes mutation called with:", { id, notes });

          const { data, error } = await supabase
            .from('cooker_approvals')
            .update({ notes, status: 'pending' })
            .eq('id', id);

          if (error) {
            console.error("Error updating notes in Supabase:", error);
            return { error: error };
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
