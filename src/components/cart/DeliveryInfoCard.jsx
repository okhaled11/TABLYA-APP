import { Box, VStack, HStack, Text, Icon, Skeleton } from "@chakra-ui/react";
import { FiMapPin, FiClock, FiPhone, FiUser } from "react-icons/fi";
import { useGetUserDataQuery } from "../../app/features/Auth/authSlice";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
export default function DeliveryInfoCard() {
  const { colorMode } = useColorMode();
  const { data: user, isLoading, isError } = useGetUserDataQuery();

  // Default values in case user data is not available
  const deliveryInfo = {
    address: user?.address || "No address provided",
    phone: user?.phone || "No phone number provided",
    name: user?.name || "Guest User",
  };

  if (isLoading) {
    return (
      <Box
        borderWidth="1px"
        borderRadius="md"
        p={4}
        bg="red.50"
        borderColor="red.100"
      >
        <VStack align="stretch" spacing={3}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height="20px" />
          ))}
        </VStack>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        borderWidth="1px"
        borderRadius="md"
        p={4}
        bg="red.50"
        borderColor="red.100"
      >
        <Text color="red.500">Error loading delivery information</Text>
      </Box>
    );
  }

  return (
    <Box
      borderRadius="20px"
      p={4}
      bg={
        colorMode == "light"
          ? colors.light.mainFixed10a
          : colors.dark.mainFixed10a
      }
      borderColor="red.100"
    >
      <VStack align="stretch" spacing={3}>
        <HStack>
          <Text
            fontSize="md"
            fontWeight="bold"
            color={
              colorMode == "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
          >
            Delivery Information
          </Text>
        </HStack>
        <HStack>
          <Icon
            as={FiUser}
            color={
              colorMode == "light"
                ? colors.light.mainFixed
                : colors.dark.mainFixed
            }
          />
          <Text
            fontSize="sm"
            fontWeight="light"
            color={
              colorMode == "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
          >
            {deliveryInfo?.name}
          </Text>
        </HStack>
        <HStack>
          <Icon
            as={FiMapPin}
            color={
              colorMode == "light"
                ? colors.light.mainFixed
                : colors.dark.mainFixed
            }
          />
          <Text
            fontSize="sm"
            fontWeight="light"
            color={
              colorMode == "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
          >
            {deliveryInfo?.address}
          </Text>
        </HStack>
        <HStack>
          <Icon
            as={FiPhone}
            color={
              colorMode == "light"
                ? colors.light.mainFixed
                : colors.dark.mainFixed
            }
          />
          <Text
            fontSize="sm"
            fontWeight="light"
            color={
              colorMode == "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
          >
            {deliveryInfo?.phone}
          </Text>
        </HStack>
        <HStack>
          <Icon
            as={FiClock}
            color={
              colorMode == "light"
                ? colors.light.mainFixed
                : colors.dark.mainFixed
            }
          />
          <Text
            fontSize="sm"
            fontWeight="light"
            color={
              colorMode == "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
          >
            30-45 min
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
}
