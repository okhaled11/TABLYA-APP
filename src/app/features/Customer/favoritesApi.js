import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const favoritesApi = createApi({
  reducerPath: "favoritesApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["FavoriteCookers"],
  endpoints: (builder) => ({
    getFavoriteCookersByCustomer: builder.query({
      async queryFn(customerId) {
        if (!customerId) return { data: [] };
        const { data, error } = await supabase
          .from("favourite_cookers")
          .select("cooker_id")
          .eq("customer_id", customerId);
        if (error) return { error };
        return { data: (data || []).map((row) => row.cooker_id) };
      },
      providesTags: (result, error, customerId) => [
        { type: "FavoriteCookers", id: customerId || "UNKNOWN" },
      ],
      async onCacheEntryAdded(
        customerId,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) {
        if (!customerId) return;
        await cacheDataLoaded;
        const channel = supabase
          .channel(`fav-cookers-${customerId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'favourite_cookers',
              filter: `customer_id=eq.${customerId}`,
            },
            (payload) => {
              const { eventType, new: newRow, old: oldRow } = payload;
              updateCachedData((draft) => {
                if (eventType === 'INSERT' && newRow?.cooker_id) {
                  if (!draft.includes(newRow.cooker_id)) draft.push(newRow.cooker_id);
                } else if (eventType === 'DELETE' && oldRow?.cooker_id) {
                  const idx = draft.indexOf(oldRow.cooker_id);
                  if (idx !== -1) draft.splice(idx, 1);
                }
              });
            }
          )
          .subscribe();

        await cacheEntryRemoved;
        supabase.removeChannel(channel);
      },
    }),

    addFavoriteCooker: builder.mutation({
      async queryFn({ customerId, cookerId }) {
        if (!customerId || !cookerId) return { error: 'Missing IDs' };
        const { error } = await supabase
          .from('favourite_cookers')
          .upsert({ customer_id: customerId, cooker_id: cookerId }, {
            onConflict: 'customer_id,cooker_id',
            ignoreDuplicates: true,
          });
        if (error) return { error };
        return { data: { cookerId } };
      },
      invalidatesTags: (res, err, { customerId }) => [
        { type: 'FavoriteCookers', id: customerId || 'UNKNOWN' },
      ],
    }),

    removeFavoriteCooker: builder.mutation({
      async queryFn({ customerId, cookerId }) {
        if (!customerId || !cookerId) return { error: 'Missing IDs' };
        const { error } = await supabase
          .from('favourite_cookers')
          .delete()
          .eq('customer_id', customerId)
          .eq('cooker_id', cookerId);
        if (error) return { error };
        return { data: { cookerId } };
      },
      invalidatesTags: (res, err, { customerId }) => [
        { type: 'FavoriteCookers', id: customerId || 'UNKNOWN' },
      ],
    }),
  }),
});

export const {
  useGetFavoriteCookersByCustomerQuery,
  useAddFavoriteCookerMutation,
  useRemoveFavoriteCookerMutation,
} = favoritesApi;
