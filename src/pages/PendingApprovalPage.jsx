import {
  Flex,
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Container,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "../theme/color-mode";
import colors from "../theme/color";
import { FaClock, FaEnvelope, FaHome } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import Navbar from "../layout/Navbar";
import Footer from "../shared/Footer";
import { useTranslation } from "react-i18next";

const PendingApprovalPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bg={colorMode === "light" ? colors.light.bgMain : colors.dark.bgMain}
        px={4}
        py={10}
      >
        <Container maxW="2xl">
          <Box
            bg={
              colorMode === "light" ? colors.light.bgThird : colors.dark.bgFixed
            }
            borderRadius="2xl"
            p={{ base: 8, md: 12 }}
            boxShadow="2xl"
            textAlign="center"
          >
            <VStack gap={6}>
              {/* Icon Animation */}
              <Box
                position="relative"
                w="120px"
                h="120px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  position="absolute"
                  w="100%"
                  h="100%"
                  borderRadius="full"
                  bg={colorMode === "light" ? "orange.100" : "orange.900"}
                  opacity={0.3}
                  animation="pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                />
                <Box
                  position="relative"
                  w="80px"
                  h="80px"
                  borderRadius="full"
                  bg={colorMode === "light" ? "orange.200" : "orange.800"}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <MdPendingActions
                    size={48}
                    color={colorMode === "light" ? "#C05621" : "#FBD38D"}
                  />
                </Box>
              </Box>

              {/* Title */}
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
              >
                {t("pendingApproval.title")}
              </Heading>

              {/* Description */}
              <VStack gap={3} maxW="md">
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color={colorMode === "light" ? "gray.600" : "gray.400"}
                  lineHeight="tall"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t("pendingApproval.description")}
                </Text>

                <Box
                  w="full"
                  p={4}
                  bg={colorMode === "light" ? "orange.50" : "orange.900"}
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={
                    colorMode === "light" ? "orange.400" : "orange.600"
                  }
                >
                  <Flex align="center" gap={3} mb={2}>
                    <FaClock
                      size={20}
                      color={colorMode === "light" ? "#C05621" : "#FBD38D"}
                    />
                    <Text
                      fontWeight="semibold"
                      color={
                        colorMode === "light" ? "orange.800" : "orange.200"
                      }
                    >
                      {t("pendingApproval.whatNext")}
                    </Text>
                  </Flex>
                  <Text
                    fontSize="sm"
                    color={colorMode === "light" ? "orange.700" : "orange.300"}
                    textAlign={isRTL ? "right" : "left"}
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {t("pendingApproval.whatNextDescription")}
                  </Text>
                </Box>
              </VStack>

              {/* Action Buttons */}
              <VStack gap={3} w="full" maxW="sm" mt={4}>
                <Button
                  leftIcon={<FaHome />}
                  bg={
                    colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                  color="white"
                  size="lg"
                  w="full"
                  borderRadius="lg"
                  onClick={() => navigate("/")}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  transition="all 0.2s"
                >
                  {t("pendingApproval.goHome")}
                </Button>

                <Button
                  leftIcon={<FaEnvelope />}
                  variant="outline"
                  borderColor={
                    colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                  color={
                    colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                  size="lg"
                  w="full"
                  borderRadius="lg"
                  onClick={() =>
                    (window.location.href = "mailto:support@tablya.com")
                  }
                  _hover={{
                    bg:
                      colorMode === "light"
                        ? "orange.50"
                        : "rgba(251, 211, 141, 0.1)",
                  }}
                >
                  {t("pendingApproval.contactSupport")}
                </Button>
              </VStack>

              {/* Footer Note */}
              <Text
                fontSize="xs"
                color={colorMode === "light" ? "gray.500" : "gray.500"}
                mt={4}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {t("pendingApproval.needHelp")}
              </Text>
            </VStack>
          </Box>
        </Container>
      </Flex>
      <Footer />

      {/* CSS Animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.5;
            }
          }
        `}
      </style>
    </>
  );
};

export default PendingApprovalPage;
