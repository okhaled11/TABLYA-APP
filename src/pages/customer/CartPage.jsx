import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CartSection from "../../components/cart/CartSection";
import OrderSummarySection from "../../components/cart/OrderSummarySection";
import { useGetUserDataQuery } from "../../app/features/Auth/authSlice";
import { toaster } from "../../components/ui/toaster";
import { useCreateOrderMutation } from "../../app/features/Customer/ordersSlice";
import { clearCart } from "../../app/features/Customer/CartSlice";

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, cookerId } = useSelector((state) => state.cart);
  const { data: user } = useGetUserDataQuery();
  const [createOrder] = useCreateOrderMutation();

  // Calculate subtotal from cart items
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleContinueShopping = () => {
    navigate("/home");
  };

  const handleCheckout = async (notes = "") => {
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
      return;
    }
    try {
      const delivery_fee = 0;
      const tax = 0;
      const total = subtotal + delivery_fee + tax;
      const resp = await createOrder({
        cooker_id: cookerId,
        subtotal,
        delivery_fee,
        tax,
        total,
        notes,
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
      navigate("/home");
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

  return (
    <Container maxW="container.xl" py={8} px={[4, 6, 8]}>
      <SimpleGrid
        columns={{ base: 1, lg: 3 }}
        spacing={8}
        gap={4}
        alignItems="flex-start"
      >
        <Box gridColumn={{ base: "1 / -1", lg: "1 / 3" }}>
          <CartSection />
        </Box>

        <Box>
          <OrderSummarySection
            subtotal={subtotal}
            onContinueShopping={handleContinueShopping}
            onCheckout={handleCheckout}
          />
        </Box>
      </SimpleGrid>
    </Container>
  );
}
