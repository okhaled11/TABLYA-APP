import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../../services/supabaseClient";

export const supportApi = createApi({
  reducerPath: "supportApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["SupportConversations", "SupportMessages"],
  endpoints: (builder) => ({
    // Get or create conversation for current user
    getOrCreateConversation: builder.mutation({
      async queryFn() {
        try {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            return { error: { message: "User not authenticated" } };
          }

          // Get user role from metadata
          const userRole = user.user_metadata?.role || "customer";

          // Check if user has an open conversation
          const { data: existingConvo, error: fetchError } = await supabase
            .from("support_conversations")
            .select("*")
            .eq("user_id", user.id)
            .neq("status", "closed")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (fetchError && fetchError.code !== "PGRST116") {
            return { error: { message: fetchError.message } };
          }

          if (existingConvo) {
            return { data: existingConvo };
          }

          // Create new conversation
          const { data: newConvo, error: createError } = await supabase
            .from("support_conversations")
            .insert([
              {
                user_id: user.id,
                user_role: userRole,
                issue_type: "other",
                status: "open",
              },
            ])
            .select()
            .single();

          if (createError) {
            return { error: { message: createError.message } };
          }

          return { data: newConvo };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: ["SupportConversations"],
    }),

    // Get all conversations (for admin)
    getAllConversations: builder.query({
      async queryFn({ status } = {}) {
        try {
          // 1. Fetch conversations
          let query = supabase
            .from("support_conversations")
            .select("*")
            .order("created_at", { ascending: false });

          if (status) {
            query = query.eq("status", status);
          }

          const { data: conversations, error: convError } = await query;

          if (convError) {
            return { error: { message: convError.message } };
          }

          // 2. Fetch related users manually
          if (!conversations || conversations.length === 0) {
            return { data: [] };
          }

          const userIds = [
            ...new Set(conversations.map((c) => c.user_id).filter(Boolean)),
          ];

          if (userIds.length === 0) {
            return { data: conversations };
          }

          const { data: users, error: userError } = await supabase
            .from("users")
            .select("id, name, avatar_url, email, role")
            .in("id", userIds);

          if (userError) {
            console.error("Error fetching users:", userError);
            // Return conversations without user details if user fetch fails
            return { data: conversations };
          }

          // 3. Merge data
          const usersMap = (users || []).reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
          }, {});

          const enrichedConversations = conversations.map((convo) => ({
            ...convo,
            users: usersMap[convo.user_id] || null,
          }));

          return { data: enrichedConversations };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      providesTags: ["SupportConversations"],
    }),

    // Get messages for a conversation
    getConversationMessages: builder.query({
      async queryFn(conversationId) {
        try {
          const { data, error } = await supabase
            .from("support_messages_with_sender")
            .select("*")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true });

          if (error) {
            return { error: { message: error.message } };
          }

          return { data };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      providesTags: (result, error, conversationId) => [
        { type: "SupportMessages", id: conversationId },
      ],
    }),

    // Send message
    sendMessage: builder.mutation({
      async queryFn({ conversationId, message, senderRole }) {
        try {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            return { error: { message: "User not authenticated" } };
          }

          const { data, error } = await supabase
            .from("support_messages")
            .insert([
              {
                conversation_id: conversationId,
                sender_id: user.id,
                sender_role: senderRole,
                message,
                is_read: false,
              },
            ])
            .select()
            .single();

          if (error) {
            return { error: { message: error.message } };
          }

          // Update conversation status to pending if it's from user
          if (senderRole !== "admin") {
            await supabase
              .from("support_conversations")
              .update({ status: "pending" })
              .eq("id", conversationId);
          }

          return { data };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: (result, error, { conversationId }) => [
        { type: "SupportMessages", id: conversationId },
      ],
    }),

    // Mark messages as read
    markMessagesAsRead: builder.mutation({
      async queryFn({ conversationId, senderId }) {
        try {
          const { error } = await supabase
            .from("support_messages")
            .update({ is_read: true })
            .eq("conversation_id", conversationId)
            .neq("sender_id", senderId);

          if (error) {
            return { error: { message: error.message } };
          }

          return { data: { success: true } };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: (result, error, { conversationId }) => [
        { type: "SupportMessages", id: conversationId },
      ],
    }),

    // Update conversation status (admin only)
    updateConversationStatus: builder.mutation({
      async queryFn({ conversationId, status, assignedAdmin }) {
        try {
          const updates = { status };

          if (status === "closed") {
            updates.closed_at = new Date().toISOString();
          }

          if (assignedAdmin !== undefined) {
            updates.assigned_admin = assignedAdmin;
          }

          const { data, error } = await supabase
            .from("support_conversations")
            .update(updates)
            .eq("id", conversationId)
            .select()
            .single();

          if (error) {
            return { error: { message: error.message } };
          }

          return { data };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: ["SupportConversations"],
    }),

    // Get unread message count for a conversation
    getUnreadCount: builder.query({
      async queryFn(conversationId) {
        try {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user) {
            return { error: { message: "User not authenticated" } };
          }

          const { count, error } = await supabase
            .from("support_messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", conversationId)
            .eq("is_read", false)
            .neq("sender_id", user.id);

          if (error) {
            return { error: { message: error.message } };
          }

          return { data: count || 0 };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      providesTags: (result, error, conversationId) => [
        { type: "SupportMessages", id: conversationId },
      ],
    }),
  }),
});

export const {
  useGetOrCreateConversationMutation,
  useGetAllConversationsQuery,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
  useUpdateConversationStatusMutation,
  useGetUnreadCountQuery,
} = supportApi;
