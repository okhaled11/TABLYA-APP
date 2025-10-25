// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// export const Posts = createApi({
//     reducerPath: "Posts",
//     tagTypes: ["allPosts"],
//     refetchOnReconnect: true,
//     refetchOnMountOrArgChange: true,
//     baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
//     endpoints: (builder) => ({
//         getAllPosts: builder.query({
//             query: () => ({
//                 url: "/posts",
//                 method: "GET",
//             }),
//             providesTags: ["allPosts"],
//         }),
//         addPost: builder.mutation({
//             query: (newPost) => ({
//                 url: "/posts",
//                 method: "POST",
//                 body: newPost,
//             }),
//             invalidatesTags: ["allPosts"],
//         }),
//         deletePost: builder.mutation({
//             query: (deleteId) => ({
//                 url: `/posts/${deleteId}`,
//                 method: "DELETE",
//                 // headers: {
//                 //   Authorization: `Bearer ${Cookies.get('name')}`,
//                 // },
//             }),
//             invalidatesTags: ["allPosts"],
//         }),
//         updatePost: builder.mutation({
//             query: (post) => ({
//                 url: `/posts/${post.id}`,
//                 method: "PUT",
//                 body: post,
//             }),
//             invalidatesTags: ["allPosts"],
//         }),
//         updatePostNaga: builder.mutation({
//             query: ({ id, body }) => ({
//                 url: `/posts/${id}`,
//                 method: "PUT",
//                 body,
//                 headers: {
//                     Authorization: `Bearer ${Cookies.get("name")}`,
//                 },
//             }),
//             async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
//                 const patchResult = dispatch(
//                     Posts.util.updateQueryData("getAllPosts ", id, (draft) => {
//                         Object.assign(draft, patch);
//                     })
//                 );
//                 try {
//                     await queryFulfilled;
//                 } catch {
//                     patchResult.undo();
//                 }
//             },

//             invalidatesTags: ["allPosts"],
//         }),
//     }),
// });

// export const {
//     useGetAllPostsQuery,
//     useAddPostMutation,
//     useUpdatePostMutation,
//     useDeletePostMutation,
//     useUpdatePostNagaMutation,
// } = Posts;
