import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, cookerId } = useSelector((state) => state.cart);
  const { data: user } = useGetUserDataQuery();
  const [createOrder] = useCreateOrderMutation();
  const [updateOrderPaymentStatus] = useUpdateOrderPaymentStatusMutation();

  // Calculate subtotal from cart items
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price_for_customer * item.quantity;
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
    const address = user?.address?.trim?.() || "";
    if (!address) {
      toaster.create({
        title: "Address required",
        description: "Please add your delivery address before checkout.",
        type: "warning",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
      navigate("/personal-info/address");
      return false;
    }
    return true;
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
          title: "Payment successful",
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
      toaster.create({
        title: "Order created",
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
            />
          </Box>
        )}
      </SimpleGrid>
    </Container>
  );
}
