import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const personalInfoApi = createApi({
  reducerPath: "personalInfoApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["PersonalInfo", "User"],
  endpoints: (builder) => ({
    // Update user profile (name, email, phone)
    updateUserProfile: builder.mutation({
      async queryFn({ firstName, lastName, email, phone }) {
        try {
          // Get current user
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            return { error: { message: userError?.message || "User not found" } };
          }

          // Update user in database (users table)
          const { error: dbError } = await supabase
            .from("users")
            .update({
              name: `${firstName} ${lastName}`,
              email: email,
              phone: phone,
            })
            .eq("id", user.id);

          if (dbError) {
            return { error: { message: dbError.message } };
          }

          // Also update user metadata in Supabase Auth for consistency
          const { error: authError } = await supabase.auth.updateUser({
            data: {
              name: `${firstName} ${lastName}`,
              phone: phone,
            },
            email: email, // This will send a confirmation email if email changed
          });

          if (authError) {
            console.error("Auth update error:", authError);
            // Don't fail if auth update fails, database is the source of truth
          }

          return {
            data: {
              message: "Profile updated successfully",
              user: {
                name: `${firstName} ${lastName}`,
                email,
                phone,
              },
            },
          };
        } catch (error) {
          return {
            error: { message: error.message || "Failed to update profile" },
          };
        }
      },
      invalidatesTags: ["PersonalInfo", "User"],
    }),

    // Upload profile avatar
    uploadAvatar: builder.mutation({
      async queryFn(file) {
        try {
          // Get current user
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError) {
            return { error: { message: userError.message } };
          }

          // Create unique file name
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          // Upload file to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: true,
            });

          if (uploadError) {
            return { error: { message: uploadError.message } };
          }

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("avatars").getPublicUrl(filePath);

          // Update user in database (users table)
          const { error: dbError } = await supabase
            .from("users")
            .update({
              avatar_url: publicUrl,
            })
            .eq("id", user.id);

          if (dbError) {
            return { error: { message: dbError.message } };
          }

          // Also update user metadata in Supabase Auth for consistency
          const { error: authError } = await supabase.auth.updateUser({
            data: {
              avatar_url: publicUrl,
            },
          });

          if (authError) {
            console.error("Auth update error:", authError);
            // Don't fail if auth update fails, database is the source of truth
          }

          return {
            data: {
              message: "Avatar uploaded successfully",
              avatar_url: publicUrl,
            },
          };
        } catch (error) {
          return {
            error: { message: error.message || "Failed to upload avatar" },
          };
        }
      },
      invalidatesTags: ["PersonalInfo", "User"],
    }),

    // Delete profile avatar
    deleteAvatar: builder.mutation({
      async queryFn() {
        try {
          // Get current user
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError) {
            return { error: { message: userError.message } };
          }

          // Get avatar URL from database
          const { data: userData, error: fetchError } = await supabase
            .from("users")
            .select("avatar_url")
            .eq("id", user.id)
            .single();

          if (fetchError) {
            return { error: { message: fetchError.message } };
          }

          const avatarUrl = userData?.avatar_url;

          if (avatarUrl) {
            // Extract file path from URL
            const urlParts = avatarUrl.split("/");
            const filePath = `${user.id}/${urlParts[urlParts.length - 1]}`;

            // Delete file from storage
            const { error: deleteError } = await supabase.storage
              .from("avatars")
              .remove([filePath]);

            if (deleteError) {
              console.error("Storage delete error:", deleteError);
            }
          }

          // Remove avatar URL from database
          const { error: dbError } = await supabase
            .from("users")
            .update({
              avatar_url: null,
            })
            .eq("id", user.id);

          if (dbError) {
            return { error: { message: dbError.message } };
          }

          // Also remove from auth metadata for consistency
          const { error: authError } = await supabase.auth.updateUser({
            data: {
              avatar_url: null,
            },
          });

          if (authError) {
            console.error("Auth update error:", authError);
            // Don't fail if auth update fails, database is the source of truth
          }

          return {
            data: {
              message: "Avatar deleted successfully",
            },
          };
        } catch (error) {
          return {
            error: { message: error.message || "Failed to delete avatar" },
          };
        }
      },
      invalidatesTags: ["PersonalInfo", "User"],
    }),
  }),
});

export const {
  useUpdateUserProfileMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
} = personalInfoApi;
