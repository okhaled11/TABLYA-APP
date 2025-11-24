import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const cookersApi = createApi({
  reducerPath: "cookersApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Cookers", "Cooker"],
  endpoints: (builder) => ({
    // Get top 6 approved cookers
    getTopCookers: builder.query({
      async queryFn() {
        const { data, error } = await supabase
          .from("cookers")
          .select("*, users(name, avatar_url)")
          .eq("is_approved", true)
          .order("avg_rating", { ascending: false })
          .limit(6);

        if (error) return { error };
        return { data };
      },
      providesTags: ["Cookers"],
    }),

    // Get all approved cookers
    getAllCookers: builder.query({
      async queryFn() {
        const { data, error } = await supabase
          .from("cookers")
          .select("*, users(name, avatar_url)")
          .eq("is_approved", true)
          .order("avg_rating", { ascending: false });

        if (error) return { error };
        return { data };
      },
      providesTags: ["Cookers"],
    }),

    // Get single cooker details (with realtime updates)
    getCookerById: builder.query({
      async queryFn(id) {
        const { data, error } = await supabase
          .from("cookers")
          .select("*, users(name, avatar_url, email, phone)")
          .eq("user_id", id)
          .single();

        if (error) return { error };
        return { data };
      },
      providesTags: (result, error, id) => [{ type: "Cooker", id }],
      refetchOnFocus: false,
      refetchOnReconnect: false,
      refetchOnMountOrArgChange: false,
      keepUnusedDataFor: 300,
      async onCacheEntryAdded(
        id,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;
          const channel = supabase
            .channel(`cookers-realtime-${id}`)
            .on(
              "postgres_changes",
              {
                event: "UPDATE",
                schema: "public",
                table: "cookers",
                filter: `user_id=eq.${id}`,
              },
              (payload) => {
                const row = payload?.new;
                if (!row) return;
                updateCachedData((draft) => {
                  Object.assign(draft, row);
                });
              }
            )
            .subscribe();

          await cacheEntryRemoved;
          supabase.removeChannel(channel);
        } catch (_) {
          // noop
        }
      },
    }),
    // Get menu items by cooker id
    getMenuItemsByCookerId: builder.query({
      async queryFn(cookerId) {
        const { data, error } = await supabase
          .from("menu_items")
          .select("*")
          .eq("cooker_id", cookerId);
        // .eq("available", true); //show only available items

        if (error) return { error };
        return { data };
      },
      providesTags: (result, error, id) => [{ type: "Cooker", id }],
      // auto refetch behaviors
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
      keepUnusedDataFor: 0,
    }),

    // Get multiple cookers by a list of user_ids to handle favourites
    getCookersByIds: builder.query({
      async queryFn(ids) {
        if (!ids || ids.length === 0) return { data: [] };
        const { data, error } = await supabase
          .from("cookers")
          .select("*, users(name, avatar_url)")
          .in("user_id", ids);
        if (error) return { error };
        return { data };
      },
      providesTags: ["Cookers"],
    }),

    // Get customer's city from customers table
    getCustomerCity: builder.query({
      async queryFn() {
        try {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            return { error: { message: "User not authenticated" } };
          }

          const { data, error } = await supabase
            .from("customers")
            .select("city")
            .eq("user_id", user.id)
            .single();

          if (error) return { error };
          return { data: data?.city || null };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      providesTags: ["Cookers"],
    }),
  }),
});

export const {
  useGetTopCookersQuery,
  useGetAllCookersQuery,
  useGetCookerByIdQuery,
  useGetMenuItemsByCookerIdQuery,
  useGetCookersByIdsQuery,
  useGetCustomerCityQuery,
} = cookersApi;
