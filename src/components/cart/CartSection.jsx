import { Text, Box, Button, Flex } from "@chakra-ui/react";
import CartItemCard from "./CartItemCard";
import { useDispatch, useSelector } from "react-redux";
import {
  removeItemFromCart,
  updateQuantity,
} from "../../app/features/Customer/CartSlice";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import ScrollAreaComponent from "../ui/ScrollAreaComponent";
import EmptyCartStatus from "./EmptyCartStatus";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

export default function CartSection() {
  const { colorMode } = useColorMode();
  const { cartItems } = useSelector((state) => state.cart);
  console.log(cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveItem = (itemId) => {
    dispatch(removeItemFromCart(itemId));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleContinueShopping = () => {
    navigate(-1);
  };

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
      {/* Header with category selector */}
      <Flex
        direction="row"
        justifyContent="space-between"
        align="center"
        mb={3}
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color={
            colorMode == "light" ? colors.light.textMain : colors.dark.textMain
          }
        >
          Cart
        </Text>
        <Box>
          <Text
            fontWeight="light"
            color={
              colorMode == "light" ? colors.light.textSub : colors.dark.textSub
            }
          >
            {cartItems?.length || 0} items
          </Text>
        </Box>
      </Flex>
      {/* divider */}
      <Box
        w="100%"
        h="2px"
        bg={
          colorMode == "light"
            ? colors.light.textMain10a
            : colors.dark.textMain10a
        }
        mt={3}
        mb={5}
      />

      {/* Scrollable content */}
      <ScrollAreaComponent>
        {cartItems?.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            onRemove={handleRemoveItem}
            onQuantityChange={handleQuantityChange}
          />
        ))}
        {cartItems?.length === 0 && <EmptyCartStatus />}
      </ScrollAreaComponent>
      <Box>
        <Button
          color={
            colorMode == "light"
              ? colors.light.mainFixed
              : colors.dark.mainFixed
          }
          variant={"ghost"}
          size="lg"
          mt={4}
          w="180px"
          onClick={handleContinueShopping}
          bg={"transparent"}
        >
          <MdOutlineKeyboardArrowLeft />
          Continue Shopping
        </Button>
      </Box>
    </Box>
  );
}
