import { Box, Container, SimpleGrid, VStack, Text, HStack, DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogCloseTrigger, DialogBackdrop } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import CartSection from "../../components/cart/CartSection";
import OrderSummarySection from "../../components/cart/OrderSummarySection";
import { useGetUserDataQuery } from "../../app/features/Auth/authSlice";
import { toaster } from "../../components/ui/toaster";
import {
  useCreateOrderMutation,
  useUpdateOrderPaymentStatusMutation,
} from "../../app/features/Customer/ordersSlice";
import { clearCart } from "../../app/features/Customer/CartSlice";
import { useGetPlatformSettingsQuery } from "../../app/features/Admin/MariamSettings";
import { useGetAddressesQuery, useSetPrimaryAddressMutation } from "../../app/features/Customer/addressSlice";
import { MapPin } from "@phosphor-icons/react";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const { cartItems, cookerId } = useSelector((state) => state.cart);
  const { data: user } = useGetUserDataQuery();
  const [createOrder] = useCreateOrderMutation();
  const [updateOrderPaymentStatus] = useUpdateOrderPaymentStatusMutation();
  
  // Address selection modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  // Fetch addresses
  const { data: addresses = [] } = useGetAddressesQuery();
  const [setPrimaryAddress] = useSetPrimaryAddressMutation();
  
  // Auto-select primary address when addresses are loaded
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddress) {
      const primaryAddr = addresses.find(addr => addr.is_default);
      setSelectedAddress(primaryAddr || addresses[0]);
    }
  }, [addresses, selectedAddress]);

  // Calculate subtotal from cart items
  const subtotal = cartItems.reduce((total, item) => {
    const price = Number(item.price_for_customer ?? item.price ?? 0);
    const qty = Number(item.quantity ?? 0);
    return total + price * qty;
  }, 0);

  // Platform settings: delivery fee and free delivery threshold
  const { data: platformSettings } = useGetPlatformSettingsQuery();
  const defaultDeliveryFee = Number(
    platformSettings?.default_delivery_fee ?? 0
  );
  const freeDeliveryThreshold = Number.isFinite(
    Number(platformSettings?.free_delivery_threshold)
  )
    ? Number(platformSettings?.free_delivery_threshold)
    : Number.POSITIVE_INFINITY;

  // Compute delivery fee: if preliminary total >= threshold, delivery is free
  const candidateDelivery = defaultDeliveryFee;
  const preliminaryTotal = subtotal + candidateDelivery;
  const deliveryFee =
    preliminaryTotal >= freeDeliveryThreshold ? 0 : candidateDelivery;

  // Final total (no discounts yet)
  const total = subtotal + deliveryFee;

  const handleContinueShopping = () => {
    navigate("/home");
  };

  const validateBeforeCheckout = () => {
    // Check if user has any addresses
    if (!addresses || addresses.length === 0) {
      toaster.create({
        title: t("cart.addressRequired"),
        description: t("customerRegister.addAddressError"),
        type: "warning",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
      navigate("/personal-info/address");
      return false;
    }
    // Check if an address is selected
    if (!selectedAddress) {
      toaster.create({
        title: t("cart.selectAddress"),
        description: t("cart.selectAddress"),
        type: "warning",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
      return false;
    }
    return true;
  };
  
  const handleOpenAddressModal = () => {
    if (!addresses || addresses.length === 0) {
      toaster.create({
        title: t("cart.noAddresses"),
        description: t("customerRegister.addAddressError"),
        type: "warning",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
      navigate("/personal-info/address");
      return;
    }
    // Set the primary address as initially selected if none is selected
    if (!selectedAddress) {
      const primaryAddr = addresses.find(addr => addr.is_default);
      setSelectedAddress(primaryAddr || addresses[0] || null);
    }
    setIsAddressModalOpen(true);
  };

  const handleCheckout = async (opts = {}) => {
    const {
      notes = "",
      payment_method = "cash",
      payment_status = "pending",
      orderId = null,
      paymentDetails = null,
    } = typeof opts === "string" ? { notes: opts } : opts || {};

    // If orderId exists, this is a PayPal payment completion - just update status
    if (orderId) {
      try {
        console.log("Updating order payment status:", orderId);
        const result = await updateOrderPaymentStatus({
          orderId,
          payment_status: "paid",
        }).unwrap();

        console.log("Payment status updated successfully:", result);

        toaster.create({
          title: t("cart.paymentSuccess"),
          description: `Order #${orderId} paid successfully via PayPal`,
          type: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        dispatch(clearCart());
        navigate("/home/order");
      } catch (e) {
        console.error("Failed to update payment:", e);
        toaster.create({
          title: "Failed to update payment",
          description: e?.message || "Please contact support",
          type: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
      return;
    }

    // Otherwise, create new order (for cash payment)
    if (!validateBeforeCheckout()) return;
    try {
      const delivery_fee = deliveryFee;
      const discount = 0;
      const total = subtotal + delivery_fee - discount;
      
      // Format the address string from selected address
      const addressString = selectedAddress
        ? `${selectedAddress.building_no} ${selectedAddress.street}, ${selectedAddress.area}, ${selectedAddress.city}${
            selectedAddress.floor ? `, Floor ${selectedAddress.floor}` : ""
          }${
            selectedAddress.apartment ? `, Apt ${selectedAddress.apartment}` : ""
          }`
        : user?.address || "";
      
      const resp = await createOrder({
        cooker_id: cookerId,
        subtotal,
        delivery_fee,
        discount,
        address: addressString,
        notes,
        payment_method,
        payment_status,
        items: cartItems,
      }).unwrap();
      toaster.create({
        title: t("cart.orderCreated"),
        description: `Order #${resp?.id || ""} created successfully`,
        type: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      dispatch(clearCart());
      navigate("/home/order");
    } catch (e) {
      toaster.create({
        title: "Failed to create order",
        description: e?.message || "Please try again",
        type: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // Create order for PayPal (before payment)
  const handleCreateOrderForPayPal = async (opts = {}) => {
    const {
      notes = "",
      payment_method = "credit_card",
      payment_status = "pending",
    } = opts || {};
    if (!validateBeforeCheckout()) return null;

    try {
      const delivery_fee = deliveryFee;
      const discount = 0;
      const resp = await createOrder({
        cooker_id: cookerId,
        subtotal,
        delivery_fee,
        discount,
        address: user?.address || "",
        notes,
        payment_method,
        payment_status,
        items: cartItems,
      }).unwrap();

      return resp?.id || null;
    } catch (e) {
      toaster.create({
        title: "Failed to create order",
        description: e?.message || "Please try again",
        type: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return null;
    }
  };

  const isCartEmpty = !cartItems || cartItems.length === 0;

  return (
    <>
      <Container maxW="container.xl" py={8} px={[4, 6, 8]}>
        <SimpleGrid
          columns={{ base: 1, lg: isCartEmpty ? 1 : 3 }}
          spacing={8}
          gap={4}
          alignItems="flex-start"
        >
          <Box
            gridColumn={{ base: "1 / -1", lg: isCartEmpty ? "1 / -1" : "1 / 3" }}
          >
            <CartSection />
          </Box>

          {!isCartEmpty && (
            <Box>
              <OrderSummarySection
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                onContinueShopping={handleContinueShopping}
                onCheckout={handleCheckout}
                onValidate={validateBeforeCheckout}
                onCreateOrderForPayPal={handleCreateOrderForPayPal}
                selectedAddress={selectedAddress}
                onOpenAddressModal={handleOpenAddressModal}
              />
            </Box>
          )}
        </SimpleGrid>
      </Container>
      
      {/* Address Selection Modal */}
      <DialogRoot
        open={isAddressModalOpen}
        onOpenChange={(e) => setIsAddressModalOpen(e.open)}
        size="lg"
      >
        <DialogBackdrop bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <DialogContent
          bg={colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird}
          borderRadius="20px"
          maxW={{ base: "90%", sm: "500px", md: "600px" }}
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <DialogHeader>
            <DialogTitle
              color={colorMode === "light" ? colors.light.textMain : colors.dark.textMain}
              fontSize="xl"
              fontWeight="bold"
            >
              Select Delivery Address
            </DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          
          <DialogBody>
            <VStack spacing={3} align="stretch">
              {addresses.map((addr) => (
                <Box
                  key={addr.id}
                  bg={
                    selectedAddress?.id === addr.id
                      ? colorMode === "light"
                        ? colors.light.mainFixed10a
                        : colors.dark.mainFixed10a
                      : colorMode === "light"
                      ? colors.light.bgFourth
                      : colors.dark.bgFourth
                  }
                  borderRadius="12px"
                  p={4}
                  border={
                    selectedAddress?.id === addr.id
                      ? `2px solid ${
                          colorMode === "light"
                            ? colors.light.mainFixed
                            : colors.dark.mainFixed
                        }`
                      : "2px solid transparent"
                  }
                  cursor="pointer"
                  onClick={async () => {
                    setSelectedAddress(addr);
                    // Set as primary address in database
                    try {
                      await setPrimaryAddress(addr.id).unwrap();
                      toaster.create({
                        title: "Address updated",
                        description: "Delivery address has been changed",
                        type: "success",
                        duration: 2000,
                        isClosable: true,
                        position: "top",
                      });
                    } catch (error) {
                      console.error("Failed to set primary address:", error);
                    }
                    setIsAddressModalOpen(false);
                  }}
                  transition="all 0.2s"
                  _hover={{
                    borderColor:
                      colorMode === "light"
                        ? colors.light.mainFixed
                        : colors.dark.mainFixed,
                  }}
                >
                  <HStack spacing={3} align="start">
                    <Box
                      bg={
                        colorMode === "light"
                          ? colors.light.mainFixed10a
                          : colors.dark.mainFixed10a
                      }
                      borderRadius="12px"
                      p={3}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <MapPin
                        size={24}
                        weight="fill"
                        color={
                          colorMode === "light"
                            ? colors.light.mainFixed
                            : colors.dark.mainFixed
                        }
                      />
                    </Box>
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack>
                        <Text
                          fontWeight="bold"
                          color={
                            colorMode === "light"
                              ? colors.light.textMain
                              : colors.dark.textMain
                          }
                        >
                          {addr.label}
                        </Text>
                        {addr.is_default && (
                          <Box
                            bg={
                              colorMode === "light"
                                ? colors.light.success20a
                                : colors.dark.success20a
                            }
                            color={
                              colorMode === "light"
                                ? colors.light.success
                                : colors.dark.success
                            }
                            px={2}
                            py={0.5}
                            borderRadius="full"
                            fontSize="xs"
                          >
                            Primary
                          </Box>
                        )}
                      </HStack>
                      <Text
                        fontSize="sm"
                        color={
                          colorMode === "light"
                            ? colors.light.textSub
                            : colors.dark.textSub
                        }
                      >
                        {`${addr.building_no} ${addr.street}, ${
                          addr.area
                        }, ${addr.city}${
                          addr.floor ? `, Floor ${addr.floor}` : ""
                        }${
                          addr.apartment ? `, Apt ${addr.apartment}` : ""
                        }`}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
