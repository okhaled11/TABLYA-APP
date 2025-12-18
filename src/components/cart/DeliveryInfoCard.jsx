import { Box, VStack, HStack, Text, Icon, Skeleton } from "@chakra-ui/react";
import { FiMapPin, FiClock, FiPhone, FiUser } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useGetUserDataQuery } from "../../app/features/Auth/authSlice";
import { useGetAddressesQuery } from "../../app/features/Customer/addressSlice";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { useSelector } from "react-redux";
export default function DeliveryInfoCard({ selectedAddress = null }) {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const { data: user, isLoading, isError } = useGetUserDataQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const { data: addresses = [] } = useGetAddressesQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  console.log ("from deleviery",user)

  const cartItems = useSelector((state) => state.cart.cartItems);
  const prepTimes = (cartItems || [])
    .map((it) => Number(it?.prep_time_minutes ?? 0))
    .filter((n) => Number.isFinite(n) && n > 0);
  const avgPrep = prepTimes.length
    ? Math.round(prepTimes.reduce((a, b) => a + b, 0) / prepTimes.length)
    : null;
  const sumPrep = (cartItems || []).reduce((sum, it) => {
    const t = Number(it?.prep_time_minutes ?? 0);
    const q = Number(it?.quantity ?? 0);
    return sum + (Number.isFinite(t) && Number.isFinite(q) ? t * q : 0);
  }, 0);
  const prepText = prepTimes.length ? `${avgPrep}-${Math.round(sumPrep)} min` : "—";

  // Use selectedAddress if provided, otherwise fall back to primary address
  const addressToDisplay = selectedAddress || addresses.find((a) => a.is_default);
  
  // Default values in case user data is not available
  const deliveryInfo = {
    address: (() => {
      if (!addressToDisplay) return "";
      const parts = [
        addressToDisplay.building_no,
        addressToDisplay.street,
        addressToDisplay.area,
        addressToDisplay.city,
        addressToDisplay.city,
        addressToDisplay.floor ? `${t("cart.floor")} ${addressToDisplay.floor}` : "",
        addressToDisplay.apartment ? `${t("cart.apt")} ${addressToDisplay.apartment}` : "",
      ].filter(Boolean);
      return parts.join(", ");
    })(),
    phone: user?.phone || t("cart.noPhone"),
    name: user?.name || t("cart.guest"),
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
            {t("cart.deliveryInfo")}
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
          {deliveryInfo.address ? (
            <Text
              fontSize="sm"
              fontWeight="light"
              color={
                colorMode == "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            >
              {deliveryInfo.address}
            </Text>
          ) : (
            <Text
              fontSize="sm"
              fontWeight="medium"
              color={colorMode == "light" ? colors.light.error : colors.dark.error}
            >
              {t("cart.noAddress")}
            </Text>
          )}
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
            {prepText}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
}
