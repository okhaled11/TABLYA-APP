import {
  Select,
  VStack,
  Text,
  Button,
  createListCollection,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { Portal } from "@chakra-ui/react";
import { FaCcVisa, FaMoneyBillWave } from "react-icons/fa";
export default function PaymentMethodSelect() {
  const { colorMode } = useColorMode();

  const [selectedCategory, setSelectedCategory] = useState("all");

  const paymentMethods = createListCollection({
    items: [
      { value: "visa", label: "Credit/Debit Card", icon: <FaCcVisa /> },
      { value: "cash", label: "Cash on Delivery", icon: <FaMoneyBillWave /> },
    ],
  });

  return (
    <VStack align="stretch" spacing={4}>
      <Text
        fontWeight="medium"
        color={
          colorMode == "light" ? colors.light.textMain : colors.dark.textMain
        }
      >
        Payment Method
      </Text>
      <Box>
        <Select.Root
          collection={paymentMethods}
          size="sm"
          value={selectedCategory}
          onValueChange={(e) => setSelectedCategory(e.value)}
        >
          <Select.HiddenSelect />

          <Select.Control>
            <Select.Trigger
              px="3"
              py="2"
              bg={"transparent"}
              color={
                colorMode == "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
              borderRadius="12px"
              display="flex"
              alignItems="center"
              gap="2"
              w="100%"
            >
              {/* Left Icon */}
              {paymentMethods.items[0].icon}

              {/* Selected Text */}
              <Select.ValueText
                placeholder="Credit/Debit Card"
                defaultValue={paymentMethods.items[0].value}
                flex="1"
                textAlign="left"
              />

              <Select.Indicator />
            </Select.Trigger>
          </Select.Control>

          <Portal>
            <Select.Positioner>
              <Select.Content
                bg={
                  colorMode == "light"
                    ? colors.light.bgFixed
                    : colors.dark.bgFixed
                }
                shadow="md"
                borderRadius="md"
                color={"white"}
              >
                {paymentMethods.items.map((item) => (
                  <Select.Item item={item} key={item.value} px="3" py="2">
                    {item.icon}
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Box>
      <Button
        bg={
          colorMode == "light" ? colors.light.mainFixed : colors.dark.mainFixed
        }
        size="lg"
        mt={4}
        color="white"
        borderRadius="12px"
        w="full"
      >
        Checkout
      </Button>
    </VStack>
  );
}
