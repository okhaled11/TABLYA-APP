import {
  Box,
  Flex,
  Text,
  Image,
  Card,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaShoppingCart } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  clearCart,
  updateQuantity,
  removeItemFromCart,
} from "../../app/features/Customer/CartSlice";
import { Link } from "react-router-dom";
import { useDialog } from "@chakra-ui/react";
import CustomAlertDialog from "../../shared/CustomAlertDailog";
import { toaster } from "../../components/ui/toaster";
import { truncateText } from "../../utils";

const MenuItemCard = ({ item, isAvailable, isBusy }) => {
  const { colorMode } = useColorMode();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { cartItems, cookerId } = useSelector((state) => state.cart);
  const dialog = useDialog();
  // console.log("cartItems", item);
  // Find the current item in the cart
  const cartItem = cartItems.find((cartItem) => cartItem.id === item.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = item.stock <= 0;
  const isMaxQuantity = currentQuantity >= item.stock;
  // Use availability from DB (menu_items.available) instead of parent flag
  // Also check if chef is busy
  const isRestaurantClosed = item?.available === false || isAvailable === false || isBusy === true;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isMaxQuantity || isRestaurantClosed) return;
    if (cartItems.length === 0 || cookerId === item.cooker_id) {
      dispatch(addToCart(item));
      return;
    }
    dialog.setOpen(true);
  };
  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cartItem) return;
    if (cartItem.quantity > 1) {
      dispatch(
        updateQuantity({ id: item.id, quantity: cartItem.quantity - 1 })
      );
    } else {
      dispatch(removeItemFromCart(item.id));
    }
  };
  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRestaurantClosed || isMaxQuantity) return;

    if (cartItem) {
      // Item already in cart, just update quantity
      dispatch(
        updateQuantity({ id: item.id, quantity: cartItem.quantity + 1 })
      );
    } else {
      // Item not in cart, add it first
      if (cartItems.length === 0 || cookerId === item.cooker_id) {
        dispatch(addToCart(item));
      } else {
        dialog.setOpen(true);
      }
    }
  };
  const isDetailsDisabled = isOutOfStock || isRestaurantClosed; // block when stock is 0 or restaurant is closed

  return (
    <>

      <Card.Root
        dir={i18n.dir()}
        as={isDetailsDisabled ? Box : Link}
        to={
          isDetailsDisabled
            ? undefined
            : `/home/cookers/${item.cooker_id}/meals/${item.id}`
        }
        direction="row"
        overflow="hidden"
        cursor={isDetailsDisabled ? "not-allowed" : "pointer"}
        maxW="100%"
        w="100%"
        border="none"
        borderRadius="20px"
        p={{ base: 2, md: 3 }}
        // _hover={{ shadow: "md", transform: "scale(1.02)" }}
        // transition="0.2s ease 
        // in-out "
        // test
        justifyContent="center"
        bg={
          colorMode === "light" ? colors.light.bgFourth : colors.dark.bgFourth
        }
        onClick={(e) => {
          if (isDetailsDisabled) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <Flex flex="1" direction="row" minW="0">
          <Image
            src={item.menu_img}
            alt="item-img"
            boxSize={{ base: "70px", md: "90px", lg: "110px" }}
            objectFit="cover"
            borderRadius="12px"
            flexShrink={0}
          />
          <Flex ms={4} flex="1" direction="column" minW="0">
            <Text
              fontWeight="medium"
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              mb={1}
              noOfLines={1}
              overflowWrap="anywhere"
              wordBreak="break-word"
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
              textAlign="start"
            >
              {truncateText(item.title, 20) || t("menuItemCard.noTitle")}
            </Text>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight="light"
              color={
                colorMode === "light"
                  ? colors.light.textSub
                  : colors.dark.textSub
              }
              noOfLines={2}
              overflowWrap="anywhere"
              wordBreak="break-word"
              textAlign="start"
            >
              {truncateText(item.description, 200) ||
                t("menuItemCard.noDesc")}
            </Text>
            <Flex
              justify="space-between"
              align="center"
              mt="auto"
              minW="0"
              gap={2}
            >
              <Text
                fontWeight="semibold"
                fontSize={{ base: "sm", md: "md", lg: "lg" }}
                color={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
              >
                {item?.price_for_customer.toFixed(2)} {t("common.currency")}
              </Text>
              {currentQuantity > 0 ? (
                <HStack px={3} py={1} spacing={2} flexShrink={0}>
                  <IconButton
                    borderWidth="1px"
                    borderRadius="10px"
                    borderColor={
                      colorMode === "light"
                        ? colors.light.textSub
                        : colors.dark.textSub
                    }
                    color={
                      colorMode === "light"
                        ? colors.light.textSub
                        : colors.dark.textSub
                    }
                    _hover={
                      currentQuantity > 1
                        ? {
                            bg:
                              colorMode === "light"
                                ? colors.light.mainFixed
                                : colors.dark.mainFixed,
                            color:
                              colorMode === "light"
                                ? colors.light.white
                                : colors.dark.white,
                          }
                        : {}
                    }
                    transition="0.2s ease"
                    size="xs"
                    variant="ghost"
                    onClick={handleDecrement}
                    aria-label={t("menuItemCard.decrease")}
                    opacity={currentQuantity > 1 ? 1 : 0.5}
                    cursor={currentQuantity > 1 ? "pointer" : "pointer"}
                  >
                    -
                  </IconButton>

                  <Text
                    minW="24px"
                    textAlign="center"
                    color={
                      colorMode === "light"
                        ? colors.light.textMain
                        : colors.dark.textMain
                    }
                  >
                    {currentQuantity}
                  </Text>

                  <IconButton
                    borderWidth="1px"
                    borderRadius="10px"
                    borderColor={
                      colorMode === "light"
                        ? colors.light.mainFixed
                        : colors.dark.mainFixed
                    }
                    bg={
                      colorMode === "light"
                        ? colors.light.mainFixed
                        : colors.dark.mainFixed
                    }
                    color={
                      colorMode === "light"
                        ? colors.light.white
                        : colors.dark.white
                    }
                    _hover={
                      !isMaxQuantity
                        ? {
                            bg:
                              colorMode === "light"
                                ? colors.light.white
                                : colors.dark.white,
                            color:
                              colorMode === "light"
                                ? colors.light.mainFixed
                                : colors.dark.mainFixed,
                          }
                        : {}
                    }
                    transition="0.2s ease"
                    size="xs"
                    variant="ghost"
                    onClick={handleIncrement}
                    aria-label={
                      isMaxQuantity
                        ? t("menuItemCard.maxReached")
                        : t("menuItemCard.increase")
                    }
                    opacity={isMaxQuantity ? 0.5 : 1}
                    cursor={isMaxQuantity ? "not-allowed" : "pointer"}
                  >
                    +
                  </IconButton>
                </HStack>
              ) : (
                <IconButton
                  onClick={handleAddToCart}
                  aria-label={
                    isRestaurantClosed
                      ? t("menuItemCard.closed")
                      : isOutOfStock
                      ? t("menuItemCard.outOfStock")
                      : isMaxQuantity
                      ? t("menuItemCard.maxReached")
                      : t("menuItemCard.addToCart")
                  }
                  colorScheme="teal"
                  variant="outline"
                  size={{ base: "xs", md: "sm" }}
                  flexShrink={0}
                  rounded="full"
                  _hover={
                    !isOutOfStock && !isMaxQuantity && !isRestaurantClosed
                      ? { transform: "scale(1.05)" }
                      : {}
                  }
                  transition="0.2s ease"
                  bg={
                    isOutOfStock || isMaxQuantity || isRestaurantClosed
                      ? colorMode === "light"
                        ? colors.light.bgDisabled
                        : colors.dark.bgDisabled
                      : colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                  color={
                    isOutOfStock || isMaxQuantity || isRestaurantClosed
                      ? colorMode === "light"
                        ? colors.light.textDisabled
                        : colors.dark.textDisabled
                      : "white"
                  }
                  cursor={
                    isOutOfStock || isMaxQuantity || isRestaurantClosed
                      ? "not-allowed"
                      : "pointer"
                  }
                  opacity={
                    isOutOfStock || isMaxQuantity || isRestaurantClosed
                      ? 0.7
                      : 1
                  }
                  isDisabled={
                    isOutOfStock || isMaxQuantity || isRestaurantClosed
                  }
                  title={
                    isRestaurantClosed
                      ? t("menuItemCard.closed")
                      : isOutOfStock
                      ? t("menuItemCard.outOfStock")
                      : isMaxQuantity
                      ? t("menuItemCard.maxReached")
                      : t("menuItemCard.addToCart")
                  }
                >
                  {isRestaurantClosed ? (
                    <HStack spacing={1} align="center" px={2} flexShrink={0}>
                      <RxCross2 />
                      <Text fontSize={{ base: "2xs", md: "xs" }}>{t("menuItemCard.closed")}</Text>
                    </HStack>
                  ) : isOutOfStock ? (
                    <Text fontSize={{ base: "2xs", md: "xs" }}>
                      {t("menuItemCard.outOfStock")}
                    </Text>
                  ) : isMaxQuantity ? (
                    <Box
                      fontSize={{ base: "2xs", md: "xs" }}
                      p={{ base: 3, md: 5 }}
                      bg="transarent"
                    >
                      {t("menuItemCard.outOfStock")} 
                    </Box>
                  ) : (
                    <FaShoppingCart />
                  )}
                </IconButton>
              )}
              
            </Flex>
          </Flex>
        </Flex>
      </Card.Root>
      <CustomAlertDialog
        dialog={dialog}
        title={t("menuItemCard.replaceDialog.title")}
        description={
         t("menuItemCard.replaceDialog.desc")
        }
        cancelTxt={t("menuItemCard.replaceDialog.cancel")}
        okTxt={t("menuItemCard.replaceDialog.confirm")}
        onOkHandler={async () => {
          await dispatch(clearCart());
          await dispatch(addToCart(item));
          toaster.create({
            title: t("menuItemCard.replaceSuccess.title"),
            description:
              t("menuItemCard.replaceSuccess.desc"),
            type: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });

        }}
      />

    </>
  );
};

export default MenuItemCard;
 