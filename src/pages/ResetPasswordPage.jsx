import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Heading,
  Spinner,
  Container,
  IconButton,
  Flex,
  Image,
  List,
} from "@chakra-ui/react";
import { useColorMode } from "../theme/color-mode";
import colors from "../theme/color";
import { useUpdatePasswordMutation } from "../app/features/Customer/passwordSlice";
import { toaster } from "../components/ui/toaster";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeSlash,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";
import { supabase } from "../services/supabaseClient";
import CookieService from "../services/cookies";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

export default function ResetPasswordPage() {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  // Password Validation Rules
  const passwordRules = [
    { label: "At least 8 characters", valid: newPassword.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(newPassword) },
    { label: "One lowercase letter", valid: /[a-z]/.test(newPassword) },
    { label: "One number", valid: /\d/.test(newPassword) },
    { label: "One special character", valid: /[\W_]/.test(newPassword) },
  ];

  const isPasswordValid = passwordRules.every((rule) => rule.valid);

  // Check if user has valid session from email link
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          toaster.create({
            title: "Invalid Link",
            description:
              "This password reset link is invalid or has expired. Please request a new one.",
            type: "error",
            duration: 5000,
          });
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setHasSession(true);
        }
      } catch (error) {
        console.error("Session check error:", error);
        toaster.create({
          title: "Error",
          description: "Failed to verify reset link",
          type: "error",
          duration: 5000,
        });
        navigate("/login");
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({ newPassword: "", confirmPassword: "" });

    // Validation
    let hasError = false;
    const newErrors = { newPassword: "", confirmPassword: "" };

    if (!newPassword) {
      newErrors.newPassword = "Please enter a new password";
      hasError = true;
    } else if (!isPasswordValid) {
      newErrors.newPassword = "Password does not meet all requirements";
      hasError = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      await updatePassword(newPassword).unwrap();

      // Sign out the user from Supabase
      await supabase.auth.signOut();

      // Clear cookies
      CookieService.remove("access_token");
      CookieService.remove("refresh_token");

      toaster.create({
        title: "Success",
        description:
          "Your password has been updated successfully. Please login with your new password.",
        type: "success",
        duration: 5000,
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message || "Failed to update password",
        type: "error",
        duration: 5000,
      });
    }
  };

  const bgGradient =
    colorMode === "light"
      ? "linear(to-br, gray.50, gray.100)"
      : "linear(to-br, gray.900, black)";

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <Box
        minH="100vh"
        bg={bgGradient}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={6}>
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            color={
              colorMode === "light"
                ? colors.light.mainFixed
                : colors.dark.mainFixed
            }
          />
          <Text
            fontSize="lg"
            fontWeight="medium"
            color={
              colorMode === "light" ? colors.light.textSub : colors.dark.textSub
            }
          >
            Verifying secure link...
          </Text>
        </VStack>
      </Box>
    );
  }

  // Don't show form if no valid session
  if (!hasSession) {
    return null;
  }

  return (
    <Box
      minH="100vh"
      bg={bgGradient}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative Background Elements */}
      <Box
        position="absolute"
        top="-10%"
        left="-10%"
        w="500px"
        h="500px"
        bg={colorMode === "light" ? "orange.100" : "orange.900"}
        filter="blur(120px)"
        opacity={0.4}
        borderRadius="full"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="-10%"
        w="500px"
        h="500px"
        bg={colorMode === "light" ? "blue.100" : "blue.900"}
        filter="blur(120px)"
        opacity={0.4}
        borderRadius="full"
        zIndex={0}
      />

      <Container maxW="5xl" position="relative" zIndex={1}>
        <MotionFlex
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          bg={colorMode === "light" ? "white" : "gray.800"}
          borderRadius="3xl"
          boxShadow="2xl"
          border="1px solid"
          borderColor={colorMode === "light" ? "gray.100" : "gray.700"}
          overflow="hidden"
          direction={{ base: "column-reverse", md: "row" }}
          minH="600px"
        >
          {/* Left Side: Form */}
          <Box
            flex={1}
            p={{ base: 8, md: 12 }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <VStack spacing={8} align="stretch">
              <VStack spacing={2} align="start">
                <Heading
                  size="xl"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  Set New Password
                </Heading>
                <Text
                  fontSize="md"
                  color={
                    colorMode === "light"
                      ? colors.light.textSub
                      : colors.dark.textSub
                  }
                >
                  Please create a strong password for your account.
                </Text>
              </VStack>

              <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                  {/* New Password Input */}
                  <VStack align="stretch" spacing={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color={
                        colorMode === "light"
                          ? colors.light.textMain
                          : colors.dark.textMain
                      }
                    >
                      New Password
                    </Text>
                    <Box position="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (errors.newPassword) {
                            setErrors({ ...errors, newPassword: "" });
                          }
                        }}
                        bg={colorMode === "light" ? "gray.50" : "gray.700"}
                        border="1px solid"
                        borderColor={
                          errors.newPassword
                            ? colors.light.error
                            : colorMode === "light"
                            ? "gray.200"
                            : "gray.600"
                        }
                        _hover={{
                          borderColor:
                            colorMode === "light" ? "gray.300" : "gray.500",
                        }}
                        _focus={{
                          borderColor: colors.light.mainFixed,
                          boxShadow: `0 0 0 1px ${colors.light.mainFixed}`,
                        }}
                        borderRadius="xl"
                        h="12"
                        pl={4}
                        pr="3rem"
                        color={
                          colorMode === "light"
                            ? colors.light.textMain
                            : colors.dark.textMain
                        }
                      />
                      <Box
                        position="absolute"
                        right="0"
                        top="0"
                        h="100%"
                        display="flex"
                        alignItems="center"
                        px={2}
                        zIndex={2}
                      >
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          aria-label={
                            showNewPassword ? "Hide password" : "Show password"
                          }
                          color="gray.500"
                          _hover={{ bg: "transparent", color: "gray.700" }}
                        >
                          {showNewPassword ? (
                            <EyeSlash size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Password Requirements List */}
                    <Box
                      mt={2}
                      p={3}
                      bg={colorMode === "light" ? "gray.50" : "whiteAlpha.50"}
                      borderRadius="lg"
                    >
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        mb={2}
                        color={colorMode === "light" ? "gray.600" : "gray.400"}
                      >
                        Password Requirements:
                      </Text>
                      <List.Root spacing={1} variant="plain">
                        {passwordRules.map((rule, index) => (
                          <List.Item
                            key={index}
                            display="flex"
                            alignItems="center"
                            fontSize="xs"
                            color={rule.valid ? "green.500" : "gray.500"}
                          >
                            <List.Indicator asChild>
                              <Box
                                as="span"
                                mr={2}
                                display="inline-flex"
                                alignItems="center"
                              >
                                {rule.valid ? (
                                  <CheckCircle
                                    weight="fill"
                                    color="var(--chakra-colors-green-500)"
                                    size={16}
                                  />
                                ) : (
                                  <XCircle
                                    weight="fill"
                                    color="var(--chakra-colors-gray-400)"
                                    size={16}
                                  />
                                )}
                              </Box>
                            </List.Indicator>
                            {rule.label}
                          </List.Item>
                        ))}
                      </List.Root>
                    </Box>

                    {errors.newPassword && (
                      <Text fontSize="sm" color="red.500" mt={1}>
                        {errors.newPassword}
                      </Text>
                    )}
                  </VStack>

                  {/* Confirm Password Input */}
                  <VStack align="stretch" spacing={2}>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color={
                        colorMode === "light"
                          ? colors.light.textMain
                          : colors.dark.textMain
                      }
                    >
                      Confirm Password
                    </Text>
                    <Box position="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) {
                            setErrors({ ...errors, confirmPassword: "" });
                          }
                        }}
                        bg={colorMode === "light" ? "gray.50" : "gray.700"}
                        border="1px solid"
                        borderColor={
                          errors.confirmPassword
                            ? colors.light.error
                            : colorMode === "light"
                            ? "gray.200"
                            : "gray.600"
                        }
                        _hover={{
                          borderColor:
                            colorMode === "light" ? "gray.300" : "gray.500",
                        }}
                        _focus={{
                          borderColor: colors.light.mainFixed,
                          boxShadow: `0 0 0 1px ${colors.light.mainFixed}`,
                        }}
                        borderRadius="xl"
                        h="12"
                        pl={4}
                        pr="3rem"
                        color={
                          colorMode === "light"
                            ? colors.light.textMain
                            : colors.dark.textMain
                        }
                      />
                      <Box
                        position="absolute"
                        right="0"
                        top="0"
                        h="100%"
                        display="flex"
                        alignItems="center"
                        px={2}
                        zIndex={2}
                      >
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          color="gray.500"
                          _hover={{ bg: "transparent", color: "gray.700" }}
                        >
                          {showConfirmPassword ? (
                            <EyeSlash size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </IconButton>
                      </Box>
                    </Box>
                    {errors.confirmPassword && (
                      <Text fontSize="sm" color="red.500" mt={1}>
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </VStack>

                  <Button
                    type="submit"
                    bg={
                      colorMode === "light"
                        ? colors.light.mainFixed
                        : colors.dark.mainFixed
                    }
                    color="white"
                    borderRadius="xl"
                    size="lg"
                    h="12"
                    fontSize="md"
                    fontWeight="bold"
                    isLoading={isLoading}
                    loadingText="Resetting..."
                    _hover={{
                      bg:
                        colorMode === "light"
                          ? colors.light.mainFixed70a
                          : colors.dark.mainFixed70a,
                      transform: "translateY(-1px)",
                      boxShadow: "lg",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    transition="all 0.2s"
                    mt={4}
                  >
                    Reset Password
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>

          {/* Right Side: Branding/Logo */}
          <Box
            flex={1}
            bg={colorMode === "light" ? "orange.50" : "gray.900"}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={12}
            position="relative"
            overflow="hidden"
          >
            {/* Background Pattern */}
            <Box
              position="absolute"
              top={0}
              right={0}
              bottom={0}
              left={0}
              opacity={0.1}
              bgImage="radial-gradient(circle at 2px 2px, gray 1px, transparent 0)"
              bgSize="20px 20px"
            />

            <MotionBox
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              zIndex={1}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box
                bg="white"
                p={8}
                borderRadius="full"
                boxShadow="xl"
                mb={8}
                width="200px"
                height="200px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src={logo}
                  alt="Tablay Logo"
                  objectFit="contain"
                  w="100%"
                  h="100%"
                />
              </Box>

              <Heading
                size="lg"
                textAlign="center"
                color={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                mb={4}
              >
                Welcome Back to Tablay
              </Heading>

              <Text
                textAlign="center"
                fontSize="lg"
                color={colorMode === "light" ? "gray.600" : "gray.400"}
                maxW="sm"
              >
                Secure your account and get back to discovering delicious
                homemade meals.
              </Text>
            </MotionBox>
          </Box>
        </MotionFlex>
      </Container>
    </Box>
  );
}
