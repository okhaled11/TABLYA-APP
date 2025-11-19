import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const personalInfoApi = createApi({
  reducerPath: "personalInfoApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["PersonalInfo", "User"],
  endpoints: (builder) => ({
    // Get user profile from auth.users
    getUserProfile: builder.query({
      async queryFn() {
        try {
          // Get current user from auth
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            return {
              error: { message: userError?.message || "User not found" },
            };
          }

          // Extract user data from auth.users
          const nameFromMetadata =
            user.user_metadata?.name || user.user_metadata?.full_name || "";

          let firstName = user.user_metadata?.first_name || "";
          let lastName = user.user_metadata?.last_name || "";

          // If first/last name are not explicitly stored, try to derive them from full name
          if ((!firstName || !lastName) && nameFromMetadata) {
            const parts = nameFromMetadata.trim().split(" ");

            if (!firstName && parts.length > 0) {
              firstName = parts[0];
            }

            if (!lastName && parts.length > 1) {
              lastName = parts.slice(1).join(" ");
            }
          }

          const userData = {
            id: user.id,
            email: user.email,
            name: nameFromMetadata,
            firstName,
            lastName,
            phone: user.user_metadata?.phone || user.phone || "",
            avatar_url: user.user_metadata?.avatar_url || "",
            created_at: user.created_at,
            updated_at: user.updated_at,
          };

          return { data: userData };
        } catch (error) {
          return {
            error: { message: error.message || "Failed to fetch user profile" },
          };
        }
      },
      providesTags: ["PersonalInfo", "User"],
    }),

    // Update user profile (name, email, phone) - Updates auth.users table
    updateUserProfile: builder.mutation({
      async queryFn({ firstName, lastName, email, phone }) {
        try {
          // Get current user
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            return {
              error: { message: userError?.message || "User not found" },
            };
          }

          const fullName = `${firstName} ${lastName}`;

          // Primary update: Update auth.users table via supabase.auth.updateUser
          const { data: authData, error: authError } =
            await supabase.auth.updateUser({
              email: email, // This updates email in auth.users and sends confirmation if changed
              data: {
                name: fullName,
                full_name: fullName, // Some systems use full_name
                first_name: firstName,
                last_name: lastName,
                phone: phone,
              },
            });

          if (authError) {
            console.error("Auth update error:", authError);
            return {
              error: {
                message: authError.message || "Failed to update auth profile",
              },
            };
          }

          // Secondary update: Also update custom users table for consistency (if exists)
          const { error: dbError } = await supabase
            .from("users")
            .update({
              name: fullName,
              email: email,
              phone: phone,
            })
            .eq("id", user.id);

          if (dbError) {
            console.warn("Custom users table update failed:", dbError);
            // Don't fail the operation if custom table update fails
          }

          return {
            data: {
              message: "Profile updated successfully in auth.users",
              user: {
                name: fullName,
                email,
                phone,
                firstName,
                lastName,
              },
              authData,
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
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
} = personalInfoApi;
