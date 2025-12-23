import { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Input,
  Spinner,
  Badge,
  IconButton,
  Button,
  Grid,
  GridItem,
  Avatar,
  Separator,
  Stack,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  DialogBackdrop,
} from "@chakra-ui/react";
import {
  PaperPlaneRight,
  ChatCircleDots,
  CheckCircle,
  XCircle,
  Clock,
  CalendarBlank,
  User,
  Envelope,
  Phone,
  IdentificationCard,
} from "@phosphor-icons/react";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import {
  useGetAllConversationsQuery,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useUpdateConversationStatusMutation,
  useMarkMessagesAsReadMutation,
} from "../../app/features/Support/supportApi";
import { useGetUserDataQuery } from "../../app/features/Auth/authSlice";
import CookieService from "../../services/cookies";
import { supabase } from "../../services/supabaseClient";
import { toaster } from "../../components/ui/toaster";
import { useTranslation } from "react-i18next";

export default function AdminSupportDashboard() {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const token = CookieService.get("access_token");
  const messagesEndRef = useRef(null);

  const { data: admin } = useGetUserDataQuery(undefined, { skip: !token });

  const [statusFilter, setStatusFilter] = useState("");
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [localMessages, setLocalMessages] = useState([]);

  // User Details Popup State
  const [userDetails, setUserDetails] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const { data: conversations = [], refetch: refetchConvos } =
    useGetAllConversationsQuery(
      { status: statusFilter },
      { pollingInterval: 5000 }
    );

  const { data: messages = [], refetch: refetchMessages } =
    useGetConversationMessagesQuery(selectedConvo?.id, {
      skip: !selectedConvo?.id,
      pollingInterval: 3000,
    });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [updateStatus] = useUpdateConversationStatusMutation();
  const [markAsRead] = useMarkMessagesAsReadMutation();

  // Helper to check for today's date
  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Filter conversations
  const filteredConversations = conversations.filter((convo) => {
    if (!showAllHistory && !isToday(convo.created_at)) {
      return false;
    }
    if (statusFilter && convo.status !== statusFilter) return false;
    return true;
  });

  // Update local messages
  useEffect(() => {
    if (messages && messages.length !== localMessages.length) {
      setLocalMessages(messages);
    }
  }, [messages]);

  // Extract User Details from Messages (View Data) or Conversation Fallback
  useEffect(() => {
    if (selectedConvo) {
      // Default to conversation data
      let details = {
        name: selectedConvo.users?.name || "Unknown User",
        email: selectedConvo.users?.email || "No Email",
        phone: selectedConvo.users?.phone || "No Phone",
        avatar: selectedConvo.users?.avatar_url,
        role: selectedConvo.user_role,
        id: selectedConvo.user_id,
      };

      // Enrich with data from messages view (support_messages_with_sender) if available
      // We look for a message sent by the user (not admin)
      if (messages && messages.length > 0) {
        const userMsg = messages.find((m) => m.sender_role !== "admin");
        if (userMsg) {
          details = {
            name: userMsg.sender_name || details.name,
            email: userMsg.sender_email || details.email,
            phone: userMsg.sender_phone || details.phone,
            avatar: userMsg.sender_avatar || details.avatar,
            role: userMsg.sender_user_role || details.role,
            id: userMsg.sender_id || details.id,
          };
        }
      }
      setUserDetails(details);
    }
  }, [selectedConvo, messages]);

  // Real-time subscriptions
  useEffect(() => {
    if (!selectedConvo?.id) return;
    const channel = supabase
      .channel(`admin-support-messages-${selectedConvo.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `conversation_id=eq.${selectedConvo.id}`,
        },
        (payload) => {
          setLocalMessages((prev) => [...prev, payload.new]);
          refetchMessages();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConvo?.id]);

  useEffect(() => {
    const channel = supabase
      .channel("admin-support-conversations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_conversations" },
        () => {
          refetchConvos();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  // Mark as read
  useEffect(() => {
    if (selectedConvo?.id && admin?.id && localMessages.length > 0) {
      const hasUnread = localMessages.some(
        (msg) => !msg.is_read && msg.sender_id !== admin.id
      );
      if (hasUnread) {
        markAsRead({ conversationId: selectedConvo.id, senderId: admin.id });
      }
    }
  }, [selectedConvo?.id, admin?.id, localMessages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConvo?.id) return;
    const tempMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: selectedConvo.id,
      sender_id: admin.id,
      sender_role: "admin",
      message: messageInput,
      created_at: new Date().toISOString(),
      is_read: false,
    };
    setLocalMessages((prev) => [...prev, tempMessage]);
    setMessageInput("");
    try {
      await sendMessage({
        conversationId: selectedConvo.id,
        message: messageInput,
        senderRole: "admin",
      });
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleStatusChange = async (conversationId, newStatus) => {
    try {
      await updateStatus({
        conversationId,
        status: newStatus,
        assignedAdmin: admin.id,
      });
      toaster.create({
        title: "Success",
        description: `Conversation ${newStatus}`,
        type: "success",
        duration: 2000,
      });
      refetchConvos();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "green";
      case "pending":
        return "orange";
      case "closed":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Box h="calc(100vh - 100px)" overflow="hidden" p={4}>
      <Grid templateColumns={{ base: "1fr", md: "380px 1fr" }} gap={6} h="100%">
        {/* Sidebar: Lists */}
        <GridItem
          display="flex"
          flexDirection="column"
          bg={colorMode === "light" ? "white" : colors.dark.bgThird}
          borderRadius="xl"
          boxShadow="sm"
          border="1px solid"
          borderColor={colorMode === "light" ? "gray.100" : "gray.700"}
          overflow="hidden"
        >
          {/* Sidebar Header */}
          <Box
            p={4}
            borderBottom="1px solid"
            borderColor={colorMode === "light" ? "gray.100" : "gray.700"}
          >
            <HStack justify="space-between" mb={4}>
              <Text fontSize="xl" fontWeight="bold">
                Support Chats
              </Text>
              <Badge
                colorPalette="blue"
                variant="solid"
                borderRadius="full"
                px={2}
              >
                {filteredConversations.length}
              </Badge>
            </HStack>

            {/* Filters */}
            <Stack spacing={3}>
              <Flex
                gap={2}
                overflowX="auto"
                pb={1}
                css={{ "&::-webkit-scrollbar": { display: "none" } }}
              >
                <Button
                  size="xs"
                  variant={statusFilter === "" ? "solid" : "outline"}
                  colorPalette="blue"
                  onClick={() => setStatusFilter("")}
                  borderRadius="full"
                >
                  All Status
                </Button>
                <Button
                  size="xs"
                  variant={statusFilter === "open" ? "solid" : "outline"}
                  colorPalette="green"
                  onClick={() => setStatusFilter("open")}
                  borderRadius="full"
                >
                  Open
                </Button>
                <Button
                  size="xs"
                  variant={statusFilter === "pending" ? "solid" : "outline"}
                  colorPalette="orange"
                  onClick={() => setStatusFilter("pending")}
                  borderRadius="full"
                >
                  Pending
                </Button>
                <Button
                  size="xs"
                  variant={statusFilter === "closed" ? "solid" : "outline"}
                  colorPalette="red"
                  onClick={() => setStatusFilter("closed")}
                  borderRadius="full"
                >
                  Closed
                </Button>
              </Flex>

              {/* Date Toggle */}
              <Flex
                align="center"
                justify="space-between"
                bg={colorMode === "light" ? "gray.50" : colors.dark.bgFourth}
                p={2}
                borderRadius="lg"
                cursor="pointer"
                onClick={() => setShowAllHistory(!showAllHistory)}
                _hover={{ opacity: 0.8 }}
              >
                <HStack>
                  <CalendarBlank size={18} />
                  <Text fontSize="sm" fontWeight="medium">
                    {showAllHistory
                      ? "Showing All History"
                      : "Today's Chats Only"}
                  </Text>
                </HStack>
                <Text fontSize="xs" color="blue.500" fontWeight="bold">
                  {showAllHistory ? "Show Today" : "Show All"}
                </Text>
              </Flex>
            </Stack>
          </Box>

          {/* Conversations List */}
          <VStack
            align="stretch"
            spacing={0}
            flex="1"
            overflowY="auto"
            divider={<Separator />}
            css={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                background: colorMode === "light" ? "gray.300" : "gray.600",
                borderRadius: "4px",
              },
            }}
          >
            {filteredConversations.length === 0 ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                h="200px"
                color="gray.500"
              >
                <ChatCircleDots size={48} weight="duotone" opacity={0.5} />
                <Text mt={2} fontSize="sm">
                  No conversations found
                </Text>
              </Flex>
            ) : (
              filteredConversations.map((convo) => (
                <Box
                  key={convo.id}
                  p={6}
                  cursor="pointer"
                  bg={
                    selectedConvo?.id === convo.id
                      ? colorMode === "light"
                        ? "blue.50"
                        : "whiteAlpha.100"
                      : "transparent"
                  }
                  borderLeft="5px solid"
                  borderLeftColor={
                    selectedConvo?.id === convo.id ? "blue.500" : "transparent"
                  }
                  _hover={{
                    bg: colorMode === "light" ? "gray.50" : "whiteAlpha.50",
                  }}
                  onClick={() => setSelectedConvo(convo)}
                  transition="all 0.2s"
                >
                  <Flex justify="space-between" align="start" mb={2}>
                    <HStack spacing={4}>
                      <Avatar.Root size="md" colorPalette="blue">
                        <Avatar.Fallback name={convo.users?.name || "U"} />
                        <Avatar.Image src={convo.users?.avatar_url} />
                      </Avatar.Root>
                      <Box>
                        <Text fontWeight="bold" fontSize="md" lineHeight="1.2">
                          {convo.users?.name || "Unknown User"}
                        </Text>
                        <HStack gap={1} mt={1}>
                          <Badge
                            variant="surface"
                            size="xs"
                            colorPalette="gray"
                          >
                            {convo.user_role}
                          </Badge>
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <Clock size={12} />
                            {new Date(convo.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                        </HStack>
                      </Box>
                    </HStack>
                    <Badge
                      colorPalette={getStatusColor(convo.status)}
                      variant={convo.status === "open" ? "solid" : "subtle"}
                      size="sm"
                      borderRadius="full"
                    >
                      {convo.status}
                    </Badge>
                  </Flex>
                  <Text
                    fontSize="sm"
                    color="gray.500"
                    noOfLines={1}
                    mt={2}
                    ps={2}
                  >
                    Issue: {convo.issue_type}
                  </Text>
                </Box>
              ))
            )}
          </VStack>
        </GridItem>

        {/* Chat Area */}
        <GridItem
          display="flex"
          flexDirection="column"
          bg={colorMode === "light" ? "white" : colors.dark.bgThird}
          borderRadius="xl"
          boxShadow="sm"
          border="1px solid"
          borderColor={colorMode === "light" ? "gray.100" : "gray.700"}
          overflow="hidden"
        >
          {!selectedConvo ? (
            <Flex
              h="100%"
              direction="column"
              align="center"
              justify="center"
              color="gray.400"
            >
              <ChatCircleDots size={80} weight="thin" />
              <Text mt={4} fontSize="lg">
                Select a conversation to start chatting
              </Text>
            </Flex>
          ) : (
            <>
              {/* Chat Header */}
              <Flex
                p={4}
                borderBottom="1px solid"
                borderColor={colorMode === "light" ? "gray.100" : "gray.700"}
                align="center"
                justify="space-between"
                bg={colorMode === "light" ? "white" : colors.dark.bgThird}
              >
                {/* User Info - Clickable for Modal */}
                <Button
                  variant="ghost"
                  h="auto"
                  p={2}
                  textAlign="left"
                  onClick={() => setIsUserModalOpen(true)}
                  _hover={{
                    bg: colorMode === "light" ? "gray.50" : "whiteAlpha.100",
                  }}
                >
                  <HStack gap={3}>
                    <Avatar.Root size="md" colorPalette="blue">
                      <Avatar.Fallback
                        name={selectedConvo.users?.name || "U"}
                      />
                    </Avatar.Root>
                    <Box>
                      <Text fontWeight="bold" fontSize="md">
                        {userDetails?.name || "Unknown User"}
                      </Text>
                      <Text fontSize="xs" color="gray.500" fontWeight="normal">
                        {userDetails?.role || "user"} • Click for details
                      </Text>
                    </Box>
                  </HStack>
                </Button>

                <HStack>
                  {selectedConvo.status !== "closed" ? (
                    <Button
                      size="sm"
                      colorPalette="red"
                      variant="ghost"
                      onClick={() =>
                        handleStatusChange(selectedConvo.id, "closed")
                      }
                    >
                      <XCircle size={18} style={{ marginRight: "6px" }} />
                      Close Ticket
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      colorPalette="green"
                      variant="ghost"
                      onClick={() =>
                        handleStatusChange(selectedConvo.id, "open")
                      }
                    >
                      <CheckCircle size={18} style={{ marginRight: "6px" }} />
                      Reopen Ticket
                    </Button>
                  )}
                </HStack>
              </Flex>

              {/* Messages Area */}
              <Box
                flex="1"
                overflowY="auto"
                p={6}
                bg={colorMode === "light" ? "gray.50" : colors.dark.bgMain}
                css={{
                  "&::-webkit-scrollbar": { width: "6px" },
                  "&::-webkit-scrollbar-track": { background: "transparent" },
                  "&::-webkit-scrollbar-thumb": {
                    background: colorMode === "light" ? "gray.300" : "gray.600",
                    borderRadius: "4px",
                  },
                }}
              >
                <VStack spacing={4} align="stretch">
                  {localMessages.length === 0 && (
                    <Text
                      textAlign="center"
                      color="gray.500"
                      fontSize="sm"
                      my={10}
                    >
                      This is the start of the conversation.
                    </Text>
                  )}
                  {localMessages.map((msg, index) => {
                    const isAdmin = msg.sender_role === "admin";
                    return (
                      <Flex
                        key={index}
                        justify={isAdmin ? "flex-end" : "flex-start"}
                        mb={1}
                      >
                        <Box
                          maxW="70%"
                          bg={
                            isAdmin
                              ? colors.light.mainFixed
                              : colorMode === "light"
                              ? "white"
                              : colors.dark.bgFourth
                          }
                          color={
                            isAdmin
                              ? "white"
                              : colorMode === "light"
                              ? "gray.800"
                              : "white"
                          }
                          px={4}
                          py={3}
                          borderRadius={
                            isAdmin
                              ? "20px 20px 4px 20px"
                              : "20px 20px 20px 4px"
                          }
                          boxShadow="sm"
                        >
                          <Text fontSize="md">{msg.message}</Text>
                          <Text
                            fontSize="10px"
                            mt={1}
                            textAlign="right"
                            opacity={0.8}
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-end"
                            gap={1}
                          >
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {isAdmin && msg.is_read && (
                              <CheckCircle weight="fill" size={10} />
                            )}
                          </Text>
                        </Box>
                      </Flex>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </VStack>
              </Box>

              {/* Input Area */}
              <Box
                p={4}
                bg={colorMode === "light" ? "white" : colors.dark.bgThird}
                borderTop="1px solid"
                borderColor={colorMode === "light" ? "gray.100" : "gray.700"}
              >
                {selectedConvo.status !== "closed" ? (
                  <HStack>
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      borderRadius="full"
                      bg={
                        colorMode === "light"
                          ? "gray.100"
                          : colors.dark.bgFourth
                      }
                      border="none"
                      py={3}
                      px={5}
                      _focus={{
                        ring: "2px solid",
                        ringColor: "blue.500",
                        bg: "transparent",
                      }}
                    />
                    <IconButton
                      rounded="full"
                      colorPalette="blue"
                      size="xl"
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || isSending}
                      bg={colors.light.mainFixed}
                      _hover={{ bg: colors.light.mainFixed70a }}
                    >
                      {isSending ? (
                        <Spinner size="sm" color="white" />
                      ) : (
                        <PaperPlaneRight
                          weight="fill"
                          color="white"
                          size={20}
                        />
                      )}
                    </IconButton>
                  </HStack>
                ) : (
                  <Flex
                    bg={colorMode === "light" ? "red.50" : "red.900"}
                    p={3}
                    borderRadius="xl"
                    align="center"
                    justify="center"
                    color="red.500"
                    fontWeight="medium"
                    gap={2}
                  >
                    <XCircle size={20} />
                    This conversation is closed. Reopen to reply.
                  </Flex>
                )}
              </Box>
            </>
          )}

          {/* User Details Modal (Popup) */}
          <DialogRoot
            open={isUserModalOpen}
            onOpenChange={(e) => setIsUserModalOpen(e.open)}
            size="lg"
            placement="center"
          >
            <DialogBackdrop />
            <DialogContent
              bg={colorMode === "light" ? "white" : colors.dark.bgThird}
              borderRadius="xl"
              overflow="hidden"
              boxShadow="xl"
              maxHeight="500px"
              overflowY="auto"
            >
              <DialogHeader
                bg={colorMode === "light" ? "gray.50" : colors.dark.bgFourth}
                p={6}
                borderBottomWidth="1px"
              >
                <DialogCloseTrigger top="20px" right="20px" />
                <DialogTitle fontSize="lg" fontWeight="bold" textAlign="center">
                  User Details
                </DialogTitle>
              </DialogHeader>
              <DialogBody p={8}>
                <VStack spacing={8} align="stretch">
                  <VStack spacing={4} align="center">
                    <Avatar.Root
                      colorPalette="blue"
                      css={{ width: "100px", height: "100px" }}
                    >
                      <Avatar.Fallback
                        name={userDetails?.name || "U"}
                        fontSize="2.5rem"
                      />
                      <Avatar.Image src={userDetails?.avatar} />
                    </Avatar.Root>
                    <VStack spacing={0} align="center">
                      <Text fontSize="2xl" fontWeight="bold">
                        {userDetails?.name || "Unknown User"}
                      </Text>
                      <Badge
                        size="lg"
                        colorPalette="blue"
                        variant="solid"
                        borderRadius="full"
                        mt={2}
                        px={4}
                      >
                        {userDetails?.role || "customer"}
                      </Badge>
                    </VStack>
                  </VStack>

                  <Separator />

                  <Grid templateColumns="repeat(1, 1fr)" gap={4}>
                    {/* Email */}
                    <Box
                      p={4}
                      borderRadius="lg"
                      bg={
                        colorMode === "light" ? "gray.50" : colors.dark.bgFourth
                      }
                      borderWidth="1px"
                      borderColor={
                        colorMode === "light" ? "gray.200" : "gray.700"
                      }
                    >
                      <HStack spacing={4}>
                        <Box
                          p={3}
                          bg={colorMode === "light" ? "blue.100" : "blue.900"}
                          borderRadius="full"
                          color="blue.600"
                        >
                          <Envelope size={24} weight="fill" />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500" mb={1}>
                            Email Address
                          </Text>
                          <Text fontWeight="semibold" fontSize="lg">
                            {userDetails?.email || "N/A"}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>

                    {/* Phone */}
                    <Box
                      p={4}
                      borderRadius="lg"
                      bg={
                        colorMode === "light" ? "gray.50" : colors.dark.bgFourth
                      }
                      borderWidth="1px"
                      borderColor={
                        colorMode === "light" ? "gray.200" : "gray.700"
                      }
                    >
                      <HStack spacing={4}>
                        <Box
                          p={3}
                          bg={colorMode === "light" ? "green.100" : "green.900"}
                          borderRadius="full"
                          color="green.600"
                        >
                          <Phone size={24} weight="fill" />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500" mb={1}>
                            Phone Number
                          </Text>
                          <Text fontWeight="semibold" fontSize="lg">
                            {userDetails?.phone || "N/A"}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>

                    {/* User ID */}
                    <Box
                      p={4}
                      borderRadius="lg"
                      bg={
                        colorMode === "light" ? "gray.50" : colors.dark.bgFourth
                      }
                      borderWidth="1px"
                      borderColor={
                        colorMode === "light" ? "gray.200" : "gray.700"
                      }
                    >
                      <HStack spacing={4}>
                        <Box
                          p={3}
                          bg={
                            colorMode === "light" ? "purple.100" : "purple.900"
                          }
                          borderRadius="full"
                          color="purple.600"
                        >
                          <IdentificationCard size={24} weight="fill" />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.500" mb={1}>
                            User ID
                          </Text>
                          <Text
                            fontWeight="medium"
                            fontSize="md"
                            userSelect="all"
                            fontFamily="mono"
                          >
                            {userDetails?.id || "N/A"}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  </Grid>
                </VStack>
              </DialogBody>
            </DialogContent>
          </DialogRoot>
        </GridItem>
      </Grid>
    </Box>
  );
}
