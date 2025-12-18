import {
  VStack,
  Text,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { FaMoneyBillWave } from "react-icons/fa";
import { useGetPlatformSettingsQuery } from "../../app/features/Admin/MariamSettings";
import { toaster } from "../ui/toaster";
import { useTranslation } from "react-i18next";

export default function PaymentMethodSelect({ onCheckout = () => {}, total = 0, selectedAddress = null, onOpenAddressModal = () => {} }) {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const [notes, setNotes] = useState("");

  const { data: settings } = useGetPlatformSettingsQuery();
  const minOrder = Number(settings?.minimum_order_value ?? settings?.min_order_value ?? 0);

  return (
    <VStack align="stretch" spacing={4}>
      {/* Change Address Button */}
      {selectedAddress && (
        <Button
          size="md"
          variant="outline"
          borderColor={
            colorMode == "light"
              ? colors.light.mainFixed
              : colors.dark.mainFixed
          }
          color={
            colorMode == "light"
              ? colors.light.mainFixed
              : colors.dark.mainFixed
          }
          onClick={onOpenAddressModal}
          w="full"
          borderRadius="12px"
        >
          {t("cart.changeAddress")}
        </Button>
      )}
      
      <Text
        fontWeight="medium"
        color={
          colorMode == "light" ? colors.light.textMain : colors.dark.textMain
        }
      >
        {t("cart.paymentMethod")}
      </Text>
      
      {/* Cash on Delivery - Static Display */}
      <VStack
        align="start"
        spacing={2}
        bg={colorMode == "light" ? colors.light.bgInput : colors.dark.bgInput}
        px="3"
        py="3"
        borderRadius="12px"
      >
        <Text
          display="flex"
          alignItems="center"
          gap="2"
          color={
            colorMode == "light"
              ? colors.light.textMain
              : colors.dark.textMain
          }
          fontWeight="medium"
        >
          <FaMoneyBillWave />
          {t("cart.cashOnDelivery")}
        </Text>
      </VStack>

      <VStack align="stretch" spacing={2} mt={2}>
        <Text
          fontWeight="medium"
          color={
            colorMode == "light" ? colors.light.textMain : colors.dark.textMain
          }
        >
          {t("cart.notes")} {t("cart.optional")}
        </Text>
        <Textarea
          placeholder={t("cart.orderInstructionsPlaceholder")}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          bg={colorMode == "light" ? colors.light.bgInput : colors.dark.bgInput}
          borderRadius="12px"
          resize="vertical"
          minH="80px"
        />
      </VStack>

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
              title: t("cart.minOrderValue"),
              description: t("cart.minOrderDesc", { amount: minOrder.toFixed(2) }),
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
        {t("cart.checkout")}
      </Button>
    </VStack>
  );
}
