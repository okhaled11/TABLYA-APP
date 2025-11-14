import {
  Button,
  Text,
  Image,
  VStack,
  HStack,
  Flex,
  Box,
  Badge,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import CookieService from "../../services/cookies";
import { useGetUserDataQuery } from "../../app/features/Auth/authSlice";
import { supabase } from "../../services/supabaseClient";
import {
  useGetCustomerOrdersQuery,
  useCancelOrderMutation,
} from "../../app/features/Customer/Orders/ordersApiCustomerSlice";
import { useGetCustomerOrderHistoryQuery } from "../../app/features/Customer/Orders/OrdersHistoryCustomerSlice";
import { toaster } from "../../components/ui/toaster";
import {
  IoFlagOutline,
  IoReceiptOutline,
  IoTimeOutline,
} from "react-icons/io5";
import {
  useCreateReportMutation,
  useGetUserReportsQuery,
} from "../../app/features/Customer/Reports/reportsApiSlice";

const OrderPage = () => {
  /* --------------------data login id as sub---------------------- */
  const token = CookieService.get("access_token");
  const { data: userData } = useGetUserDataQuery(undefined, {
    skip: !token,
  });
  const userId = userData?.sub;
  console.log(userId);

  /* --------------------------state------------------------- */
  const { colorMode } = useColorMode();
  const [hiddenOrderIds, setHiddenOrderIds] = useState([]);
  const [orderStatusTracker, setOrderStatusTracker] = useState({});
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportTargetId, setReportTargetId] = useState(null);

  /* --------------------------HOOKS------------------------- */
  const navigate = useNavigate();
  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useGetCustomerOrdersQuery(userId, {
    skip: !userId,
  });
  const { data: orderHistory, isLoading: orderHistoryLoading } =
    useGetCustomerOrderHistoryQuery(userId, {
      skip: !userId,
    });
  const [createReport, { isLoading: reportLoading }] =
    useCreateReportMutation();
  const { data: userReports } = useGetUserReportsQuery(userId, {
    skip: !userId,
  });
  const [cancelOrder, { isLoading: cancelLoading }] = useCancelOrderMutation();

  console.log("All orders:", orders);
  console.log("Orders error:", ordersError);
  console.log("Order history:", orderHistory);
  // Skeleton Loading Component
  const OrderSkeleton = () => (
    <Box
      bg={colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird}
      rounded={"2xl"}
      p={{ base: 3, md: 7 }}
      my={4}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify={"space-between"}
        alignItems={"center"}
        mb={4}
      >
        <Skeleton height="40px" width="120px" rounded="xl" />
        <Skeleton
          height="40px"
          width="150px"
          rounded="xl"
          mt={{ base: 3, md: 0 }}
        />
      </Flex>
      <Box
        borderBottom="1px solid"
        borderColor={
          colorMode === "light" ? colors.light.textSub : colors.dark.textSub
        }
        my={4}
        opacity={0.3}
      />
      <SkeletonText noOfLines={2} spacing={4} skeletonHeight={3} />
      <Flex
        justify="space-between"
        mt={4}
        direction={{ base: "column", md: "row" }}
      >
        <Skeleton height="20px" width="200px" />
        <Skeleton
          height="40px"
          width="150px"
          rounded="xl"
          mt={{ base: 3, md: 0 }}
        />
      </Flex>
    </Box>
  );

  //10 second
  useEffect(() => {
    if (!orders || orders.length === 0) return;
    const statusesToTrack = [
      "confirmed",
      "preparing",
      "ready_for_pickup",
      "out_for_delivery",
      "cancelled",
    ];

    const timers = [];

    orders.forEach((order) => {
      if (
        hiddenOrderIds.includes(order.id) ||
        order.status === "delivered" ||
        order.status === "created"
      )
        return;

      if (!statusesToTrack.includes(order.status)) return;

      const previousStatus = orderStatusTracker[order.id];

      if (previousStatus === undefined || previousStatus !== order.status) {
        setOrderStatusTracker((prev) => ({
          ...prev,
          [order.id]: order.status,
        }));

        const timer = setTimeout(() => {
          setOrderStatusTracker((currentTracker) => {
            const currentOrder = orders.find((o) => o.id === order.id);
            if (
              currentOrder &&
              currentOrder.status === currentTracker[order.id]
            ) {
              setHiddenOrderIds((prev) => [...prev, order.id]);
            }
            return currentTracker;
          });
        }, 10000);

        timers.push(timer);
      }
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [orders, hiddenOrderIds, orderStatusTracker]);

  // Listen for order status changes and auto-reduce stock
  useEffect(() => {
    if (!userId) return;

    console.log("🔗 Setting up realtime listener for order status changes...");

    const channel = supabase
      .channel(`order-status-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `customer_id=eq.${userId}`,
        },
        async (payload) => {
          console.log("📡 Order status change detected:", payload);

          // Check if status changed from created to confirmed
          if (
            payload.old?.status === "created" &&
            payload.new?.status === "confirmed"
          ) {
            console.log(
              "🔥 Order status changed from created to confirmed, reducing stock..."
            );

            try {
              // Get order items and reduce stock
              const { data: orderItems, error: itemsError } = await supabase
                .from("order_items")
                .select("menu_item_id, quantity")
                .eq("order_id", payload.new.id);

              if (itemsError) {
                console.error("❌ Error fetching order items:", itemsError);
                return;
              }

              console.log("📦 Order items found:", orderItems);

              // Reduce stock for each menu item
              if (orderItems && orderItems.length > 0) {
                console.log(
                  "🔄 Auto stock reduction for",
                  orderItems.length,
                  "items"
                );

                await Promise.all(
                  orderItems.map(async (item) => {
                    console.log(
                      `📊 Processing item: ${item.menu_item_id}, quantity: ${item.quantity}`
                    );

                    const { data: menuItem, error: fetchError } = await supabase
                      .from("menu_items")
                      .select("stock")
                      .eq("id", item.menu_item_id)
                      .single();

                    if (fetchError) {
                      console.error(
                        "❌ Error fetching menu item stock:",
                        fetchError
                      );
                      return;
                    }

                    console.log(
                      `📈 Current stock for item ${item.menu_item_id}:`,
                      menuItem.stock
                    );
                    const newStock = Math.max(
                      (menuItem.stock || 0) - item.quantity,
                      0
                    );
                    console.log(
                      `📉 New stock for item ${item.menu_item_id}:`,
                      newStock
                    );

                    const { data: updateResult, error: updateError } =
                      await supabase
                        .from("menu_items")
                        .update({ stock: newStock })
                        .eq("id", item.menu_item_id)
                        .select();

                    if (updateError) {
                      console.error("❌ Error updating stock:", updateError);
                    } else {
                      console.log(
                        "✅ Stock updated successfully:",
                        updateResult
                      );
                    }
                  })
                );

                // Show success message
                toaster.create({
                  title: "Stock Updated",
                  description:
                    "Order confirmed and stock has been reduced automatically!",
                  status: "success",
                  duration: 3000,
                });
              }
            } catch (error) {
              console.error("❌ Auto stock reduction error:", error);
            }
          }
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      console.log("🔌 Cleaning up realtime listener...");
      supabase.removeChannel(channel);
    };
  }, [userId]);

  /* -----------------HANDLER---------------------------- */
  // Status name mapping
  const getStatusDisplayName = (status) => {
    const statusMap = {
      confirmed: "Order Placed",
      preparing: "Preparing",
      ready_for_pickup: "Ready for Pickup",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
      created: "Created",
    };
    return statusMap[status] || status;
  };

  const activeOrders = orders?.filter(
    (order) =>
      order.status !== "delivered" && !hiddenOrderIds.includes(order.id)
  );

  // Limit order history to last 3
  const limitedOrderHistory = orderHistory?.slice(0, 3);

  console.log("Active orders after filter:", activeOrders);
  console.log("Hidden order IDs:", hiddenOrderIds);

  /* -----------------RENDER---------------------------- */

  // Check if user has already reported this order
  const isOrderReported = (orderId) => {
    return userReports?.some((report) => report.target_id === orderId) || false;
  };

  // Handle cancel order
  const handleCancelOrder = async (orderId) => {
    try {
      console.log("🚀 handleCancelOrder called with orderId:", orderId);
      console.log("🚀 Calling cancelOrder mutation with:", { orderId });
      await cancelOrder({ orderId }).unwrap();
      toaster.create({
        title: "Order Deleted",
        description: "Your order has been completely removed from the system.",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error.message || "Failed to cancel order",
        status: "error",
        duration: 3000,
      });
    }
  };

  const openReportModal = (orderId) => {
    setReportTargetId(orderId);
    setIsReportOpen(true);
  };

  const closeReportModal = () => {
    setIsReportOpen(false);
    setReportTitle("");
    setReportReason("");
    setReportDetails("");
    setReportTargetId(null);
  };

  const handleSendReport = async () => {
    if (!reportReason || !reportDetails) {
      toaster.create({
        title: "Missing Information",
        description:
          "Please select a complaint category and provide a description.",
        status: "warning",
        duration: 3000,
      });
      return;
    }
    try {
      const details = reportDetails;
      const res = await createReport({
        reporterUserId: userId,

        targetId: reportTargetId,
        targetType: "order",
        reason: reportReason,
        details,
      });
      if (res && !res.error) {
        toaster.create({
          title: "Report Submitted Successfully",
          description:
            "Your report has been sent to our team for review. We'll investigate the issue promptly.",
          status: "success",
          duration: 5000,
        });
        closeReportModal();
      } else {
        toaster.create({
          title: "Failed to Submit Report",
          description:
            res.error || "Something went wrong. Please try again later.",
          status: "error",
          duration: 4000,
        });
      }
    } catch (e) {
      toaster.create({
        title: "Unexpected Error",
        description:
          "Something went wrong while sending your report. Please try again.",
        status: "error",
        duration: 4000,
      });
    }
  };

  const activeOrderHandler = activeOrders?.map(
    ({ id, status, created_at, total, order_items }) => {
      console.log("Order ID:", id);
      console.log("Order items:", order_items);
      console.log("Order items length:", order_items?.length);
      console.log("Order items is array?", Array.isArray(order_items));
      const isCreatedStatus = status === "created";

      return (
        <Box
          key={id}
          position="relative"
          bg={
            colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
          }
          rounded={"2xl"}
          p={{ base: 4, md: 6 }}
          my={4}
        >
          {/* Card Content with conditional blur */}
          <Box
            filter={isCreatedStatus ? "blur(2px)" : "none"}
            opacity={isCreatedStatus ? 0.7 : 1}
          >
            {/* Header: Status and Total */}
            <Flex
              direction={{ base: "column", sm: "row" }}
              justify={"space-between"}
              alignItems={{ base: "flex-start", sm: "center" }}
              mb={4}
            >
              <Badge
                fontWeight={400}
                fontSize={{ base: "14px", md: "16px" }}
                rounded={"xl"}
                px={4}
                py={2}
                color={
                  colorMode === "light"
                    ? colors.light.pending
                    : colors.dark.pending
                }
                bg={
                  colorMode === "light"
                    ? colors.light.pending20a
                    : colors.dark.pending20a
                }
              >
                {getStatusDisplayName(status)}
              </Badge>

              <Text
                fontWeight={700}
                fontSize={{ base: "20px", md: "24px" }}
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
                mt={{ base: 2, sm: 0 }}
              >
                Total: {total} LE
              </Text>
            </Flex>

            {/* Date and Order ID */}
            <Text
              fontSize={{ base: "12px", md: "14px" }}
              color={colors.light.textSub}
              mb={4}
            >
              {new Date(created_at).toLocaleDateString("en-GB")} |{" "}
              {new Date(created_at).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              | #ORD-{id.slice(0, 8).toUpperCase()}
            </Text>

            {/* Order Items */}
            <VStack gap={3} align="stretch" mb={4}>
              {order_items && order_items.length > 0 ? (
                order_items.map((item) => (
                  <Flex
                    key={item.id}
                    align="center"
                    gap={3}
                    bg={
                      colorMode === "light"
                        ? colors.light.bgFourth
                        : colors.dark.bgFourth
                    }
                    p={3}
                    rounded="lg"
                  >
                    <Image
                      src={item.menu_items?.menu_img || "/placeholder.jpg"}
                      alt={item.menu_items?.title || item.title}
                      boxSize={{ base: "60px", md: "70px" }}
                      objectFit="cover"
                      rounded="lg"
                      fallbackSrc="https://via.placeholder.com/70"
                    />
                    <Box flex={1}>
                      <Text
                        fontWeight={600}
                        fontSize={{ base: "14px", md: "16px" }}
                        color={
                          colorMode === "light"
                            ? colors.light.textMain
                            : colors.dark.textMain
                        }
                      >
                        {item.menu_items?.title || item.title}
                      </Text>
                      <Text
                        fontSize={{ base: "12px", md: "14px" }}
                        color={colors.light.textSub}
                      >
                        Price: {item.price_at_order || item.menu_items?.price}{" "}
                        LE
                      </Text>
                    </Box>
                    <Text
                      fontWeight={700}
                      fontSize={{ base: "16px", md: "18px" }}
                      color={
                        colorMode === "light"
                          ? colors.light.textMain
                          : colors.dark.textMain
                      }
                    >
                      x{item.quantity}
                    </Text>
                  </Flex>
                ))
              ) : (
                <Text
                  fontSize="sm"
                  color={colors.light.textSub}
                  textAlign="center"
                >
                  No items found for this order
                </Text>
              )}
            </VStack>

            {/* Order Details Button */}
            <Flex justify="flex-end" w="full">
              <Button
                onClick={() => navigate(`/home/details/${id}`)}
                rounded="xl"
                variant="solid"
                color="white"
                bg={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                _active={{
                  bg:
                    colorMode === "light"
                      ? colors.light.mainFixedActive
                      : colors.dark.mainFixedActive,
                  transform: "scale(0.98)",
                }}
                _hover={{
                  bg:
                    colorMode === "light"
                      ? colors.light.mainFixedActive
                      : colors.dark.mainFixedActive,
                }}
              >
                Order Details
              </Button>
            </Flex>
          </Box>

          {/* Overlay for Created Status */}
          {isCreatedStatus && (
            <>
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg={
                  colorMode === "light"
                    ? "rgba(255,255,255,0.8)"
                    : "rgba(0,0,0,0.8)"
                }
                borderRadius="2xl"
                zIndex={1}
              />
            </>
          )}

          {isCreatedStatus && (
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              zIndex={999}
              textAlign="center"
              bg={colorMode === "light" ? "white" : colors.dark.bgThird}
              borderRadius="2xl"
              p={8}
              boxShadow="2xl"
              border="1px solid"
              borderColor={
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed
              }
              minW="320px"
              maxW="500px"
            >
              <VStack spacing={6}>
                <Text
                  fontSize={{ base: "16px", md: "20px" }}
                  fontWeight="bold"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  Wait for the chef to confirm your order!
                </Text>

                <Button
                  onClick={() => handleCancelOrder(id)}
                  isLoading={cancelLoading}
                  loadingText="Cancelling..."
                  variant="solid"
                  bg={
                    colorMode === "light"
                      ? colors.light.error
                      : colors.dark.error
                  }
                  color="white"
                  size="lg"
                  borderRadius="16px"
                  px={8}
                  py={6}
                  fontSize="18px"
                  fontWeight="bold"
                  boxShadow="lg"
                  _hover={{
                    bg:
                      colorMode === "light"
                        ? colors.light.error
                        : colors.dark.error,
                    opacity: 0.8,
                    transform: "translateY(-2px)",
                    boxShadow: "xl",
                  }}
                  _active={{
                    transform: "translateY(0px)",
                  }}
                >
                  Cancel Order
                </Button>
              </VStack>
            </Box>
          )}
        </Box>
      );
    }
  );

  return (
    <>
      <Box>
        <Text fontSize={{ base: "20px", md: "40px" }} fontWeight={"700"} my={6}>
          Active Order Now
        </Text>
        {ordersLoading ? (
          <>
            <OrderSkeleton key="skeleton-1" />
            <OrderSkeleton key="skeleton-2" />
          </>
        ) : activeOrders && activeOrders.length > 0 ? (
          activeOrderHandler
        ) : (
          <Box
            bg={
              colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
            }
            rounded={"2xl"}
            p={{ base: 5, md: 10 }}
            my={4}
            textAlign="center"
          >
            <VStack spacing={4}>
              <Box
                p={4}
                rounded="full"
                bg={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                color="white"
              >
                <IoReceiptOutline size={40} />
              </Box>
              <Text
                fontSize={{ base: "16px", md: "20px" }}
                color={colors.light.textSub}
              >
                You currently have no active orders
              </Text>
            </VStack>
          </Box>
        )}
      </Box>

      <Box>
        <Text fontSize={{ base: "20px", md: "40px" }} fontWeight={"700"}>
          Order History
        </Text>
        {orderHistoryLoading ? (
          <>
            <OrderSkeleton key="history-skeleton-1" />
            <OrderSkeleton key="history-skeleton-2" />
            <OrderSkeleton key="history-skeleton-3" />
          </>
        ) : limitedOrderHistory && limitedOrderHistory.length > 0 ? (
          limitedOrderHistory.map(({ status, at, orders }, index) => {
            const orderDetails = orders;

            return (
              <Box
                key={at}
                bg={
                  colorMode === "light"
                    ? colors.light.bgThird
                    : colors.dark.bgThird
                }
                rounded={"2xl"}
                p={{ base: 3, md: 7 }}
                my={4}
              >
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify={"space-between"}
                  alignItems={"start"}
                >
                  <Box textAlign={{ base: "start", md: "start" }}>
                    <Badge
                      fontWeight={400}
                      fontSize={"18px"}
                      rounded={"xl"}
                      p={3}
                      color={
                        status === "delivered"
                          ? colorMode === "light"
                            ? colors.light.success
                            : colors.dark.success
                          : colorMode === "light"
                          ? colors.light.pending
                          : colors.dark.pending
                      }
                      bg={
                        status === "delivered"
                          ? colorMode === "light"
                            ? colors.light.success20a
                            : colors.dark.success20a
                          : colorMode === "light"
                          ? colors.light.pending20a
                          : colors.dark.pending20a
                      }
                    >
                      {getStatusDisplayName(status)}
                    </Badge>
                  </Box>

                  <Box>
                    <Text
                      fontWeight={500}
                      my={4}
                      fontSize={"30px"}
                      color={
                        colorMode === "light"
                          ? colors.light.textMain
                          : colors.dark.textMain
                      }
                    >
                      Total: {orderDetails?.total || 0} LE
                    </Text>
                  </Box>
                </Flex>

                <Box
                  borderBottom="1px solid"
                  borderColor={
                    colorMode === "light"
                      ? colors.light.textSub
                      : colors.dark.textSub
                  }
                  my={4}
                  opacity={0.3}
                />

                {/* Order Items */}
                {orderDetails?.order_items &&
                  orderDetails.order_items.length > 0 && (
                    <VStack gap={3} align="stretch" mb={4}>
                      {orderDetails.order_items.map((item) => (
                        <Flex
                          key={item.id}
                          align="center"
                          gap={3}
                          bg={
                            colorMode === "light"
                              ? colors.light.bgFourth
                              : colors.dark.bgFourth
                          }
                          p={3}
                          rounded="lg"
                        >
                          <Image
                            src={
                              item.menu_items?.menu_img || "/placeholder.jpg"
                            }
                            alt={item.menu_items?.title || item.title}
                            boxSize={{ base: "50px", md: "60px" }}
                            objectFit="cover"
                            rounded="lg"
                            fallbackSrc="https://via.placeholder.com/60"
                          />
                          <Box flex={1}>
                            <Text
                              fontWeight={600}
                              fontSize={{ base: "13px", md: "15px" }}
                              color={
                                colorMode === "light"
                                  ? colors.light.textMain
                                  : colors.dark.textMain
                              }
                            >
                              {item.menu_items?.title || item.title}
                            </Text>
                            <Text
                              fontSize={{ base: "11px", md: "13px" }}
                              color={colors.light.textSub}
                            >
                              Price:{" "}
                              {item.price_at_order || item.menu_items?.price} LE
                            </Text>
                          </Box>
                          <Text
                            fontWeight={700}
                            fontSize={{ base: "14px", md: "16px" }}
                            color={
                              colorMode === "light"
                                ? colors.light.textMain
                                : colors.dark.textMain
                            }
                          >
                            x{item.quantity}
                          </Text>
                        </Flex>
                      ))}
                    </VStack>
                  )}

                <Box
                  borderBottom="1px solid"
                  borderColor={
                    colorMode === "light"
                      ? colors.light.textSub
                      : colors.dark.textSub
                  }
                  my={4}
                  opacity={0.3}
                />

                <Flex direction="column" gap={2}>
                  <Flex justify="space-between">
                    <Text color={colors.light.textSub}>Subtotal:</Text>
                    <Text fontWeight={500}>
                      {orderDetails?.subtotal || 0} LE
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color={colors.light.textSub}>Delivery Fee:</Text>
                    <Text fontWeight={500}>
                      {orderDetails?.delivery_fee || 0} LE
                    </Text>
                  </Flex>
                  {orderDetails?.discount > 0 && (
                    <Flex justify="space-between">
                      <Text color={colors.light.textSub}>Discount:</Text>
                      <Text fontWeight={500} color="green.500">
                        -{orderDetails?.discount} LE
                      </Text>
                    </Flex>
                  )}
                  {orderDetails?.notes && (
                    <Flex direction="column" mt={2}>
                      <Text color={colors.light.textSub}>Notes:</Text>
                      <Text fontWeight={400}>{orderDetails.notes}</Text>
                    </Flex>
                  )}
                </Flex>

                <Flex justify="space-between" align="center" mt={4}>
                  <Text color={colors.light.textSub}>
                    {new Date(at).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Text>
                </Flex>
                {index === 0 && !isOrderReported(orderDetails?.id) && (
                  <Flex justify="flex-end" mt={3}>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="red"
                      leftIcon={<IoFlagOutline />}
                      onClick={() => openReportModal(orderDetails?.id)}
                      borderColor={
                        colorMode === "light" ? "red.500" : "red.400"
                      }
                      color={colorMode === "light" ? "red.500" : "red.400"}
                      _hover={{
                        bg: colorMode === "light" ? "red.50" : "red.900",
                        borderColor:
                          colorMode === "light" ? "red.600" : "red.300",
                      }}
                    >
                      Report
                    </Button>
                  </Flex>
                )}
                {index === 0 && isOrderReported(orderDetails?.id) && (
                  <Flex justify="flex-end" mt={3}>
                    <Text
                      fontSize="sm"
                      color={colorMode === "light" ? "green.600" : "green.400"}
                      fontWeight={500}
                    >
                      ✓ Report Submitted
                    </Text>
                  </Flex>
                )}
              </Box>
            );
          })
        ) : (
          <Box
            bg={
              colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
            }
            rounded={"2xl"}
            p={{ base: 5, md: 10 }}
            my={4}
            textAlign="center"
          >
            <VStack spacing={4}>
              <Box
                p={4}
                rounded="full"
                bg={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                color="white"
              >
                <IoTimeOutline size={40} />
              </Box>
              <Text
                fontSize={{ base: "16px", md: "20px" }}
                color={colors.light.textSub}
              >
                You currently have no orders in your order history
              </Text>
            </VStack>
          </Box>
        )}
      </Box>

      {/* Report Modal (custom overlay) */}
      {isReportOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0,0,0,0.5)"
          zIndex={1000}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            bg={
              colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
            }
            rounded="2xl"
            w={{ base: "90%", md: "600px" }}
            p={6}
          >
            <Flex
              flexDirection="column"
              justify="space-between"
              align="start"
              mb={4}
            >
              <Text
                fontSize={{ base: "18px", md: "22px" }}
                fontWeight={700}
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
              >
                Report a Problem
              </Text>
              <Text
                fontSize={{ base: "14px", md: "14px" }}
                fontWeight={700}
                color={
                  colorMode === "light"
                    ? colors.light.textSub
                    : colors.dark.textSub
                }
              >
                Report any issues you’ve encountered.
              </Text>
            </Flex>
            <hr margin />
            <VStack align="stretch" marginTop={4} gap={4}>
              <Box>
                <Text mb={2} color={colors.light.textSub}>
                  Complaint Title
                </Text>
                <Box
                  as="input"
                  type="text"
                  placeholder="Brief description of the issue"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  bg={
                    colorMode === "light"
                      ? colors.light.bgFourth
                      : colors.dark.bgFourth
                  }
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                  p={3}
                  rounded="md"
                  w="full"
                  _focus={{ borderColor: "blue.500", outline: "none" }}
                  _placeholder={{
                    color:
                      colorMode === "light"
                        ? colors.light.textSub
                        : colors.dark.textSub,
                  }}
                />
              </Box>
              <Box>
                <Text mb={2} color={colors.light.textSub}>
                  Complaint Category
                </Text>
                <Box
                  as="select"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  bg={
                    colorMode === "light"
                      ? colors.light.bgSecond
                      : colors.dark.bgSecond
                  }
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                  p={3}
                  rounded="md"
                  w="full"
                  border="1px solid"
                  borderColor={
                    colorMode === "light"
                      ? colors.light.textSub
                      : colors.dark.textSub
                  }
                  _focus={{
                    borderColor:
                      colorMode === "light"
                        ? colors.light.mainFixed
                        : colors.dark.mainFixed,
                    outline: "none",
                  }}
                  sx={{
                    option: {
                      bg:
                        colorMode === "light"
                          ? colors.light.bgSecond
                          : colors.dark.bgSecond,
                      color:
                        colorMode === "light"
                          ? colors.light.textMain
                          : colors.dark.textMain,
                    },
                  }}
                >
                  <option value="">Select a complaint category</option>
                  <option value="food_problem">Food problem</option>
                  <option value="delivery_problem">Delivery problem</option>
                  <option value="money_problem">Money problem</option>
                </Box>
              </Box>
              <Box>
                <Text mb={2} color={colors.light.textSub}>
                  Complaint Description
                </Text>
                <Box
                  as="textarea"
                  placeholder="Please provide detailed information about your complaint..."
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows={5}
                  bg={
                    colorMode === "light"
                      ? colors.light.bgFourth
                      : colors.dark.bgFourth
                  }
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                  p={3}
                  rounded="md"
                  w="full"
                  resize="vertical"
                  _focus={{ borderColor: "blue.500", outline: "none" }}
                  _placeholder={{
                    color:
                      colorMode === "light"
                        ? colors.light.textSub
                        : colors.dark.textSub,
                  }}
                />
              </Box>
            </VStack>
            <HStack mt={6} w="full" justify="space-between">
              <Button
                onClick={handleSendReport}
                isLoading={reportLoading}
                color="white"
                rounded="xl"
                width="50%"
                bg={
                  colorMode === "light"
                    ? colors.light.mainFixed
                    : colors.dark.mainFixed
                }
                _hover={{
                  bg:
                    colorMode === "light"
                      ? colors.light.mainFixedActive
                      : colors.dark.mainFixedActive,
                }}
              >
                Send Report
              </Button>
              <Button
                variant="outline"
                borderColor={colors.light.mainFixed}
                width="50%"
                rounded="xl"
                onClick={closeReportModal}
              >
                Cancel
              </Button>
            </HStack>
          </Box>
        </Box>
      )}
    </>
  );
};
export default OrderPage;
