import { useState } from "react";
import { Box, Menu, Portal, Text, Icon, HStack } from "@chakra-ui/react";
import { MdHeadsetMic } from "react-icons/md";
import { RiAlarmWarningFill } from "react-icons/ri";
import { motion } from "framer-motion";
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
  const [isOpen, setIsOpen] = useState(false);

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
      <Menu.Root
        positioning={{ placement: "top-end" }}
        onOpenChange={(details) => setIsOpen(details.open)}
      >
        <Menu.Trigger asChild>
          <motion.div
            style={{
              cursor: "pointer",
              background:
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed,
              borderRadius: "50%",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "60px",
              height: "60px",
            }}
            animate={
              isOpen
                ? {
                    // Pulse blur effect when open
                    scale: [1, 1.08, 1],
                    boxShadow: [
                      `0px 0px 20px 5px ${
                        colorMode === "light"
                          ? "rgba(255, 107, 0, 0.4)"
                          : "rgba(255, 107, 0, 0.5)"
                      }`,
                      `0px 0px 35px 10px ${
                        colorMode === "light"
                          ? "rgba(255, 107, 0, 0.6)"
                          : "rgba(255, 107, 0, 0.7)"
                      }`,
                      `0px 0px 20px 5px ${
                        colorMode === "light"
                          ? "rgba(255, 107, 0, 0.4)"
                          : "rgba(255, 107, 0, 0.5)"
                      }`,
                    ],
                  }
                : {
                    // Floating effect when closed
                    y: [0, -10, 0],
                    boxShadow: [
                      `0px 4px 20px ${
                        colorMode === "light"
                          ? "rgba(0, 0, 0, 0.1)"
                          : "rgba(0, 0, 0, 0.3)"
                      }`,
                      `0px 8px 30px ${
                        colorMode === "light"
                          ? "rgba(0, 0, 0, 0.2)"
                          : "rgba(0, 0, 0, 0.4)"
                      }`,
                      `0px 4px 20px ${
                        colorMode === "light"
                          ? "rgba(0, 0, 0, 0.1)"
                          : "rgba(0, 0, 0, 0.3)"
                      }`,
                    ],
                  }
            }
            transition={{
              duration: isOpen ? 1.5 : 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.15,
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.5 },
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            <motion.div
              animate={{
                rotate: isOpen ? 0 : [0, 15, -15, 0],
              }}
              transition={{
                duration: 3,
                repeat: isOpen ? 0 : Infinity,
                ease: "easeInOut",
              }}
            >
              <MdHeadsetMic size={32} color="white" />
            </motion.div>
          </motion.div>
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
                <HStack gap={2} mb={1}>
                  <Icon as={RiAlarmWarningFill} boxSize={5} color="red.500" />
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={colorMode === "light" ? "gray.700" : "gray.200"}
                  >
                    Report an Issue
                  </Text>
                </HStack>
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
                    bg:
                      colorMode === "light"
                        ? colors.light.bgFourth
                        : colors.dark.bgFourth,
                  }}
                  transition="all 0.2s"
                >
                  <Box display="flex" alignItems="center" gap={3}>
                    <Box
                      bg={
                        colorMode === "light"
                          ? colors.light.bgFourth
                          : colors.dark.bgFourth
                      }
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
                          colorMode === "light"
                            ? colors.light.mainFixed
                            : colors.dark.mainFixed
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
