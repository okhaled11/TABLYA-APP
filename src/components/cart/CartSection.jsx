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
import { useTranslation } from "react-i18next";

export default function CartSection() {
  const { t, i18n } = useTranslation();
  const { colorMode } = useColorMode();
  const { cartItems } = useSelector((state) => state.cart);
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

  // Direct Arabic translations
  const translations = {
    title: i18n.language === 'ar' ? 'سلة التسوق' : 'Shopping Cart',
    items: i18n.language === 'ar' ? 'عناصر' : 'items',
    continueShopping: i18n.language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'
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
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
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
          {translations.title}
        </Text>
        <Box>
          <Text
            fontWeight="light"
            color={
              colorMode == "light" ? colors.light.textSub : colors.dark.textSub
            }
          >
            {cartItems?.length || 0} {translations.items}
          </Text>
        </Box>
      </Flex>
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
          w={i18n.language === 'ar' ? '200px' : '180px'}
          onClick={handleContinueShopping}
          bg={"transparent"}
          leftIcon={i18n.language === 'en' ? <MdOutlineKeyboardArrowLeft /> : null}
          rightIcon={i18n.language === 'ar' ? <MdOutlineKeyboardArrowLeft style={{ transform: 'rotate(180deg)' }} /> : null}
        >
          {translations.continueShopping}
        </Button>
      </Box>
    </Box>
  );
}