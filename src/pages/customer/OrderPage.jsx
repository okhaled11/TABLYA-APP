import { Button, Text } from "@chakra-ui/react";
import { Flex, Box } from "@chakra-ui/react";
import { Badge } from "@chakra-ui/react";
import { Skeleton, SkeletonText } from "@chakra-ui/react";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import { Separator } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CookieService from "../../services/cookies";
import { useGetUserDataQuery } from "../../app/features/Auth/authSlice";
import { useGetCustomerOrdersQuery } from "../../app/features/Customer/Orders/ordersApiCustomerSlice";
import { useGetCustomerOrderHistoryQuery } from "../../app/features/Customer/Orders/OrdersHistoryCustomerSlice";

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
  /* --------------------------HOOKS------------------------- */
  const navigate = useNavigate();
  const { data: orders, isLoading: ordersLoading } = useGetCustomerOrdersQuery(
    userId,
    {
      skip: !userId,
    }
  );
  const { data: orderHistory, isLoading: orderHistoryLoading } =
    useGetCustomerOrderHistoryQuery(userId, {
      skip: !userId,
    });
console.log(orderHistory);
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
      <Separator my={4} />
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
      // تجاهل الطلبات المخفية أو created أو delivered
      if (
        hiddenOrderIds.includes(order.id) ||
        order.status === "delivered" ||
        order.status === "created"
      )
        return;

      // فقط راقب الطلبات التي status بتاعها في القائمة
      if (!statusesToTrack.includes(order.status)) return;

      const previousStatus = orderStatusTracker[order.id];

      // إذا الطلب جديد أو status اتغير
      if (previousStatus === undefined || previousStatus !== order.status) {
        // تحديث الـ tracker بالـ status الجديد
        setOrderStatusTracker((prev) => ({
          ...prev,
          [order.id]: order.status,
        }));

        // بدء timer جديد لمدة 10 ثواني
        const timer = setTimeout(() => {
          // بعد 10 ثواني، تحقق إذا الـ status لسه زي ما هو
          setOrderStatusTracker((currentTracker) => {
            const currentOrder = orders.find((o) => o.id === order.id);
            if (
              currentOrder &&
              currentOrder.status === currentTracker[order.id]
            ) {
              // الـ status ماتغيرش، إخفي الطلب
              setHiddenOrderIds((prev) => [...prev, order.id]);
            }
            return currentTracker;
          });
        }, 10000); // 10 ثواني

        timers.push(timer);
      }
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [orders, hiddenOrderIds, orderStatusTracker]);

  /* -----------------HANDLER---------------------------- */
  const activeOrders = orders?.filter(
    (order) =>
      order.status !== "delivered" &&
      order.status !== "created" &&
      !hiddenOrderIds.includes(order.id)
  );
  /* -----------------RENDER---------------------------- */

  const activeOrderHandler = activeOrders?.map(
    ({ id, status, created_at, total }) => {
      return (
        <>
          <Box
            key={id}
            bg={
              colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
            }
            rounded={"2xl"}
            p={{ base: 3, md: 7 }}
            my={4}
          >
            {/* upper */}
            <Flex
              direction={{ base: "column", md: "row" }}
              justify={"space-between"}
              alignItems={"center"}
            >
              {/* left */}
              <Box textAlign={{ base: "center", md: "start" }}>
                <Badge
                  fontWeight={400}
                  fontSize={"18px"}
                  rounded={"xl"}
                  p={3}
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
                  {status}
                </Badge>
              </Box>

              {/* right */}
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
                  Total: {total} LE
                </Text>
              </Box>
            </Flex>

            {/* btn */}
            <Flex
              justify={"space-between"}
              direction={{ base: "column", md: "row" }}
            >
              <Box>
                <Text
                  mt={6}
                  color={colors.light.textSub}
                  textAlign={"center"}
                  my={3}
                >
                  {new Date(created_at).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Text>
              </Box>
              <Button
                onClick={() => navigate(`/home/details/${id}`)}
                my={3}
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
        </>
      );
    }
  );

  const orderHistoryHandler = orderHistory?.map(({ status, at, orders }) => {
    const orderDetails = orders;
    
    return (
      <>
        <Box
          key={at}
          bg={
            colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
          }
          rounded={"2xl"}
          p={{ base: 3, md: 7 }}
          my={4}
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            justify={"space-between"}
            alignItems={"center"}
          >
            <Box textAlign={{ base: "center", md: "start" }}>
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
                {status}
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

          <Separator my={4} variant="solid" />

          <Flex direction="column" gap={2}>
            <Flex justify="space-between">
              <Text color={colors.light.textSub}>Subtotal:</Text>
              <Text fontWeight={500}>{orderDetails?.subtotal || 0} LE</Text>
            </Flex>
            <Flex justify="space-between">
              <Text color={colors.light.textSub}>Tax:</Text>
              <Text fontWeight={500}>{orderDetails?.tax || 0} LE</Text>
            </Flex>
            <Flex justify="space-between">
              <Text color={colors.light.textSub}>Delivery Fee:</Text>
              <Text fontWeight={500}>{orderDetails?.delivery_fee || 0} LE</Text>
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

          <Flex justify="flex-start" mt={4}>
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
        </Box>
      </>
    );
  });

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
            <Text
              fontSize={{ base: "16px", md: "20px" }}
              color={colors.light.textSub}
            >
              You currently have no orders in your order Active
            </Text>
          </Box>
        )}
      </Box>

      <Box>
        <Text fontSize={{ base: "20px", md: "40px" }} fontWeight={"700"}>
          History Order
        </Text>
        {orderHistoryLoading ? (
          <>
            <OrderSkeleton key="history-skeleton-1" />
            <OrderSkeleton key="history-skeleton-2" />
            <OrderSkeleton key="history-skeleton-3" />
          </>
        ) : orderHistory && orderHistory.length > 0 ? (
          orderHistoryHandler
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
            <Text
              fontSize={{ base: "16px", md: "20px" }}
              color={colors.light.textSub}
            >
              You currently have no orders in your order history.
            </Text>
          </Box>
        )}
      </Box>
    </>
  );
};
export default OrderPage;
