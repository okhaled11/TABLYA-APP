import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const deliveryApi = createApi({
  reducerPath: "deliveryApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Delivery"],
  endpoints: (builder) => ({
    // Get delivery data by user_id
    getDeliveryByUserId: builder.query({
      async queryFn(userId) {
        if (!userId) return { error: { message: "User ID is required" } };

        const { data, error } = await supabase
          .from("deliveries")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error) return { error };
        return { data };
      },
      providesTags: (result, error, userId) => [
        { type: "Delivery", id: userId },
      ],
      // Real-time updates for delivery availability
      async onCacheEntryAdded(
        userId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;

          const channel = supabase
            .channel(`delivery-realtime-${userId}`)
            .on(
              "postgres_changes",
              {
                event: "UPDATE",
                schema: "public",
                table: "deliveries",
                filter: `user_id=eq.${userId}`,
              },
              (payload) => {
                const updatedRow = payload?.new;
                if (!updatedRow) return;

                updateCachedData((draft) => {
                  Object.assign(draft, updatedRow);
                });
              }
            )
            .subscribe();

          await cacheEntryRemoved;
          supabase.removeChannel(channel);
        } catch (error) {
          console.error("Delivery realtime subscription error:", error);
        }
      },
    }),

    // Update delivery availability
    updateDeliveryAvailability: builder.mutation({
      async queryFn({ userId, isAvailable }) {
        if (!userId) return { error: { message: "User ID is required" } };

        const { data, error } = await supabase
          .from("deliveries")
          .update({ availability: isAvailable })
          .eq("user_id", userId)
          .select()
          .single();

        if (error) return { error };
        return { data };
      },
      invalidatesTags: (result, error, { userId }) => [
        { type: "Delivery", id: userId },
      ],
    }),

    // Update delivery location
    updateDeliveryLocation: builder.mutation({
      async queryFn({ userId, currentLocation, city }) {
        if (!userId) return { error: { message: "User ID is required" } };

        const updateData = {};
        if (currentLocation !== undefined)
          updateData.current_location = currentLocation;
        if (city !== undefined) updateData.city = city;

        const { data, error } = await supabase
          .from("deliveries")
          .update(updateData)
          .eq("user_id", userId)
          .select()
          .single();

        if (error) return { error };
        return { data };
      },
      invalidatesTags: (result, error, { userId }) => [
        { type: "Delivery", id: userId },
      ],
    }),
  }),
});

export const {
  useGetDeliveryByUserIdQuery,
  useUpdateDeliveryAvailabilityMutation,
  useUpdateDeliveryLocationMutation,
} = deliveryApi;
