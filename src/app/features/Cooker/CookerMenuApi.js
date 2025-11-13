import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const CookerMenuApi = createApi({
  reducerPath: "cookerMenuApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["MenuItem", "MenuItems"],
  endpoints: (builder) => ({
    getMyMenuItems: builder.query({
      async queryFn() {
        try {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();
          if (userError || !user)
            return { error: { message: "Not authenticated" } };
          const { data, error } = await supabase
            .from("menu_items")
            .select("*")
            .eq("cooker_id", user.id)
            .order("created_at", { ascending: false });

          if (error) return { error };
          return { data };
        } catch (e) {
          return { error: { message: e.message } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: "MenuItem", id: item.id })),
              { type: "MenuItems", id: "LIST" },
            ]
          : [{ type: "MenuItems", id: "LIST" }],
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheEntryRemoved, cacheDataLoaded }
      ) {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;

          // Ensure initial cache is loaded before subscribing
          await cacheDataLoaded;

          const channel = supabase.channel(`menu_items:${user.id}`);

          channel.on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "menu_items",
            },
            (payload) => {
              updateCachedData((draft) => {
                if (payload.new?.cooker_id !== user.id) return;
                const exists = draft.some((d) => d.id === payload.new.id);
                if (!exists) draft.unshift(payload.new);
              });
            }
          );

          channel.on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "menu_items",
            },
            (payload) => {
              updateCachedData((draft) => {
                if (payload.new?.cooker_id !== user.id) return;
                const idx = draft.findIndex((d) => d.id === payload.new.id);
                if (idx !== -1) draft[idx] = payload.new;
              });
            }
          );

          channel.on(
            "postgres_changes",
            {
              event: "DELETE",
              schema: "public",
              table: "menu_items",
            },
            (payload) => {
              updateCachedData((draft) => {
                if (payload.old?.cooker_id !== user.id) return;
                const idx = draft.findIndex((d) => d.id === payload.old.id);
                if (idx !== -1) draft.splice(idx, 1);
              });
            }
          );

          await channel.subscribe();

          await cacheEntryRemoved;
          await supabase.removeChannel(channel);
        } catch (e) {
          // ignore channel errors
        }
      },
    }),

    updateMenuItemAvailability: builder.mutation({
      async queryFn({ id, available }) {
        const { data, error } = await supabase
          .from("menu_items")
          .update({ available })
          .eq("id", id)
          .select()
          .single();
        if (error) return { error };
        return { data };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "MenuItem", id },
        { type: "MenuItems", id: "LIST" },
      ],
    }),

    createMenuItem: builder.mutation({
      async queryFn(menuItemData) {
        try {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();
          if (userError || !user)
            return { error: { message: "Not authenticated" } };

          // Upload image to storage first
          const { image, ...itemData } = menuItemData;
          let imageUrl = null;

          if (image) {
            const fileExt = image.name.split(".").pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            const { data: uploadData, error: uploadError } =
              await supabase.storage
                .from("menu_images")
                .upload(fileName, image);

            if (uploadError) return { error: { message: uploadError.message } };

            const {
              data: { publicUrl },
            } = supabase.storage.from("menu_images").getPublicUrl(fileName);

            imageUrl = publicUrl;
          }

          // Create menu item record
          const { data, error } = await supabase
            .from("menu_items")
            .insert({
              title: itemData.name,
              description: itemData.description,
              price: itemData.price,
              category: itemData.category,
              stock: itemData.stock,
              prep_time_minutes: itemData.preparation_time,
              menu_img: imageUrl,
              cooker_id: user.id,
              available: true,
            })
            .select()
            .single();

          if (error) return { error };
          return { data };
        } catch (e) {
          return { error: { message: e.message } };
        }
      },
      invalidatesTags: [{ type: "MenuItems", id: "LIST" }],
    }),

    deleteMenuItem: builder.mutation({
      async queryFn(id) {
        const { data, error } = await supabase
          .from("menu_items")
          .delete()
          .eq("id", id)
          .select()
          .single();
        if (error) return { error };
        return { data };
      },
      invalidatesTags: (result, error, id) => [
        { type: "MenuItem", id },
        { type: "MenuItems", id: "LIST" },
      ],
    }),

    updateMenuItem: builder.mutation({
      async queryFn({ id, ...menuItemData }) {
        try {
          // Optional image upload
          const { image, ...itemData } = menuItemData;
          let updates = {
            title: itemData.name,
            description: itemData.description,
            price: itemData.price,
            category: itemData.category,
            stock: itemData.stock,
            prep_time_minutes: itemData.preparation_time,
          };

          if (image) {
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (!user) return { error: { message: "Not authenticated" } };

            const fileExt = image.name.split(".").pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
              .from("menu_images")
              .upload(fileName, image);

            if (uploadError) return { error: { message: uploadError.message } };

            const {
              data: { publicUrl },
            } = supabase.storage.from("menu_images").getPublicUrl(fileName);

            updates.menu_img = publicUrl;
          }

          const { data, error } = await supabase
            .from("menu_items")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

          if (error) return { error };
          return { data };
        } catch (e) {
          return { error: { message: e.message } };
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "MenuItem", id },
        { type: "MenuItems", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMyMenuItemsQuery,
  useUpdateMenuItemAvailabilityMutation,
  useDeleteMenuItemMutation,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
} = CookerMenuApi;
