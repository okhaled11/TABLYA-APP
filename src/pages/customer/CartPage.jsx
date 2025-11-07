import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CartSection from "../../components/cart/CartSection";
import OrderSummarySection from "../../components/cart/OrderSummarySection";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  // Calculate subtotal from cart items
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleContinueShopping = () => {
    navigate("/home");
  };

  const handleCheckout = () => {
    // Handle checkout logic here
    console.log("Proceeding to checkout");
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
