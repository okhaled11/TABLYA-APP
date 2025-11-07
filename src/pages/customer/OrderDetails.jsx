import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Grid,
  GridItem,
  Heading,
  Icon,
  VStack,
  HStack,
  Steps,
  Image,
} from "@chakra-ui/react";
import {
  IoArrowBack,
  IoLocationSharp,
  IoTimeOutline,
  IoCall,
  IoStar,
} from "react-icons/io5";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import imgChef from "../../assets/image 17.png";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../../app/features/Customer/Orders/ordersApiCustomerSlice";

function OrderDetails() {
  /* ------------variable------------------------ */
  const { orderId } = useParams();
  const { colorMode } = useColorMode();
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  
  /* ----------------------DATA FETCHING------------------ */
  const { data: orderDetails, isLoading, error } = useGetOrderDetailsQuery(orderId, {
    skip: !orderId,
  });

  useEffect(() => {
    if (orderDetails?.status) {
      const status = orderDetails.status;
      if (status === "confirmed" || status === "created") {
        setCurrentStep(1);
      } else if (status === "preparing") {
        setCurrentStep(2);
      } else if (status === "out_for_delivery") {
        setCurrentStep(3);
      } else if (status === "delivered") {
        setCurrentStep(4);
      }
    }
  }, [orderDetails?.status]);

  // Loading state
  if (isLoading) {
    return (
      <Box minH="100vh" p={{ base: 3, md: 8 }}>
        <Text>Loading order details...</Text>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box minH="100vh" p={{ base: 3, md: 8 }}>
        <Text color="red.500">Error loading order: {error}</Text>
      </Box>
    );
  }

  // No data
  if (!orderDetails) {
    return (
      <Box minH="100vh" p={{ base: 3, md: 8 }}>
        <Text>Order not found</Text>
      </Box>
    );
  }

  // Sample order data (fallback)
  const orderData = {
    date: "29/10/2025",
    time: "10:50 AM",
    orderId: "#ORD-2025-001234",
    status: "cooking", // 'placed', 'cooking', 'out_for_delivery', 'delivered'
    items: [
      {
        id: 1,
        name: "Traditional Koshari",
        price: 55.0,
        quantity: 5,
        image: imgChef,
      },
      {
        id: 2,
        name: "Traditional Koshari",
        price: 55.0,
        quantity: 5,
        image: imgChef,
      },
      {
        id: 3,
        name: "Traditional Koshari",
        price: 55.0,
        quantity: 5,
        image: imgChef,
      },

      {
        id: 4,
        name: "Egyptian Meat Hawawshi Pie",
        price: 95.0,
        quantity: 3,
        image: imgChef,
      },
      {
        id: 5,
        name: "Meat Béchamel Pasta",
        price: 120.0,
        quantity: 4,
        image: imgChef,
      },
    ],
    subtotal: 500,
    deliveryFee: 35,
    total: 535,
    delivery: {
      address: "123 Ahmed Oraby Street, Suez",
      time: "Today, 07:00 PM",
      phone: "01234567890",
    },
    cooker: {
      name: "Chef Ahmed's Kitchen",
      rating: 4.8,
      reviews: 324,
      image: imgChef,
    },
  };

  const steps = [
    { key: "placed", title: "confirmed", icon: "📋" },
    { key: "cooking", title: "preparing", icon: "🔥" },
    { key: "out_for_delivery", title: "out_for_delivery", icon: "🚚" },
    { key: "delivered", title: "delivered", icon: "🏠" },
  ];
  useEffect(() => {
    stepperStatus();
  }, [setCurrentStep]);
  return (
    <Box minH="100vh" p={{ base: 3, md: 8 }}>
      <Box maxW="6xl" mx="auto">
        {/* Header */}
        <Flex
          align="center"
          gap={{ base: 2, md: 4 }}
          mb={{ base: 4, md: 6 }}
          onClick={() => navigate(-1)}
        >
          <Button
            variant="ghost"
            color="white"
            _hover={{ color: "gray.300" }}
            p={0}
            minW="auto"
          >
            <Icon
              as={IoArrowBack}
              boxSize={{ base: 6, md: 7 }}
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            />
          </Button>
          <Heading as="h1" size={{ base: "xl", md: "2xl" }}>
            Order Tracking
          </Heading>
        </Flex>

        {/* Main Content Container */}
        <Box
          border={{ base: "1px", md: "2px" }}
          bg={
            colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
          }
          borderRadius="lg"
          p={{ base: 3, md: 6 }}
          backdropFilter="blur(10px)"
        >
          {/* Order Info */}
          <Text
            color="gray.400"
            fontSize={{ base: "xs", md: "sm" }}
            mb={{ base: 4, md: 8 }}
          >
            {new Date(orderDetails.created_at).toLocaleDateString("en-GB")} | {new Date(orderDetails.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} | #{orderDetails.id.slice(0, 8)}
          </Text>

          {/* Status Tracker */}
          <Box mb={{ base: 4, md: 8 }} px={{ base: 0, md: 4 }}>
            <Steps.Root
              step={currentStep}
              count={steps.length}
              colorPalette="green"
              size={{ base: "sm", md: "lg" }}
            >
              <Steps.List gap={{ base: 0, md: 4 }}>
                {steps.map((step, index) => (
                  <Steps.Item key={step.key} index={index}>
                    <VStack gap={0} position="relative" spacing={0}>
                      <Steps.Indicator
                        style={{
                          fontSize: "2xl",
                          width: "50px",
                          height: "50px",
                        }}
                        css={{
                          "@media (min-width: 768px)": {
                            width: "64px",
                            height: "64px",
                          },
                        }}
                      >
                        <Text fontSize={{ base: "xl", md: "2xl" }}>
                          {step.icon}
                        </Text>
                      </Steps.Indicator>
                      <Box
                        position="absolute"
                        bottom={{ base: "-38px", md: "-30px" }}
                        left="50%"
                        transform="translateX(-50%)"
                        w={{ base: "165px", md: "180px" }}
                        textAlign="center"
                        px={{ base: 0.5, md: 0 }}
                      >
                        <Steps.Title
                          fontSize={{ base: "xs", sm: "10px", md: "xl" }}
                          fontWeight="medium"
                          color={
                            colorMode === "light"
                              ? colors.light.success
                              : colors.dark.success
                          }
                          _incomplete={{ color: "gray.500" }}
                          lineHeight={{ base: "1.1", md: "1.5" }}
                          noOfLines={2}
                          wordBreak="break-word"
                        >
                          {step.title}
                        </Steps.Title>
                      </Box>
                    </VStack>
                    {index < steps.length - 1 && <Steps.Separator />}
                  </Steps.Item>
                ))}
              </Steps.List>

              {/* Navigation Buttons */}
              <Flex
                justify="center"
                gap={{ base: 2, md: 4 }}
                mt={{ base: 14, md: 12 }}
              >
                <Steps.PrevTrigger asChild>
                  <Button
                    size={{ base: "xs", md: "sm" }}
                    variant="outline"
                    colorPalette="green"
                    onClick={() =>
                      setCurrentStep((prev) => Math.max(0, prev - 1))
                    }
                    isDisabled={currentStep === 0}
                    fontSize={{ base: "xs", md: "sm" }}
                    px={{ base: 3, md: 4 }}
                  >
                    Previous
                  </Button>
                </Steps.PrevTrigger>
                <Steps.NextTrigger asChild>
                  <Button
                    size={{ base: "xs", md: "sm" }}
                    variant="outline"
                    colorPalette="green"
                    onClick={() =>
                      setCurrentStep((prev) =>
                        Math.min(steps.length - 1, prev + 1)
                      )
                    }
                    isDisabled={currentStep === steps.length - 1}
                    fontSize={{ base: "xs", md: "sm" }}
                    px={{ base: 3, md: 4 }}
                  >
                    Next
                  </Button>
                </Steps.NextTrigger>
              </Flex>
            </Steps.Root>
          </Box>

          {/* Content Grid */}
          <Grid
            templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
            gap={{ base: 4, md: 6 }}
          >
            {/* Left Column - Order Items */}
            <GridItem
              rounded={"lg"}
              bg={
                colorMode === "light"
                  ? colors.light.bgFourth
                  : colors.dark.bgFourth
              }
            >
              <VStack gap={{ base: 3, md: 4 }} align="stretch">
                {/* Order Items */}
                <Box borderRadius="xl" p={{ base: 2, md: 4 }}>
                  <VStack gap={{ base: 2, md: 3 }} align="stretch">
                    {orderDetails.order_items?.map((item) => (
                      <Flex
                        key={item.id}
                        align="center"
                        gap={{ base: 2, md: 4 }}
                        bg={
                          colorMode === "light"
                            ? colors.light.bgFourth
                            : colors.dark.bgFourth
                        }
                        borderRadius="lg"
                        p={{ base: 2, md: 3 }}
                        _hover={{ bg: "whiteAlpha.200" }}
                        transition="all 0.2s"
                      >
                        <Box
                          w={{ base: 12, md: 16 }}
                          h={{ base: 12, md: 16 }}
                          borderRadius="lg"
                          overflow="hidden"
                          flexShrink={0}
                        >
                          <Image
                            src={item.menu_items?.menu_img || imgChef}
                            alt={item.menu_items?.title || "Food item"}
                            w="full"
                            h="full"
                            objectFit="cover"
                          />
                        </Box>
                        <Box flex={1} minW={0}>
                          <Heading
                            as="h3"
                            size={{ base: "xs", md: "sm" }}
                            color={
                              colorMode === "light"
                                ? colors.light.textMain
                                : colors.dark.textMain
                            }
                            mb={1}
                            noOfLines={1}
                          >
                            {item.title || item.menu_items?.title}
                          </Heading>
                          <Text
                            color="gray.400"
                            fontSize={{ base: "xs", md: "sm" }}
                          >
                            Price: {(item.price_at_order || item.menu_items?.price || 0).toFixed(2)} LE
                          </Text>
                        </Box>
                        <Text
                          color={
                            colorMode === "light"
                              ? colors.light.textMain
                              : colors.dark.textMain
                          }
                          fontWeight="bold"
                          fontSize={{ base: "md", md: "lg" }}
                          flexShrink={0}
                        >
                          x{item.quantity}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>

                {/* Cancel Order Button */}
                <Button
                  w="fit"
                  mx={"auto"}
                  mb={{ base: 2, md: 4 }}
                  py={{ base: 3, md: 5 }}
                  px={{ base: 6, md: 8 }}
                  border="2px solid"
                  borderColor={
                    colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                  color="red.500"
                  bg="transparent"
                  borderRadius="lg"
                  fontWeight="semibold"
                  fontSize={{ base: "sm", md: "md" }}
                  _hover={{ bg: "red.600/10" }}
                  transition="all 0.2s"
                >
                  Cancel Order
                </Button>
              </VStack>
            </GridItem>

            {/* Right Column - Bill & Info */}
            <GridItem>
              <VStack gap={{ base: 3, md: 4 }} align="stretch">
                {/* Bill Details */}
                <Box
                  bg={
                    colorMode === "light"
                      ? colors.light.mainFixed10a
                      : colors.dark.mainFixed10a
                  }
                  borderRadius="xl"
                  p={{ base: 3, md: 5 }}
                >
                  <Heading
                    as="h2"
                    size={{ base: "md", md: "lg" }}
                    color={
                      colorMode === "light"
                        ? colors.light.textMain
                        : colors.dark.textMain
                    }
                    mb={{ base: 3, md: 4 }}
                  >
                    Bill Details
                  </Heading>
                  <VStack gap={2} align="stretch">
                    <Flex justify="space-between" color="gray.300">
                      <Text
                        color={
                          colorMode === "light"
                            ? colors.light.textSub
                            : colors.dark.textSub
                        }
                      >
                        Subtotal
                      </Text>
                      <Text
                        color={
                          colorMode === "light"
                            ? colors.light.textMain
                            : colors.dark.textMain
                        }
                      >
                        {orderData.subtotal} LE
                      </Text>
                    </Flex>
                    <Flex justify="space-between" color="gray.300">
                      <Text
                        color={
                          colorMode === "light"
                            ? colors.light.textSub
                            : colors.dark.textSub
                        }
                      >
                        Delivery Fee
                      </Text>
                      <Text
                        color={
                          colorMode === "light"
                            ? colors.light.textMain
                            : colors.dark.textMain
                        }
                      >
                        {orderData.deliveryFee} LE
                      </Text>
                    </Flex>
                    <Box borderTop="1px" borderColor="red.800" my={3} />
                    <Flex
                      justify="space-between"
                      color="red.400"
                      fontSize="xl"
                      fontWeight="bold"
                    >
                      <Text>Total</Text>
                      <Text>{orderData.total} LE</Text>
                    </Flex>
                  </VStack>
                </Box>

                {/* Delivery Information */}
                <Box
                  bg={
                    colorMode === "light"
                      ? colors.light.info10a
                      : colors.dark.info10a
                  }
                  borderRadius="xl"
                  p={{ base: 3, md: 5 }}
                >
                  <Heading
                    as="h2"
                    size={{ base: "md", md: "lg" }}
                    color={
                      colorMode === "light"
                        ? colors.light.textMain
                        : colors.dark.textMain
                    }
                    mb={{ base: 3, md: 4 }}
                  >
                    Delivery Information
                  </Heading>
                  <VStack gap={3} align="stretch">
                    <HStack align="start" gap={3} color="cyan.400">
                      <Icon
                        as={IoLocationSharp}
                        boxSize={5}
                        flexShrink={0}
                        mt={1}
                      />
                      <Text
                        color={
                          colorMode === "light"
                            ? colors.light.textSub
                            : colors.dark.textSub
                        }
                      >
                        {orderData.delivery.address}
                      </Text>
                    </HStack>
                    <HStack gap={3} color="cyan.400">
                      <Icon as={IoTimeOutline} boxSize={5} flexShrink={0} />
                      <Text
                        color={
                          colorMode === "light"
                            ? colors.light.textSub
                            : colors.dark.textSub
                        }
                      >
                        {orderData.delivery.time}
                      </Text>
                    </HStack>
                    <HStack gap={3} color="cyan.400">
                      <Icon as={IoCall} boxSize={5} flexShrink={0} />
                      <Text
                        color={
                          colorMode === "light"
                            ? colors.light.textSub
                            : colors.dark.textSub
                        }
                      >
                        {orderData.delivery.phone}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                {/* Cooker Information */}
                <Box borderRadius="xl" p={{ base: 3, md: 6 }}>
                  <Heading
                    as="h2"
                    size={{ base: "md", md: "xl" }}
                    mb={{ base: 3, md: 6 }}
                  >
                    Cooker Information
                  </Heading>
                  <Flex
                    align="center"
                    gap={{ base: 3, md: 4 }}
                    bg={
                      colorMode === "light"
                        ? colors.light.warning10a
                        : colors.dark.warning10a
                    }
                    borderRadius="xl"
                    p={{ base: 3, md: 5 }}
                  >
                    <Box
                      w={{ base: 16, md: 20 }}
                      h={{ base: 16, md: 20 }}
                      borderRadius="full"
                      overflow="hidden"
                      flexShrink={0}
                    >
                      <Box
                        w="full"
                        h="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize={{ base: "2xl", md: "3xl" }}
                      >
                        <Image
                          src={orderData.cooker.image}
                          alt="Naruto Uzumaki"
                          w="full"
                          h="full"
                          objectFit="cover"
                        />
                      </Box>
                    </Box>
                    <Box flex={1} minW={0}>
                      <Heading
                        as="h3"
                        size={{ base: "sm", md: "lg" }}
                        mb={{ base: 1, md: 2 }}
                        noOfLines={1}
                      >
                        {orderData.cooker.name}
                      </Heading>
                      <HStack
                        gap={{ base: 1, md: 2 }}
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        <Icon
                          as={IoStar}
                          boxSize={{ base: 4, md: 5 }}
                          color="orange.400"
                        />
                        <Text fontWeight="bold" color="orange.400">
                          {orderData.cooker.rating}
                        </Text>
                        <Text
                          color={
                            colorMode === "light"
                              ? colors.light.textSub
                              : colors.dark.textSub
                          }
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          ({orderData.cooker.reviews} Reviews)
                        </Text>
                      </HStack>
                    </Box>
                  </Flex>
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default OrderDetails;
