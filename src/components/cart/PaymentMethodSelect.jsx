import {
  Select,
  VStack,
  Text,
  Button,
  createListCollection,
  Box,
  Textarea,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { Portal } from "@chakra-ui/react";
import { FaCcVisa, FaMoneyBillWave } from "react-icons/fa";
import StripeCheckout from "./PayPalCheckout";
import { useGetPlatformSettingsQuery } from "../../app/features/Admin/MariamSettings";
import { toaster } from "../ui/toaster";
export default function PaymentMethodSelect({ onCheckout = () => {}, total = 0, onValidate = () => true, onCreateOrderForPayPal = null }) {
  const { colorMode } = useColorMode();

  const [selectedCategory, setSelectedCategory] = useState("cash");
  const [notes, setNotes] = useState("");
  const [stripeReady, setStripeReady] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);

  useEffect(() => {
    if (selectedCategory !== "visa") {
      setStripeReady(false);
    }
  }, [selectedCategory]);

  const { data: settings } = useGetPlatformSettingsQuery();
  const minOrder = Number(settings?.minimum_order_value ?? settings?.min_order_value ?? 0);

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
          value={selectedCategory ? [selectedCategory] : []}
          onValueChange={(e) => setSelectedCategory(e?.value?.[0] || "visa")}
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
              {paymentMethods.items.find((i) => i.value === selectedCategory)?.icon}

              {/* Selected Text */}
              <Select.ValueText
                placeholder="Credit/Debit Card"
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
      <VStack align="stretch" spacing={2} mt={2}>
        <Text
          fontWeight="medium"
          color={
            colorMode == "light" ? colors.light.textMain : colors.dark.textMain
          }
        >
          Notes (optional)
        </Text>
        <Textarea
          placeholder="Add any instructions for the order"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          bg={colorMode == "light" ? colors.light.bgInput : colors.dark.bgInput}
          borderRadius="12px"
          resize="vertical"
          minH="80px"
        />
      </VStack>
      {selectedCategory === "cash" ? (
        <Button
          bg={
            colorMode == "light" ? colors.light.mainFixed : colors.dark.mainFixed
          }
          size="lg"
          mt={4}
          color="white"
          borderRadius="12px"
          w="full"
          onClick={() => {
            if (Number(total) < minOrder) {
              toaster.create({
                title: "Minimum order value",
                description: `You must order at least ${minOrder.toFixed(2)} L.E`,
                type: "warning",
                duration: 2500,
                isClosable: true,
                position: "top",
              });
              return;
            }
            onCheckout({
              notes,
              payment_method: "cash",
              payment_status: "pending",
            });
          }}
        >
          checkout
        </Button>
      ) : (
        <Box mt={2}>
          {!stripeReady ? (
            <Button
              bg={
                colorMode == "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed
              }
              size="lg"
              color="white"
              borderRadius="12px"
              w="full"
              onClick={async () => {
                if (Number(total) < minOrder) {
                  toaster.create({
                    title: "Minimum order value",
                    description: `You must order at least ${minOrder.toFixed(2)} L.E`,
                    type: "warning",
                    duration: 2500,
                    isClosable: true,
                    position: "top",
                  });
                  return;
                }

                if (onValidate()) {
                  // Create order first with pending payment status
                  if (onCreateOrderForPayPal) {
                    const orderId = await onCreateOrderForPayPal({
                      notes,
                      payment_method: "credit_card",
                      payment_status: "pending",
                    });
                    if (orderId) {
                      setPendingOrderId(orderId);
                      setStripeReady(true);
                    }
                  } else {
                    setStripeReady(true);
                  }
                }
              }}
            >
              Proceed to Payment
            </Button>
          ) : (
            <StripeCheckout
              amount={Number(total || 0).toFixed(2)}
              orderId={pendingOrderId}
              onSuccess={(paymentDetails) =>
                onCheckout({
                  notes,
                  payment_method: "credit_card",
                  payment_status: "paid",
                  orderId: pendingOrderId,
                  paymentDetails,
                })
              }
            />
          )}
        </Box>
      )}
    </VStack>
  );
}
