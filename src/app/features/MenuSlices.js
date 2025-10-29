import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../services/supabaseClient";

// Using fakeBaseQuery because we’re not hitting a REST API — we’ll use Supabase JS directly
export const supabaseApi = createApi({
  reducerPath: "supabaseApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Users", "Orders", "MenuItems"],
  endpoints: (builder) => ({
    
    addMenuItem: builder.mutation({
      async queryFn(newItem) {
        const { data, error } = await supabase
          .from("menu_items")
          .insert([newItem])
          .select();
        if (error) return { error };
        return { data };
      },
      invalidatesTags: ["MenuItems"],
    }),

    
    getMenuItems: builder.query({
      async queryFn() {
        const { data, error } = await supabase.from("menu_items").select("*");
        if (error) return { error };
        return { data };
      },
      providesTags: ["MenuItems"],
    }),

   
    addOrder: builder.mutation({
      async queryFn(newOrder) {
        const { data, error } = await supabase
          .from("orders")
          .insert([newOrder])
          .select();
        if (error) return { error };
        return { data };
      },
      invalidatesTags: ["Orders"],
    }),

    // Users endpoints
    getUsers: builder.query({
      async queryFn() {
        const { data, error } = await supabase.from('users').select('*');
        if (error) return { error };
        return { data };
      },
      providesTags: ['Users'],
    }),

    addUser: builder.mutation({
      async queryFn(newUser) {
        const { data, error } = await supabase.from('users').insert([newUser]);
        if (error) return { error };
        return { data };
      },
      invalidatesTags: ['Users'],
    }),

    deleteUser: builder.mutation({
      async queryFn(id) {
        const { data, error } = await supabase.from('users').delete().eq('id', id);
        if (error) return { error };
        return { data };
      },
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useAddMenuItemMutation,
  useGetMenuItemsQuery,
  useAddOrderMutation,
  useGetUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
} = supabaseApi;
