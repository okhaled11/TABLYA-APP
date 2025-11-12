import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { supabase } from '../../../services/supabaseClient'

export const AdminUserSlice = createApi({
  reducerPath: 'AdminuserSliceApi',
  baseQuery: fakeBaseQuery(), 
  tagTypes: ['Users'], 
  endpoints: (builder) => ({
    getUsers: builder.query({
      async queryFn() {
        const { data, error } = await supabase.from('users').select('*')
        if (error) return { error }
        return { data }
      },
      providesTags: ['Users'],
    }),

    addUser: builder.mutation({
      async queryFn(newUser) {
        const { data, error } = await supabase.from('users').insert([newUser])
        if (error) return { error }
        return { data }
      },
      invalidatesTags: ['Users'],
    }),

    updateUser: builder.mutation({
      async queryFn(user) {
        const { data, error } = await supabase.from('users').update(user).eq('id', user.id)
        if (error) return { error }
        return { data }
      },
      invalidatesTags: ['Users'],
    }),

    deleteUser: builder.mutation({
      async queryFn(id) {
        const { data, error } = await supabase.from('users').delete().eq('id', id)
        if (error) return { error }
        return { data }
      },
      invalidatesTags: ['Users'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = AdminUserSlice
