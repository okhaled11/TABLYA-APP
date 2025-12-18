import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Input, Text, VStack, Box } from "@chakra-ui/react";
import { useUpdateMaxActiveOrdersMutation } from "../../app/features/Customer/CookersApi";
import { toaster } from "../ui/toaster";
import CustomModal from "../../shared/Modal";

const MaxActiveOrdersModal = ({ dialog, userId, currentValue }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(currentValue || 2);
  const [updateMaxActiveOrders, { isLoading }] =
    useUpdateMaxActiveOrdersMutation();

  // Update value when currentValue prop changes (from backend)
  useEffect(() => {
    if (currentValue) {
      setValue(currentValue);
    }
  }, [currentValue]);

  const handleSave = async () => {
    // Validate range
    if (value < 2 || value > 10) {
      toaster.create({
        title: t("cookerStatistics.maxActiveOrdersModal.errorTitle"),
        description: t("cookerStatistics.maxActiveOrdersModal.rangeError"),
        type: "error",
        duration: 3000,
      });
      return false;
    }

    try {
      const result = await updateMaxActiveOrders({
        userId,
        maxActiveOrders: parseInt(value),
      });

      if (result.error) {
        throw new Error(result.error.message || "Update failed");
      }

      toaster.create({
        title: t("cookerStatistics.maxActiveOrdersModal.successTitle"),
        description: t("cookerStatistics.maxActiveOrdersModal.successDesc"),
        type: "success",
        duration: 2000,
      });

      return true; // Close modal on success
    } catch (error) {
      toaster.create({
        title: t("cookerStatistics.maxActiveOrdersModal.errorTitle"),
        description:
          error.message ||
          t("cookerStatistics.maxActiveOrdersModal.errorDesc"),
        type: "error",
        duration: 3000,
      });
      return false; // Keep modal open on error
    }
  };

  return (
    <CustomModal
      dialog={dialog}
      title={t("cookerStatistics.maxActiveOrdersModal.title")}
      description={t("cookerStatistics.maxActiveOrdersModal.description")}
      cancelTxt={t("cookerStatistics.maxActiveOrdersModal.cancel")}
      okTxt={t("cookerStatistics.maxActiveOrdersModal.save")}
      onOkHandler={handleSave}
      isLoading={isLoading}
    >
      <VStack gap={4} align="stretch">
        <Box>
          <Text fontWeight="medium" mb={2}>
            {t("cookerStatistics.maxActiveOrdersModal.label")}
          </Text>
          <Input
            type="number"
            min={2}
            max={10}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isLoading}
          />
          <Text fontSize="sm" color="gray.500" mt={1}>
            {t("cookerStatistics.maxActiveOrdersModal.helperText")}
          </Text>
        </Box>
      </VStack>
    </CustomModal>
  );
};

export default MaxActiveOrdersModal;
