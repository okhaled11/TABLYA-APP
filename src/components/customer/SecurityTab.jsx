import { Box, Heading, VStack, Text, Button, HStack, Skeleton } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import { useSendPasswordResetEmailMutation } from "../../app/features/Customer/passwordSlice";
import { LockKey } from "@phosphor-icons/react";
import { useColorStyles } from "../../hooks/useColorStyles";
import IconBox from "../ui/IconBox";

export default function SecurityTab({ user, isLoading }) {
  const styles = useColorStyles();
  const [sendPasswordResetEmail, { isLoading: isSendingEmail }] =
    useSendPasswordResetEmailMutation();

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(user?.email).unwrap();
      toaster.create({
        title: "Email Sent",
        description:
          "Password reset link has been sent to your email. Please check your inbox.",
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        type: "error",
        duration: 5000,
      });
    }
  };

  return (
    <Box bg={styles.bgThird} borderRadius="25px" p={8}>
      {isLoading ? (
        <Skeleton height="150px" borderRadius="12px" />
      ) : (
        <Box bg={styles.bgFourth} borderRadius="12px" p={6}>
          <HStack spacing={4} align="start">
            <IconBox icon={LockKey} />
            <VStack align="start" spacing={3} flex={1}>
              <VStack align="start" spacing={1}>
                <Heading size="lg" fontWeight="bold" color={styles.textMain}>
                  Password
                </Heading>
                <Text fontSize="sm" color={styles.textSub}>
                  Click the button below to receive a password reset link via email
                </Text>
              </VStack>
              <Button
                bg={styles.mainFixed}
                color="white"
                borderRadius="12px"
                size="md"
                onClick={handlePasswordReset}
                isLoading={isSendingEmail}
                loadingText="Sending Email..."
                _hover={{ bg: styles.mainFixed70a }}
              >
                Send Password Reset Email
              </Button>
            </VStack>
          </HStack>
        </Box>
      )}
    </Box>
  );
}
