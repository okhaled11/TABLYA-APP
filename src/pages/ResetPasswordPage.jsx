import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { useColorMode } from "../theme/color-mode";
import colors from "../theme/color";
import { useUpdatePasswordMutation } from "../app/features/Customer/passwordSlice";
import { toaster } from "../components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { Lock } from "@phosphor-icons/react";
import { supabase } from "../services/supabaseClient";
import CookieService from "../services/cookies";

export default function ResetPasswordPage() {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ newPassword: "", confirmPassword: "" });
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  // Check if user has valid session from email link
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          toaster.create({
            title: "Invalid Link",
            description: "This password reset link is invalid or has expired. Please request a new one.",
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
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
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
        description: "Your password has been updated successfully. Please login with your new password.",
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

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <Box
        minH="100vh"
        bg={colorMode === "light" ? colors.light.bgPrimary : colors.dark.bgPrimary}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner
            size="xl"
            color={
              colorMode === "light"
                ? colors.light.mainFixed
                : colors.dark.mainFixed
            }
          />
          <Text
            color={
              colorMode === "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
          >
            Verifying reset link...
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
      bg={colorMode === "light" ? colors.light.bgPrimary : colors.dark.bgPrimary}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg={colorMode === "light" ? colors.light.bgSecond : colors.dark.bgSecond}
        borderRadius="25px"
        p={8}
        maxW="500px"
        w="full"
      >
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <VStack spacing={2} align="center">
            <Box
              bg={
                colorMode === "light"
                  ? colors.light.mainFixed10a
                  : colors.dark.mainFixed10a
              }
              p={4}
              borderRadius="full"
            >
              <Lock
                size={32}
                color={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                weight="fill"
              />
            </Box>
            <Heading
              size="lg"
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            >
              Reset Password
            </Heading>
            <Text
              textAlign="center"
              color={
                colorMode === "light"
                  ? colors.light.textSub
                  : colors.dark.textSub
              }
            >
              Enter your new password below
            </Text>
          </VStack>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="stretch">
              <VStack align="stretch" spacing={2}>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  New Password
                </Text>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) {
                      setErrors({ ...errors, newPassword: "" });
                    }
                  }}
                  bg={
                    colorMode === "light"
                      ? colors.light.bgInput
                      : colors.dark.bgInput
                  }
                  border={
                    errors.newPassword
                      ? `1px solid ${
                          colorMode === "light"
                            ? colors.light.error
                            : colors.dark.error
                        }`
                      : "none"
                  }
                  borderRadius="12px"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                  _placeholder={{
                    color:
                      colorMode === "light"
                        ? colors.light.textSub
                        : colors.dark.textSub,
                  }}
                />
                {errors.newPassword && (
                  <Text
                    fontSize="sm"
                    color={
                      colorMode === "light"
                        ? colors.light.error
                        : colors.dark.error
                    }
                  >
                    {errors.newPassword}
                  </Text>
                )}
              </VStack>

              {/* Confirm Password */}
              <VStack align="stretch" spacing={2}>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  Confirm Password
                </Text>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: "" });
                    }
                  }}
                  bg={
                    colorMode === "light"
                      ? colors.light.bgInput
                      : colors.dark.bgInput
                  }
                  border={
                    errors.confirmPassword
                      ? `1px solid ${
                          colorMode === "light"
                            ? colors.light.error
                            : colors.dark.error
                        }`
                      : "none"
                  }
                  borderRadius="12px"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                  _placeholder={{
                    color:
                      colorMode === "light"
                        ? colors.light.textSub
                        : colors.dark.textSub,
                  }}
                />
                {errors.confirmPassword && (
                  <Text
                    fontSize="sm"
                    color={
                      colorMode === "light"
                        ? colors.light.error
                        : colors.dark.error
                    }
                  >
                    {errors.confirmPassword}
                  </Text>
                )}
              </VStack>

              {/* Submit Button */}
              <Button
                type="submit"
                bg={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                color="white"
                borderRadius="12px"
                size="lg"
                isLoading={isLoading}
                loadingText="Updating Password..."
                _hover={{
                  bg:
                    colorMode === "light"
                      ? colors.light.mainFixed70a
                      : colors.dark.mainFixed70a,
                }}
              >
                Reset Password
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );
}
