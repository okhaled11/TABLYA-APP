import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const passwordApi = createApi({
  reducerPath: "passwordApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Password"],
  endpoints: (builder) => ({
    // Send password reset email
    sendPasswordResetEmail: builder.mutation({
      async queryFn(email) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) {
          return { error: { message: error.message } };
        }
        
        return { data: { message: "Password reset email sent successfully" } };
      },
    }),

    // Update password (after clicking the link in email)
    updatePassword: builder.mutation({
      async queryFn(newPassword) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        
        if (error) {
          return { error: { message: error.message } };
        }
        
        return { data: { message: "Password updated successfully" } };
      },
    }),
  }),
});

export const { 
  useSendPasswordResetEmailMutation,
  useUpdatePasswordMutation,
} = passwordApi;
