import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Text, Spinner, VStack } from "@chakra-ui/react";
import { supabase } from "../../services/supabaseClient";
import { toaster } from "../../components/ui/toaster";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Confirming your email...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash from URL (contains access_token and refresh_token)
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        if (type === "signup" && accessToken) {
          // Set the session with the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }

          // Check if user is confirmed
          if (data.user && data.user.email_confirmed_at) {
            setMessage("Email confirmed successfully! Redirecting...");

            toaster.create({
              title: "Email Confirmed!",
              description:
                "Your email has been confirmed successfully. Welcome!",
              status: "success",
              duration: 3000,
            });

            // Redirect to dashboard after a short delay
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          } else {
            throw new Error("Email confirmation failed");
          }
        } else {
          // Handle other auth types or errors
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            throw error;
          }

          if (data.session) {
            navigate("/customer/dashboard");
          } else {
            navigate("/auth/login");
          }
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        setMessage("Email confirmation failed");

        toaster.create({
          title: "Confirmation Failed",
          description:
            error.message || "Failed to confirm email. Please try again.",
          status: "error",
          duration: 5000,
        });

        // Redirect to login after error
        setTimeout(() => {
          navigate("/auth/login");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={colorMode === "light" ? colors.light.bg : colors.dark.bg}
    >
      <VStack spacing={6}>
        <Box
          p={8}
          bg={
            colorMode === "light"
              ? colors.light.bgSecondary
              : colors.dark.bgSecondary
          }
          borderRadius="xl"
          boxShadow="lg"
          textAlign="center"
        >
          <VStack spacing={4}>
            {loading && <Spinner size="lg" color="blue.500" />}
            <Text
              fontSize="lg"
              fontWeight="medium"
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            >
              {message}
            </Text>
            {!loading && (
              <Text
                fontSize="sm"
                color={
                  colorMode === "light"
                    ? colors.light.textSecondary
                    : colors.dark.textSecondary
                }
              >
                You will be redirected shortly...
              </Text>
            )}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default AuthCallback;
