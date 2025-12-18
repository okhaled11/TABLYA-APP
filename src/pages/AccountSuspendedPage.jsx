import {
  Flex,
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Container,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "../theme/color-mode";
import colors from "../theme/color";
import { MdBlock, MdEmail, MdLogout } from "react-icons/md";
import { FaExclamationTriangle } from "react-icons/fa";
import Navbar from "../layout/Navbar";
import Footer from "../shared/Footer";
import { motion } from "framer-motion";
import { supabase } from "../services/supabaseClient";
import { toaster } from "../components/ui/toaster";
import { useTranslation } from "react-i18next";

const MotionBox = motion(Box);

const AccountSuspendedPage = () => {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const bgMain = colorMode === "light" ? "gray.50" : "gray.900";
  const bgCard = colorMode === "light" ? "white" : "gray.800";
  const textColor = colorMode === "light" ? "gray.800" : "white";
  const subTextColor = colorMode === "light" ? "gray.500" : "gray.400";

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toaster.create({
        title: t("accountSuspended.logoutSuccessTitle"),
        description: t("accountSuspended.logoutSuccessDesc"),
        type: "success",
        duration: 3000,
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toaster.create({
        title: t("accountSuspended.errorTitle"),
        description: t("accountSuspended.logoutErrorDesc"),
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <Navbar />
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        px={4}
        py={10}
      >
        <Container maxW="2xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            bg={bgCard}
            borderRadius="2xl"
            p={{ base: 6, md: 10 }}
            boxShadow="lg"
            textAlign="center"
          >
            <VStack gap={6}>
              {/* Icon Area */}
              <Box position="relative" mb={2}>
                <MotionBox
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Box
                    w="120px"
                    h="120px"
                    bg="red.50"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                  >
                    <Icon as={MdBlock} boxSize={16} color="red.500" />

                    <Box
                      position="absolute"
                      bottom="-2px"
                      right="-2px"
                      bg="white"
                      p={2}
                      borderRadius="full"
                      boxShadow="sm"
                      border="1px solid"
                      borderColor="gray.100"
                    >
                      <Icon
                        as={FaExclamationTriangle}
                        boxSize={5}
                        color="red.500"
                      />
                    </Box>
                  </Box>
                </MotionBox>
              </Box>

              {/* Title & Description */}
              <VStack gap={2}>
                <Heading
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="bold"
                  color={textColor}
                >
                  {t("accountSuspended.title")}
                </Heading>
                <Text
                  fontSize="md"
                  color={subTextColor}
                  maxW="md"
                  lineHeight="tall"
                >
                  {t("accountSuspended.description")}
                </Text>
              </VStack>

              {/* Contact Support Box */}
              <VStack spacing={4} w="full">
                <HStack color="red.500" spacing={2}>
                  <Icon as={MdEmail} boxSize={5} />
                  <Text fontWeight="bold" fontSize="md">
                    {t("accountSuspended.contactSupport")}
                  </Text>
                </HStack>
                <Text
                  fontSize="sm"
                  color={subTextColor}
                  textAlign="center"
                  lineHeight="relaxed"
                >
                  {t("accountSuspended.contactDesc")}
                </Text>
                <Box
                  as="a"
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=tablya.co@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  display="block"
                  w="full"
                  maxW="md"
                  bg={colorMode === "light" ? "white" : "gray.700"}
                  px={6}
                  py={3}
                  borderRadius="lg"
                  border="2px solid"
                  borderColor="red.400"
                  textAlign="center"
                  transition="all 0.3s ease"
                  cursor="pointer"
                  _hover={{
                    borderColor: "red.500",
                    bg: colorMode === "light" ? "red.50" : "rgba(254, 178, 178, 0.1)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                >
                  <HStack justify="center" spacing={2}>
                    <Icon as={MdEmail} color="red.500" boxSize={5} />
                    <Text
                      fontWeight="semibold"
                      fontSize="md"
                      color="red.500"
                    >
                     tablya.co@gmail.com
                    </Text>
                  </HStack>
                </Box>
              </VStack>

              {/* Logout Button */}
              <Button
                size="lg"
                bg={colorMode === "light" ? colors.light.error : colors.dark.error}
                color="white"
                _hover={{
                  bg: colorMode === "light" ? colors.light.error : colors.dark.error,
                  opacity: 0.9,
                  transform: "translateY(-2px)",
                }}
                _active={{ transform: "translateY(0)" }}
                onClick={handleLogout}
                leftIcon={<MdLogout />}
                fontSize="md"
                borderRadius="lg"
                w="full"
                maxW="xs"
              >
                {t("accountSuspended.logout")}
              </Button>
            </VStack>
          </MotionBox>
        </Container>
      </Flex>
      <Footer />
    </>
  );
};

export default AccountSuspendedPage;
