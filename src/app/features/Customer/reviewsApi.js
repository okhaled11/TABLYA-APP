// src/app/features/Customer/reviewsApi.js
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Reviews"],
  endpoints: (builder) => ({
    //get all reviews
    getReviewsByCookerId: builder.query({
      async queryFn(cookerId) {
        const { data, error } = await supabase
          .from("reviews")
          .select(
            `
        *,
        customers (
          user:users (
            name,
            avatar_url
          )
        )
      `
          )
          .eq("cooker_id", cookerId)
          .order("created_at", { ascending: false });

        if (error) return { error };
        return { data };
      },
      async onCacheEntryAdded(
        cookerId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let subscription;
        try {
          // Wait for the initial query to resolve before proceeding
          await cacheDataLoaded;

          // Subscribe to realtime changes
          subscription = supabase
            .channel(`reviews:${cookerId}`)
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: "reviews",
                filter: `cooker_id=eq.${cookerId}`,
              },
              async (payload) => {
                // Refetch the data when changes occur
                const { data: newData } = await supabase
                  .from("reviews")
                  .select(
                    `
                    *,
                    customers (
                      user:users (
                        name,
                        avatar_url
                      )
                    )
                  `
                  )
                  .eq("cooker_id", cookerId)
                  .order("created_at", { ascending: false });

                if (newData) {
                  updateCachedData(() => newData);
                }
              }
            )
            .subscribe();
        } catch (error) {
          console.error("Error in realtime subscription:", error);
        }

        // Cleanup subscription when cache entry is removed
        await cacheEntryRemoved;
        if (subscription) {
          supabase.removeChannel(subscription);
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Reviews", id })),
              { type: "Reviews", id: "LIST" },
            ]
          : [{ type: "Reviews", id: "LIST" }],
    }),
    //Add new review
    addReview: builder.mutation({
      async queryFn(reviewData) {
        const { data, error } = await supabase
          .from("reviews")
          .insert([reviewData])
          .select();

        if (error) return { error };
        return { data: data[0] };
      },
      invalidatesTags: [{ type: "Reviews", id: "LIST" }],
    }),
  }),
});

export const { useGetReviewsByCookerIdQuery, useAddReviewMutation } =
  reviewsApi;
