import { useState, useEffect, useRef } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  IconButton,
  Avatar,
  Circle,
  Icon,
  Portal,
  Badge
} from "@chakra-ui/react";
import logo from "../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { RiSendPlane2Fill, RiCloseLine } from "react-icons/ri";
import { BiSupport } from "react-icons/bi";
import { useColorMode } from "../theme/color-mode";
import colors from "../theme/color";
import { useGetUserDataQuery } from "../app/features/Auth/authSlice";
import {
  useGetOrCreateConversationMutation,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
  useGetUnreadCountQuery,
} from "../app/features/Support/supportApi";
import { supabase } from "../services/supabaseClient";
import CookieService from "../services/cookies";

const MotionBox = motion(Box);

const ChatSupport = () => {
  const { t, i18n } = useTranslation();
  const { colorMode } = useColorMode();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [localUnreadCount, setLocalUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  const token = CookieService.get("access_token");
  const { data: user } = useGetUserDataQuery(undefined, {
    skip: !token,
  });

  // API Hooks
  const [getOrCreateConversation] = useGetOrCreateConversationMutation();
  const [sendMessageMutation] = useSendMessageMutation();
  const [markAsRead] = useMarkMessagesAsReadMutation();
  
  // Queries
  const { data: initialMessages } = useGetConversationMessagesQuery(conversation?.id, {
    skip: !conversation?.id,
  });

  const { data: unreadCountQueryResult = 0, refetch: refetchUnreadCount } = useGetUnreadCountQuery(conversation?.id, {
    skip: !conversation?.id,
    pollingInterval: 30000,
  });
  
  // Initialize local count from server once when conversation is ready
  useEffect(() => {
    if (conversation?.id && unreadCountQueryResult > 0 && localUnreadCount === 0 && !isOpen) {
      setLocalUnreadCount(unreadCountQueryResult);
    }
  }, [unreadCountQueryResult, conversation?.id]);

  // Reset local count immediately and trigger marking as read
  const handleChatToggle = async () => {
    const switchingToOpen = !isOpen;
    
    if (switchingToOpen) {
      setLocalUnreadCount(0);
      if (conversation?.id && user?.id) {
        try {
          await markAsRead({ conversationId: conversation.id, senderId: user.id }).unwrap();
          refetchUnreadCount();
        } catch (err) {
          console.error("Failed to mark messages as read:", err);
        }
      }
    }
    setIsOpen(switchingToOpen);
  };

  // Get/Create conversation on mount or login
  useEffect(() => {
    if (user && token) {
      const initChat = async () => {
        try {
          const result = await getOrCreateConversation().unwrap();
          setConversation(result);
        } catch (err) {
          console.error("Failed to init support conversation:", err);
        }
      };
      initChat();
    }
  }, [user, token, getOrCreateConversation]);

  // Set initial messages and prepend UI-only welcome message
  useEffect(() => {
    const welcomeMsg = {
      id: "welcome-msg",
      text: t("chat.welcome"),
      sender: "support",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      is_read: true,
      is_fake: true
    };

    if (initialMessages) {
      const formattedMessages = initialMessages.map(msg => ({
        id: msg.id,
        text: msg.message,
        sender: msg.sender_role === "admin" ? "support" : "user",
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_read: msg.is_read
      }));
      setMessages([welcomeMsg, ...formattedMessages]);
    } else {
      setMessages([welcomeMsg]);
    }
  }, [initialMessages, t]);

  // Real-time subscription
  useEffect(() => {
    if (!conversation?.id) return;

    const channel = supabase
      .channel(`support-chat-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const newMessage = payload.new;
          
          setMessages((prev) => {
            if (prev.find(m => m.id === newMessage.id)) return prev;
            
            const msg = {
              id: newMessage.id,
              text: newMessage.message,
              sender: newMessage.sender_role === "admin" ? "support" : "user",
              time: new Date(newMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              is_read: newMessage.is_read
            };
            return [...prev, msg];
          });

          if (newMessage.sender_role === "admin") {
            if (isOpen && user?.id) {
              markAsRead({ conversationId: conversation.id, senderId: user.id });
              setTimeout(() => refetchUnreadCount(), 500);
            } else {
              setLocalUnreadCount(prev => prev + 1);
            }
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "support_messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        () => refetchUnreadCount()
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "support_conversations",
          filter: `id=eq.${conversation.id}`,
        },
        (payload) => {
          if (payload.new.status === "closed") {
            setConversation(null);
            setMessages([]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation?.id, isOpen, markAsRead, refetchUnreadCount, user?.id]);

  // Mark status as read when open and messages change
  useEffect(() => {
    if (isOpen && conversation?.id && user?.id) {
      markAsRead({ conversationId: conversation.id, senderId: user.id });
      const timer = setTimeout(() => refetchUnreadCount(), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, conversation?.id, user?.id, messages.length, markAsRead, refetchUnreadCount]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!message.trim() || !conversation?.id) return;

    const textToSend = message;
    setMessage("");

    try {
      await sendMessageMutation({
        conversationId: conversation.id,
        message: textToSend,
        senderRole: user.role || "customer",
      }).unwrap();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const themeColors = colorMode === "light" ? colors.light : colors.dark;
  const isRtl = i18n.language === "ar";
  const shouldShowBadge = !isOpen && localUnreadCount > 0;

  return (
    <Box position="fixed" bottom="20px" right={isRtl ? "unset" : "20px"} left={isRtl ? "20px" : "unset"} zIndex="9999">
      <Portal>
        <AnimatePresence>
          {isOpen && (
            <MotionBox
              initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: isRtl ? "bottom left" : "bottom right" }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              position="fixed"
              bottom="90px"
              right={isRtl ? "unset" : "20px"}
              left={isRtl ? "20px" : "unset"}
              width={{ base: "320px", sm: "380px" }}
              maxHeight="calc(100vh - 120px)"
              height="auto"
              bg={themeColors.bgThird}
              borderRadius="24px"
              boxShadow="2xl"
              overflow="hidden"
              display="flex"
              flexDirection="column"
              border="1px solid"
              borderColor={themeColors.border1}
              zIndex="10000"
            >
              <Box p={4} bg={themeColors.mainFixed} color="white" borderBottom="1px solid rgba(255,255,255,0.1)">
                <HStack justify="space-between" align="center">
                  <HStack gap={3}>
                    <Box position="relative" display="inline-block">
                      <Avatar.Root size="sm" border="2px solid white">
                        <Avatar.Fallback name="Support" />
                        <Avatar.Image src={logo} />
                      </Avatar.Root>
                      <Box
                        position="absolute"
                        bottom="0"
                        right="0"
                        boxSize="10px"
                        bg="green.400"
                        borderRadius="full"
                        border="2px solid"
                        borderColor={themeColors.mainFixed}
                      />
                    </Box>
                    <VStack align="start" gap={0}>
                      <Text fontWeight="bold" fontSize="md" lineHeight="short">{t("chat.supportTeam")}</Text>
                      <Text fontSize="xs" opacity={0.9}>{t("chat.onlineStatus")}</Text>
                    </VStack>
                  </HStack>
                  <IconButton
                    aria-label="Close chat"
                    variant="ghost"
                    color="white"
                    _hover={{ bg: "whiteAlpha.300" }}
                    onClick={handleChatToggle}
                    size="sm"
                  >
                    <Icon as={RiCloseLine} boxSize={5} />
                  </IconButton>
                </HStack>
              </Box>

              <VStack
                flex={1}
                overflowY="auto"
                p={4}
                gap={4}
                align="stretch"
                css={{
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-thumb': { background: themeColors.border1, borderRadius: '10px' },
                }}
              >
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    alignSelf={msg.sender === "user" ? "flex-end" : "flex-start"}
                    maxWidth="80%"
                  >
                    <Box
                      bg={msg.sender === "user" ? themeColors.mainFixed : themeColors.bgSecond}
                      color={msg.sender === "user" ? "white" : themeColors.textMain}
                      px={4}
                      py={2}
                      borderRadius={
                        msg.sender === "user"
                          ? (isRtl ? "20px 20px 0 20px" : "20px 20px 20px 0")
                          : (isRtl ? "18px 18px 18px 2px" : "18px 18px 2px 18px")
                      }
                      boxShadow="sm"
                    >
                      <Text fontSize="sm" wordBreak="break-word">{msg.text}</Text>
                    </Box>
                    <Text fontSize="10px" color={themeColors.textSub} mt={1} textAlign={msg.sender === "user" ? "end" : "start"}>
                      {msg.time}
                    </Text>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </VStack>

              <Box p={4} borderTop="1px solid" borderColor={themeColors.border1} bg={themeColors.bgThird}>
                <HStack gap={2}>
                  <Input
                    placeholder={t("chat.placeholder")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    borderRadius="full"
                    bg={themeColors.bgInput}
                    border="none"
                    _focus={{ boxShadow: "none", bg: themeColors.white6a }}
                    fontSize="sm"
                    h="40px"
                  />
                  <IconButton
                    aria-label="Send message"
                    onClick={handleSendMessage}
                    borderRadius="full"
                    bg={themeColors.mainFixed}
                    color="white"
                    _hover={{ bg: themeColors.mainFixed70a, transform: "scale(1.05)" }}
                    _active={{ transform: "scale(0.95)" }}
                    transition="all 0.2s"
                    size="md"
                    h="40px"
                    w="40px"
                  >
                    <Icon as={RiSendPlane2Fill} boxSize={5} color="white" />
                  </IconButton>
                </HStack>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>
      </Portal>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleChatToggle}
        style={{ cursor: "pointer" }}
      >
        <Circle
          size="60px"
          bg={themeColors.mainFixed}
          color="white"
          boxShadow="0px 10px 25px rgba(250, 44, 35, 0.4)"
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {shouldShowBadge && (
            <Badge
              as={motion.div}
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              position="absolute"
              top="-2px"
              right="-2px"
              bg="red.500"
              color="white"
              borderRadius="full"
              boxSize="22px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
              fontWeight="bold"
              border="2px solid"
              borderColor={themeColors.mainFixed}
              zIndex="10"
            >
              {localUnreadCount > 9 ? "9+" : localUnreadCount}
            </Badge>
          )}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <RiCloseLine size={30} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <BiSupport size={28} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {!isOpen && (
            <Box
              as={motion.div}
              position="absolute"
              inset="-2px"
              borderRadius="full"
              border="2px solid"
              borderColor={themeColors.mainFixed}
              animate={{
                scale: [1, 1.4, 1.6],
                opacity: [0.5, 0.2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          )}
        </Circle>
      </motion.div>
    </Box>
  );
};

export default ChatSupport;
