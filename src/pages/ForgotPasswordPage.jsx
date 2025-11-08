import {
  Flex,
  Box,
  Input,
  Button,
  Text,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useColorMode } from "../theme/color-mode";
import colors from "../theme/color";
import Navbar from "../layout/Navbar";
import Footer from "../shared/Footer";
import { useTranslation } from "react-i18next";
import { useSendPasswordResetEmailMutation } from "../app/features/Customer/passwordSlice";
import { toaster } from "../components/ui/toaster";
import registerPhoto from "../assets/Images_Auth/register.png";
import { Image } from "@chakra-ui/react";

const ForgotPasswordPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { colorMode } = useColorMode();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const [sendPasswordResetEmail, { isLoading }] = useSendPasswordResetEmailMutation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error
    setEmailError("");

    // Validate email
    if (!email.trim()) {
      setEmailError(t("validation.emailRequired"));
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(t("validation.emailInvalid"));
      return;
    }

    try {
      await sendPasswordResetEmail(email).unwrap();
      
      setEmailSent(true);
      
      toaster.create({
        title: t("forgotPassword.successTitle"),
        description: t("forgotPassword.successDescription"),
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      toaster.create({
        title: t("forgotPassword.errorTitle"),
        description: error.message || t("forgotPassword.errorDescription"),
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
        bg={colorMode === "light" ? colors.light.bgMain : colors.dark.bgMain}
        px={4}
        py={10}
      >
        <Flex
          w={{ base: "100%", md: "70%" }}
          h={600}
          justifyContent="center"
          borderRadius="2xl"
          bg={colorMode === "light" ? colors.light.bgThird : colors.dark.bgFixed}
        >
          <Flex
            flex={1}
            p={8}
            align="center"
            justifyContent="center"
            direction="column"
          >
            {!emailSent ? (
              <>
                <VStack mb={5} spacing={2}>
                  <Heading
                    fontSize="3xl"
                    fontWeight="bold"
                    textAlign="center"
                    color={
                      colorMode === "light"
                        ? colors.light.textMain
                        : colors.dark.textMain
                    }
                  >
                    {t("forgotPassword.title")}
                  </Heading>
                  <Text
                    fontSize="sm"
                    color="#968782"
                    textAlign="center"
                    maxW="md"
                  >
                    {t("forgotPassword.subtitle")}
                  </Text>
                </VStack>

                <Box w="full" maxW="md" as="form" onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch">
                    {/* Email Input */}
                    <Box>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        mb={2}
                        color={
                          colorMode === "light"
                            ? colors.light.textMain
                            : colors.dark.textMain
                        }
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        {t("login.email")}
                      </Text>
                      <Flex
                        align="center"
                        bg={
                          colorMode === "light"
                            ? colors.light.bgInput
                            : colors.dark.bgInput
                        }
                        borderRadius="10px"
                        px={3}
                        border={
                          emailError
                            ? `1px solid ${
                                colorMode === "light"
                                  ? colors.light.error
                                  : colors.dark.error
                              }`
                            : "none"
                        }
                      >
                        {!isRTL && (
                          <FaEnvelope
                            color={
                              colorMode === "light"
                                ? colors.light.textSub
                                : colors.dark.textSub
                            }
                          />
                        )}
                        <Input
                          placeholder={t("login.emailPlaceholder")}
                          textAlign={isRTL ? "right" : "left"}
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                          }}
                          bg="transparent"
                          border="none"
                          _focus={{ border: "none", boxShadow: "none" }}
                        />
                        {isRTL && (
                          <FaEnvelope
                            color={
                              colorMode === "light"
                                ? colors.light.textSub
                                : colors.dark.textSub
                            }
                          />
                        )}
                      </Flex>
                      {emailError && (
                        <Text fontSize="sm" color="crimson" mt={1}>
                          {emailError}
                        </Text>
                      )}
                    </Box>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      bg={
                        colorMode === "light"
                          ? colors.light.mainFixed
                          : colors.dark.mainFixed
                      }
                      size="lg"
                      borderRadius={12}
                      w="full"
                      mt={4}
                      loading={isLoading}
                      color="#FFF7F0"
                    >
                      {t("forgotPassword.sendButton")}
                    </Button>

                    {/* Back to Login */}
                    <Text
                      textAlign="center"
                      fontSize="sm"
                      dir={isRTL ? "rtl" : "ltr"}
                      mt={2}
                    >
                      <Link to="/login">
                        <Text
                          as="span"
                          color={colors.light.mainFixed}
                          fontWeight="semibold"
                          _hover={{ textDecoration: "underline" }}
                        >
                          {t("forgotPassword.backToLogin")}
                        </Text>
                      </Link>
                    </Text>
                  </VStack>
                </Box>
              </>
            ) : (
              <VStack spacing={6} maxW="md" textAlign="center">
                <Box
                  bg={
                    colorMode === "light"
                      ? colors.light.success20a
                      : colors.dark.success20a
                  }
                  borderRadius="full"
                  p={6}
                >
                  <FaEnvelope
                    size={48}
                    color={
                      colorMode === "light"
                        ? colors.light.success
                        : colors.dark.success
                    }
                  />
                </Box>
                <Heading
                  fontSize="2xl"
                  fontWeight="bold"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {t("forgotPassword.emailSentTitle")}
                </Heading>
                <Text
                  fontSize="md"
                  color="#968782"
                >
                  {t("forgotPassword.emailSentDescription")}
                </Text>
                <Text
                  fontSize="sm"
                  color={
                    colorMode === "light"
                      ? colors.light.textSub
                      : colors.dark.textSub
                  }
                >
                  {email}
                </Text>
                <Button
                  as={Link}
                  to="/login"
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
                  borderRadius={12}
                  mt={4}
                  _hover={{
                    bg:
                      colorMode === "light"
                        ? colors.light.mainFixed10a
                        : colors.dark.mainFixed10a,
                  }}
                >
                  {t("forgotPassword.backToLogin")}
                </Button>
              </VStack>
            )}
          </Flex>

          {/* Image */}
          <Flex flex={1} display={{ base: "none", md: "block" }}>
            <Image
              alt={t("login.imageAlt")}
              objectFit="cover"
              w="100%"
              h="100%"
              src={registerPhoto}
              rounded="md"
            />
          </Flex>
        </Flex>
      </Flex>
      <Footer />
    </>
  );
};

export default ForgotPasswordPage;
