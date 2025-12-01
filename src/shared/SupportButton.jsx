import React from "react";
import { IconButton, Box, Menu, Portal, Text, Icon } from "@chakra-ui/react";
import { MdSupportAgent } from "react-icons/md";
import {
  FaRoad,
  FaCarCrash,
  FaTools,
  FaExclamationTriangle,
  FaPhoneSlash,
  FaQuestionCircle,
} from "react-icons/fa";
import { useColorMode } from "../theme/color-mode";
import colors from "../theme/color";
import { useGetUserDataQuery } from "../app/features/Auth/authSlice";
import CookieService from "../services/cookies";

// WhatsApp support number
const SUPPORT_NUMBER = "201021459497";

const supportIssues = [
  {
    id: "road",
    label: "Road Problem",
    icon: FaRoad,
    message:
      "السلام عليكم، أنا عندي مشكلة في الطريق. الطريق مقفول ومش قادر أوصل للعميل.",
  },
  {
    id: "traffic",
    label: "Heavy Traffic",
    icon: FaCarCrash,
    message:
      "السلام عليكم، أنا واقف في زحمة شديدة ومش هقدر أوصل الأوردر في الوقت المحدد.",
  },
  {
    id: "vehicle",
    label: "Vehicle Issue",
    icon: FaTools,
    message: "السلام عليكم،  عندي عطل ومحتاج مساعدة.",
  },
  {
    id: "accident",
    label: "Accident",
    icon: FaExclamationTriangle,
    message: "السلام عليكم، حصلي حادثة في الطريق ومش قادر أكمل التوصيل.",
  },
  {
    id: "unreachable",
    label: "Customer Unreachable",
    icon: FaPhoneSlash,
    message: "السلام عليكم، العميل مش بيرد على التليفون ومش عارف أوصله.",
  },
  {
    id: "other",
    label: "Other Issue",
    icon: FaQuestionCircle,
    message: "السلام عليكم،عندي مشكله ومحتاج مساعدة في التوصيل.",
  },
];

const SupportButton = () => {
  const { colorMode } = useColorMode();

  // Get current user data
  const token = CookieService.get("access_token");
  const { data: user } = useGetUserDataQuery(undefined, {
    skip: !token,
  });

  const handleIssueClick = (issue) => {
    // Add delivery person info to the message
    const deliveryInfo = `الاسم: ${user?.name || "غير متوفر"}\nالتليفون: ${
      user?.phone || "غير متوفر"
    }\n\n`;
    const fullMessage = deliveryInfo + issue.message;
    const encodedMessage = encodeURIComponent(fullMessage);
    // Open WhatsApp with pre-filled message
    window.open(
      `https://wa.me/${SUPPORT_NUMBER}?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <Box position="fixed" bottom="20px" right="20px" zIndex="9999">
      <Menu.Root positioning={{ placement: "top-end" }}>
        <Menu.Trigger asChild>
          <IconButton
            aria-label="Customer Support"
            borderRadius="full"
            size="lg"
            bg={`linear-gradient(135deg,${
              colorMode === "light"
                ? colors.light.mainFixed
                : colors.dark.mainFixed
            } 0%, #764ba2 100%)`}
            color="white"
            _hover={{
              bg: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
              transform: "scale(1.15)",
            }}
            _active={{
              transform: "scale(0.95)",
            }}
            boxShadow="0px 8px 20px rgba(102, 126, 234, 0.4)"
            width="65px"
            height="65px"
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            css={{
              "@keyframes pulse": {
                "0%, 100%": {
                  boxShadow: "0px 8px 20px rgba(102, 126, 234, 0.4)",
                  transform: "scale(1)",
                },
                "50%": {
                  boxShadow: "0px 8px 30px rgba(102, 126, 234, 0.6)",
                  transform: "scale(1.08)",
                },
              },
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            <MdSupportAgent size={35} />
          </IconButton>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content
              bg={colorMode === "light" ? "white" : "#1a202c"}
              borderRadius="12px"
              boxShadow="0px 10px 40px rgba(0, 0, 0, 0.2)"
              minWidth="280px"
              p={2}
              border="1px solid"
              borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
            >
              <Box p={2} pb={1}>
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={colorMode === "light" ? "gray.700" : "gray.200"}
                  mb={1}
                >
                  🚨 Report an Issue
                </Text>
                <Text
                  fontSize="xs"
                  color={colorMode === "light" ? "gray.500" : "gray.400"}
                  mb={2}
                >
                  Select the issue you're facing
                </Text>
              </Box>

              {supportIssues.map((issue) => (
                <Menu.Item
                  key={issue.id}
                  value={issue.id}
                  onClick={() => handleIssueClick(issue)}
                  cursor="pointer"
                  borderRadius="8px"
                  p={3}
                  _hover={{
                    bg: colorMode === "light" ? "purple.50" : "purple.900",
                  }}
                  transition="all 0.2s"
                >
                  <Box display="flex" alignItems="center" gap={3}>
                    <Box
                      bg={colorMode === "light" ? "purple.100" : "purple.800"}
                      p={2}
                      borderRadius="8px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon
                        as={issue.icon}
                        boxSize={5}
                        color={
                          colorMode === "light" ? "purple.600" : "purple.300"
                        }
                      />
                    </Box>
                    <Box flex={1}>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color={colorMode === "light" ? "gray.800" : "gray.100"}
                      >
                        {issue.label}
                      </Text>
                    </Box>
                  </Box>
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Box>
  );
};

export default SupportButton;
