import { VStack, HStack, Text, Button, Box } from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import DeliveryInfoCard from "./DeliveryInfoCard";
import PaymentMethodSelect from "./PaymentMethodSelect";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";

export default function OrderSummarySection({
  subtotal = 0,
  deliveryFee: deliveryFeeProp = null,
  total: totalProp = null,
  onCheckout = () => {},
  onValidate = () => true,
  onCreateOrderForPayPal = null,
}) {
  const { colorMode } = useColorMode();
  const deliveryFee = typeof deliveryFeeProp === "number" ? deliveryFeeProp : 0;
  const total = typeof totalProp === "number" ? totalProp : subtotal + deliveryFee;

  return (
    <Box
      bg="white"
      borderRadius="20px"
      p={{ base: 4, md: 10 }}
      boxShadow="sm"
      overflow="hidden"
      border="none"
      mt={8}
      background={
        colorMode == "light" ? colors.light.bgThird : colors.dark.bgThird
      }
    >
      <Text
        mb={5}
        fontSize="xl"
        fontWeight="bold"
        color={
          colorMode == "light" ? colors.light.textMain : colors.dark.textMain
        }
      >
        Order Summary
      </Text>

      <VStack spacing={3} align="stretch">
        <HStack justify="space-between">
          <Text
            color={
              colorMode == "light" ? colors.light.textSub : colors.dark.textSub
            }
          >
            Subtotal
          </Text>
          <Text
            color={
              colorMode == "light" ? colors.light.text : colors.dark.textMain
            }
          >
            {subtotal} L.E
          </Text>
        </HStack>
        <HStack justify="space-between">
          <Text
            color={
              colorMode == "light" ? colors.light.textSub : colors.dark.textSub
            }
          >
            Delivery Fee
          </Text>
          <Text
            color={
              colorMode == "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
          >
            {deliveryFee === 0 ? "Free" : `${deliveryFee.toFixed(2)} L.E`}
          </Text>
        </HStack>

        <HStack justify="space-between" fontWeight="bold" mt={2}>
          <Text
            color={
              colorMode == "light"
                ? colors.light.mainFixed
                : colors.dark.mainFixed
            }
          >
            Total
          </Text>
          <Text
            color={
              colorMode == "light"
                ? colors.light.mainFixed
                : colors.dark.mainFixed
            }
          >
            {total.toFixed(2)} L.E
          </Text>
        </HStack>
      </VStack>

      <Box
        w="100%"
        h="1px"
        bg={
          colorMode == "light"
            ? colors.light.textMain10a
            : colors.dark.textMain10a
        }
        mt={2}
        mb={5}
      />

      <DeliveryInfoCard />
      <Box
        w="100%"
        h="1px"
        bg={
          colorMode == "light"
            ? colors.light.textMain10a
            : colors.dark.textMain10a
        }
        mt={2}
        mb={5}
      />

      <PaymentMethodSelect onCheckout={onCheckout} total={total} onValidate={onValidate} onCreateOrderForPayPal={onCreateOrderForPayPal} />
    </Box>
  );
}
