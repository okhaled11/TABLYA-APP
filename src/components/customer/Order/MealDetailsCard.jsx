import {
  Box,
  Flex,
  Text,
  Heading,
  Image,
  Button,
  IconButton,
  HStack,
  VStack,
  Icon,
  Container,
} from "@chakra-ui/react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoStar } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useColorMode } from "../../../theme/color-mode";
import colors from "../../../theme/color";
import imgMeal from "../../../assets/image31.png";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  updateQuantity,
} from "../../../app/features/Customer/CartSlice";
import { Link } from "react-router-dom";
import {truncateText} from "../../../utils/index"

const MealDetailsCard = ({ mealData, chefData }) => {

  const { colorMode } = useColorMode();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  if (!mealData || !chefData) {
    return <div>No data available</div>;
  }

  const availableStock = mealData.stock || 0;

  // Local state for count when item is not in cart
  const [localCount, setLocalCount] = useState (availableStock === 0 ? 0 : 1);

  // Get current quantity from cart or use local state
  const cartItem = cartItems.find((item) => item.id === mealData.id);
  const count = cartItem ? cartItem.quantity : localCount;

  const remainingStock =
    availableStock - count < 0 ? 0 : availableStock - count;

  const handleIncrement = () => {
    if (count < availableStock) {
      if (cartItem) {
        // If item is in cart, update its quantity in Redux
        dispatch(updateQuantity({ id: mealData.id, quantity: count + 1 }));
      } else {
        // If not in cart, update local state
        setLocalCount(localCount + 1);
      }
    }
  };

  const handleDecrement = () => {
    const minCount = availableStock === 0 ? 0 : 1;
    if (count > minCount) {
      if (cartItem) {
        // If item is in cart, update its quantity in Redux
        dispatch(updateQuantity({ id: mealData.id, quantity: count - 1 }));
      } else {
        // If not in cart, update local state
        setLocalCount(localCount - 1);
      }
    }
  };

  const totalPrice =
    count === 0
      ? mealData.price_for_customer.toFixed(2)
      : (mealData.price_for_customer * count).toFixed(2);

  const isOutOfStock = availableStock === 0 || !mealData.available;

  useEffect(() => {
    if (availableStock === 0) {
      if (cartItem && count !== 0) {
        dispatch(updateQuantity({ id: mealData.id, quantity: 0 }));
      } else if (!cartItem && localCount !== 0) {
        setLocalCount(0);
      }
    }
  }, [availableStock, count, cartItem, dispatch, mealData.id, localCount]);

  const handleAddToCart = () => {
    if (isOutOfStock || count === 0) {
      console.warn("Cannot add to cart: Out of stock or count is 0");
      return;
    }

    // If item already in cart, just update quantity
    if (cartItem) {
      dispatch(updateQuantity({ id: mealData.id, quantity: count }));
    } else {
      // New item, add to cart
      const newCartItem = {
        id: mealData.id,
        cooker_id: mealData.cooker_id,
        title: mealData.title,
        description: mealData.description,
        price_for_customer: Number(mealData.price_for_customer),
        price: Number(mealData.price_for_customer),
        available: mealData.available,
        prep_time_minutes: mealData.prep_time_minutes,
        created_at: mealData.created_at,
        category: mealData.category,
        menu_img: mealData.menu_img,
        quantity: count,
        stock: mealData.stock,
      };
      dispatch(addToCart(newCartItem));
    }
  };

  return (
    <Container maxW="container.xl" py={{ base: 4, md: 6 }}>
      <Flex
        direction={{ base: "column", lg: "row" }}
        gap={{ base: 4, lg: 6 }}
        alignItems="stretch"
      >
        {/* Left Side - Image */}
        <Box
          flex="1"
          maxW={{ base: "100%", lg: "550px" }}
          position="relative"
          display="flex"
          flexDirection="column"
          // maxH={{ base: "400px", lg: "570px" }}
        >
          <Box
            borderRadius="24px"
            overflow="hidden"
            boxShadow="md"
            p={3}
            bg={
              colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
            }
            flex="1"
          >
            <Image
              src={mealData.menu_img || imgMeal}
              alt={mealData.title || "Meal"}
              w="100%"
              h="100%"
              objectFit="cover"
              borderRadius="12px"
            />
          </Box>
        </Box>

        {/* Right Side - Details */}
        <Box
          flex="1"
          // maxH={{ base: "550px", md: "570px" }}
          borderRadius="2xl"
          p={{ base: 4, md: 6 }}
          bg={
            colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
          }
        >
          <VStack align="stretch" gap={4}>
            {/* Title */}
            <Heading
              as="h1"
              size={{ base: "xl", md: "2xl" }}
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            >
              {mealData.title}
            </Heading>

            {/* Description */}
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color={
                colorMode === "light"
                  ? colors.light.textSub
                  : colors.dark.textSub
              }
              lineHeight="1.8"
            >
              {truncateText(mealData.description, 150)}
            </Text>

            {/* Price */}
            <Text
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              color={
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed
              }
            >
              {totalPrice} LE
            </Text>
            {/* {count > 1 && (
              <Text
                fontSize="sm"
                color={
                  colorMode === "light"
                    ? colors.light.textSub
                    : colors.dark.textSub
                }
              >
                ({mealData.price.toFixed(2)} LE × {count})
              </Text>
            )} */}

            {/* Separator */}
            <Box
              h="1px"
              bg={
                colorMode === "light"
                  ? colors.light.textSub + "40"
                  : colors.dark.textSub + "40"
              }
            />

            {/* Count Section */}
            <Box>
              <Flex justify="space-between" align="center">
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="600"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  Count
                </Text>
                <HStack gap={3}>
                  <IconButton
                    onClick={handleDecrement}
                    isDisabled={count <= 0 || count === 1 || isOutOfStock}
                    size={{ base: "sm", md: "md" }}
                    borderRadius="md"
                    variant="outline"
                    borderColor={
                      colorMode === "light"
                        ? colors.light.textSub
                        : colors.dark.textSub
                    }
                    color={
                      colorMode === "light"
                        ? colors.light.textMain
                        : colors.dark.textMain
                    }
                    _hover={{
                      bg:
                        colorMode === "light"
                          ? colors.light.mainFixed20a
                          : colors.dark.mainFixed20a,
                    }}
                  >
                    <Icon as={FiMinus} boxSize={4} />
                  </IconButton>

                  <Text
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="bold"
                    minW="40px"
                    textAlign="center"
                    color={
                      colorMode === "light"
                        ? colors.light.textMain
                        : colors.dark.textMain
                    }
                  >
                    {count}
                  </Text>

                  <IconButton
                    onClick={handleIncrement}
                    isDisabled={count >= availableStock || isOutOfStock}
                    size={{ base: "sm", md: "md" }}
                    borderRadius="md"
                    bg={
                      colorMode === "light"
                        ? colors.light.mainFixed
                        : colors.dark.mainFixed
                    }
                    color="white"
                    _hover={{
                      bg:
                        colorMode === "light"
                          ? colors.light.mainFixedActive
                          : colors.dark.mainFixedActive,
                    }}
                  >
                    <Icon as={FiPlus} boxSize={4} />
                  </IconButton>
                </HStack>
              </Flex>

              {/* Stock Information */}
              <Flex gap={4} mt={2} flexWrap="wrap">
                {/* <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color={
                    colorMode === "light"
                      ? colors.light.textSub
                      : colors.dark.textSub
                  }
                >
                  Available: {mealData.available ? "Yes" : "No"}
                </Text> */}
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="600"
                  color={
                    remainingStock > 0
                      ? colorMode === "light"
                        ? colors.light.success
                        : colors.dark.success
                      : colorMode === "light"
                      ? colors.light.error
                      : colors.dark.error
                  }
                >
                  Stock: {availableStock} | Remaining: {remainingStock}
                </Text>
              </Flex>
            </Box>
            {/* Separator */}
            <Box
              h="1px"
              bg={
                colorMode === "light"
                  ? colors.light.textSub + "40"
                  : colors.dark.textSub + "40"
              }
            />
            {/* Prepared By Section */}
            <Box>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="600"
                mb={3}
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
              >
                Prepared By
              </Text>
              <Flex
                align="center"
                gap={3}
                p={4}
                borderRadius="xl"
                bg={
                  colorMode === "light"
                    ? colors.light.warning10a
                    : colors.dark.warning10a
                }
              >
                <Box
                  w={{ base: "50px", md: "60px" }}
                  h={{ base: "50px", md: "60px" }}
                  borderRadius="full"
                  overflow="hidden"
                  flexShrink={0}
                  bg={
                    colorMode === "light"
                      ? colors.light.bgSecondary
                      : colors.dark.bgSecondary
                  }
                >
                  <Image
                    src={chefData.users.avatar_url || imgMeal}
                    alt={chefData.kitchen_name || "Chef"}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </Box>
                <Box flex="1">
                  <Text
                    fontWeight="600"
                    fontSize={{ base: "md", md: "lg" }}
                    color={
                      colorMode === "light"
                        ? colors.light.textMain
                        : colors.dark.textMain
                    }
                  >
                    {chefData.users.name || "Chef's Kitchen"}
                  </Text>
                  <HStack gap={1} mt={1}>
                    <Icon
                      as={IoStar}
                      color={
                        colorMode === "light"
                          ? colors.light.warning
                          : colors.dark.warning
                      }
                      boxSize={4}
                    />
                    <Text
                      fontSize="sm"
                      color={
                        colorMode === "light"
                          ? colors.light.textSub
                          : colors.dark.textSub
                      }
                    >
                      {chefData.avg_rating
                        ? chefData.avg_rating.toFixed(1)
                        : "N/A"}{" "}
                      ({chefData.total_reviews || 0} Reviews)
                    </Text>
                  </HStack>
                </Box>
              </Flex>
            </Box>

            {/* Action Buttons */}
            <HStack gap={4} mt={4}>
              <Button
                flex="1"
                size={{ base: "md", md: "lg" }}
                bg={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                color="white"
                borderRadius="xl"
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="600"
                py={{ base: 6, md: 7 }}
                onClick={handleAddToCart}
                isDisabled={isOutOfStock}
                _hover={{
                  bg:
                    colorMode === "light"
                      ? colors.light.mainFixedActive
                      : colors.dark.mainFixedActive,
                  transform: "translateY(-2px)",
                }}
                _active={{
                  transform: "scale(0.98)",
                }}
                transition="all 0.2s"
              >
                Add To Cart
              </Button>

              <Button
                as={!isOutOfStock && count > 0 ? Link : undefined}
                to={!isOutOfStock && count > 0 ? "/home/cart" : undefined}
                flex="1"
                size={{ base: "md", md: "lg" }}
                variant="outline"
                onClick={handleAddToCart}
                isDisabled={isOutOfStock || count === 0}
                borderColor={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                color={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                borderRadius="xl"
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="600"
                py={{ base: 6, md: 7 }}
                borderWidth="2px"
                _hover={{
                  bg:
                    colorMode === "light"
                      ? colors.light.mainFixed20a
                      : colors.dark.mainFixed20a,
                  transform: "translateY(-2px)",
                }}
                _active={{
                  transform: "scale(0.98)",
                }}
                transition="all 0.2s"
              >
                Buy Now
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default MealDetailsCard;
