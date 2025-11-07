import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Address"],
  endpoints: (builder) => ({
    // Get all addresses for current user
    getAddresses: builder.query({
      async queryFn() {
        try {
          // Get current user
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            return { error: { message: userError?.message || "User not found" } };
          }

          // Fetch addresses from database
          const { data, error } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", user.id)
            .order("is_default", { ascending: false })
            .order("created_at", { ascending: false });

          if (error) {
            return { error: { message: error.message } };
          }

          return { data: data || [] };
        } catch (error) {
          return {
            error: { message: error.message || "Failed to fetch addresses" },
          };
        }
      },
      providesTags: ["Address"],
    }),

    // Add new address
    addAddress: builder.mutation({
      async queryFn({
        label,
        city,
        area,
        street,
        buildingNumber,
        floor,
        apartment,
        latitude,
        longitude,
        isPrimary,
      }) {
        try {
          // Get current user
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            return { error: { message: userError?.message || "User not found" } };
          }

          // If this address is default, unset other default addresses
          if (isPrimary) {
            await supabase
              .from("addresses")
              .update({ is_default: false })
              .eq("user_id", user.id);
          }

          // Insert new address
          const { data, error } = await supabase
            .from("addresses")
            .insert({
              user_id: user.id,
              label,
              city,
              area,
              street,
              building_no: buildingNumber,
              floor: floor || null,
              apartment: apartment || null,
              latitude: latitude || null,
              longitude: longitude || null,
              is_default: isPrimary,
            })
            .select()
            .single();

          if (error) {
            return { error: { message: error.message } };
          }

          return {
            data: {
              message: "Address added successfully",
              address: data,
            },
          };
        } catch (error) {
          return {
            error: { message: error.message || "Failed to add address" },
          };
        }
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // Optimistic update - add address immediately to UI
        const tempId = `temp-${Date.now()}`;
        const optimisticAddress = {
          id: tempId,
          label: arg.label,
          city: arg.city,
          area: arg.area,
          street: arg.street,
          building_no: arg.buildingNumber,
          floor: arg.floor || null,
          apartment: arg.apartment || null,
          is_default: arg.isPrimary,
          created_at: new Date().toISOString(),
        };

        const patchResult = dispatch(
          addressApi.util.updateQueryData("getAddresses", undefined, (draft) => {
            if (arg.isPrimary) {
              draft.forEach((addr) => {
                addr.is_default = false;
              });
            }
            draft.unshift(optimisticAddress);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Address"],
    }),

    // Update address
    updateAddress: builder.mutation({
      async queryFn({
        id,
        label,
        city,
        area,
        street,
        buildingNumber,
        floor,
        apartment,
        latitude,
        longitude,
        isPrimary,
      }) {
        try {
          // Get current user
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            return { error: { message: userError?.message || "User not found" } };
          }

          // If this address is default, unset other default addresses
          if (isPrimary) {
            await supabase
              .from("addresses")
              .update({ is_default: false })
              .eq("user_id", user.id)
              .neq("id", id);
          }

          // Update address
          const { data, error } = await supabase
            .from("addresses")
            .update({
              label,
              city,
              area,
              street,
              building_no: buildingNumber,
              floor: floor || null,
              apartment: apartment || null,
              latitude: latitude || null,
              longitude: longitude || null,
              is_default: isPrimary,
            })
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single();

          if (error) {
            return { error: { message: error.message } };
          }

          return {
            data: {
              message: "Address updated successfully",
              address: data,
            },
          };
        } catch (error) {
          return {
            error: { message: error.message || "Failed to update address" },
          };
        }
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // Optimistic update - update address immediately in UI
        const patchResult = dispatch(
          addressApi.util.updateQueryData("getAddresses", undefined, (draft) => {
            const index = draft.findIndex((addr) => addr.id === arg.id);
            if (index !== -1) {
              if (arg.isPrimary) {
                draft.forEach((addr) => {
                  addr.is_default = false;
                });
              }
              draft[index] = {
                ...draft[index],
                label: arg.label,
                city: arg.city,
                area: arg.area,
                street: arg.street,
                building_no: arg.buildingNumber,
                floor: arg.floor || null,
                apartment: arg.apartment || null,
                is_default: arg.isPrimary,
              };
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Address"],
    }),

    // Delete address
    deleteAddress: builder.mutation({
      async queryFn(id) {
        try {
          // Get current user
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            return { error: { message: userError?.message || "User not found" } };
          }

          // Delete address
          const { error } = await supabase
            .from("addresses")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

          if (error) {
            return { error: { message: error.message } };
          }

          return {
            data: {
              message: "Address deleted successfully",
            },
          };
        } catch (error) {
          return {
            error: { message: error.message || "Failed to delete address" },
          };
        }
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update - remove address immediately from UI
        const patchResult = dispatch(
          addressApi.util.updateQueryData("getAddresses", undefined, (draft) => {
            const index = draft.findIndex((addr) => addr.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Address"],
    }),

    // Set address as primary
    setPrimaryAddress: builder.mutation({
      async queryFn(id) {
        try {
          // Get current user
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            return { error: { message: userError?.message || "User not found" } };
          }

          // Unset all default addresses
          await supabase
            .from("addresses")
            .update({ is_default: false })
            .eq("user_id", user.id);

          // Set this address as default
          const { data, error } = await supabase
            .from("addresses")
            .update({ is_default: true })
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single();

          if (error) {
            return { error: { message: error.message } };
          }

          return {
            data: {
              message: "Primary address updated successfully",
              address: data,
            },
          };
        } catch (error) {
          return {
            error: { message: error.message || "Failed to set primary address" },
          };
        }
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update - set primary immediately in UI
        const patchResult = dispatch(
          addressApi.util.updateQueryData("getAddresses", undefined, (draft) => {
            draft.forEach((addr) => {
              addr.is_default = addr.id === id;
            });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetPrimaryAddressMutation,
} = addressApi;
