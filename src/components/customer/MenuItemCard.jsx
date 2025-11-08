import { Box, Flex, Text, Image, Card, IconButton, HStack } from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart, updateQuantity, removeItemFromCart } from "../../app/features/Customer/CartSlice";
import { Link } from "react-router-dom";
import { useDialog } from "@chakra-ui/react";
import CustomAlertDialog from "../../shared/CustomAlertDailog";
import { toaster } from "../../components/ui/toaster";

const MenuItemCard = ({ item, isAvailable = true }) => {
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();
  const { cartItems, cookerId } = useSelector((state) => state.cart);
  const dialog = useDialog();
  console.log("cartItems", item);
  // Find the current item in the cart
  const cartItem = cartItems.find((cartItem) => cartItem.id === item.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = item.stock <= 0;
  const isMaxQuantity = currentQuantity >= item.stock;
  const isRestaurantClosed = isAvailable === false;

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
      dispatch(updateQuantity({ id: item.id, quantity: cartItem.quantity - 1 }));
    } else {
      dispatch(removeItemFromCart(item.id));
    }
  };
  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRestaurantClosed || isMaxQuantity) return;
    dispatch(updateQuantity({ id: item.id, quantity: (cartItem?.quantity || 0) + 1 }));
  };
  return (
    <>
      <Card.Root
        as={Link}
        to={`/home/cookers/${item.cooker_id}/meals/${item.id}`}
        direction="row"
        overflow="hidden"
        cursor="pointer"
        maxW="100%"
        w="100%"
        border="none"
        borderRadius="20px"
        p={{ base: 2, md: 3 }}
        // _hover={{ shadow: "md", transform: "scale(1.02)" }}
        // transition="0.2s ease"
        justifyContent="center"
        bg={
          colorMode === "light" ? colors.light.bgFourth : colors.dark.bgFourth
        }
      >
        <Flex flex="1" direction="row">
          <Image
            src={item.menu_img}
            alt="Caffe Latte"
            boxSize={{ base: "70px", md: "90px", lg: "110px" }}
            objectFit="cover"
            borderRadius="12px"
          />
          <Flex ml={4} flex="1" direction="column">
            <Text
              fontWeight="medium"
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              mb={1}
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            >
              {item.title || "No Title"}
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
            >
              {item.description || "No Description Available"}
            </Text>
            <Flex justify="space-between" align="center" mt="auto">
              <Text
                fontWeight="semibold"
                fontSize={{ base: "sm", md: "md", lg: "lg" }}
                color={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
              >
                ${item.price?.toFixed(2)}
              </Text>
              {currentQuantity > 0 ? (
                <HStack px={3} py={1} spacing={2}>
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
                    aria-label="Decrease quantity"
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
                      colorMode === "light" ? colors.light.white : colors.dark.white
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
                      isMaxQuantity ? "Maximum quantity reached" : "Increase quantity"
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
                      ? "Restaurant is closed right now"
                      : isOutOfStock
                      ? "Out of stock"
                      : isMaxQuantity
                      ? "Maximum quantity reached"
                      : "Add to cart"
                  }
                  colorScheme="teal"
                  variant="outline"
                  size={{ base: "xs", md: "sm" }}
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
                    isOutOfStock || isMaxQuantity || isRestaurantClosed ? 0.7 : 1
                  }
                  isDisabled={isOutOfStock || isMaxQuantity || isRestaurantClosed}
                  title={
                    isRestaurantClosed
                      ? "Restaurant is closed right now"
                      : isOutOfStock
                      ? "Out of stock"
                      : isMaxQuantity
                      ? "Maximum quantity reached"
                      : "Add to cart"
                  }
                >
                  {isRestaurantClosed ? (
                    <Text fontSize={{ base: "2xs", md: "xs" }} px={2}>
                      Closed
                    </Text>
                  ) : isOutOfStock ? (
                    <Text fontSize={{ base: "2xs", md: "xs" }}>Out of Stock</Text>
                  ) : isMaxQuantity ? (
                    <Box
                      fontSize={{ base: "2xs", md: "xs" }}
                      p={{ base: 3, md: 5 }}
                      bg="transarent"
                    >
                      Out of Stock
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
        title={"Replace cart with new restaurant?"}
        description={
          "You already have items from another restaurant in your cart. Adding this item will remove your current cart. Do you want to continue?"
        }
        cancelTxt={"Cancel"}
        okTxt={"Yes, Replace"}
        onOkHandler={async () => {
          await dispatch(clearCart());
          await dispatch(addToCart(item));
          toaster.create({
            title: "Cart has been replaced",
            description:
              "Cart has been replaced with the new restaurant’s item",
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
