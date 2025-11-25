import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import CartSection from "../../components/cart/CartSection";
import OrderSummarySection from "../../components/cart/OrderSummarySection";
import { useGetUserDataQuery } from "../../app/features/Auth/authSlice";
import { toaster } from "../../components/ui/toaster";
import {
  useCreateOrderMutation,
  useUpdateOrderPaymentStatusMutation,
} from "../../app/features/Customer/ordersSlice";
import { clearCart } from "../../app/features/Customer/CartSlice";

export default function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, cookerId } = useSelector((state) => state.cart);
  const { data: user } = useGetUserDataQuery();
  const [createOrder] = useCreateOrderMutation();
  const [updateOrderPaymentStatus] = useUpdateOrderPaymentStatusMutation();

  // Calculate subtotal from cart items
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleContinueShopping = () => {
    navigate("/home");
  };

  const validateBeforeCheckout = () => {
    const address = user?.address?.trim?.() || "";
    if (!address) {
      toaster.create({
        title: t('cart.errors.addressRequired'),
        description: t('cart.errors.addAddressBeforeCheckout'),
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
          title: t('cart.messages.paymentSuccessful'),
          description: t('cart.messages.orderPaidSuccessfully', { orderId }),
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
          title: t('cart.errors.paymentUpdateFailed'),
          description: e?.message || t('cart.errors.contactSupport'),
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
      const delivery_fee = 0;
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
        title: t('cart.messages.orderCreated'),
        description: t('cart.messages.orderCreatedSuccessfully', { orderId: resp?.id || "" }),
        type: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      dispatch(clearCart());
      navigate("/home/order");
    } catch (e) {
      toaster.create({
        title: t('cart.errors.orderCreationFailed'),
        description: e?.message || t('common.pleaseTryAgain'),
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
      const delivery_fee = 0;
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
        title: t('cart.errors.orderCreationFailed'),
        description: e?.message || t('common.pleaseTryAgain'),
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
        <Box gridColumn={{ base: "1 / -1", lg: isCartEmpty ? "1 / -1" : "1 / 3" }}>
          <CartSection />
        </Box>

        {!isCartEmpty && (
          <Box>
            <OrderSummarySection
              subtotal={subtotal}
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
