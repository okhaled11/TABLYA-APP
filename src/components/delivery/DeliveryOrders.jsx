import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Heading,
  Flex,
  Image,
  Text,
  Button,
  Grid,
  useDialog,
  Pagination,
  ButtonGroup,
  IconButton,
  Tabs,
} from "@chakra-ui/react";
import { RiFileList3Fill } from "react-icons/ri";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import testColor from "../../theme/color";
import { IoCheckmarkDoneSharp, IoPerson } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { BsFillCreditCardFill, BsBoxSeam } from "react-icons/bs";
import srcLoadingImg from "../../assets/Transparent Version.gif";
import {
  useGetOrdersForDeliveryCityQuery,
  useUpdateOrderStatusMutation,
} from "../../app/features/delivery/deleveryOrder";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import CustomAlertDialog from "../../shared/CustomAlertDailog";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toaster } from "../ui/toaster";
import { supabase } from "../../services/supabaseClient";
import { useTranslation } from "react-i18next";

const ORDERS_PER_PAGE = 3;

const DeliveryOrders = () => {
  const { colorMode } = useColorMode();
  const { t, i18n } = useTranslation();
  const { data: orders, isLoading } = useGetOrdersForDeliveryCityQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();
  const [hiddenOrderIds, setHiddenOrderIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dialog = useDialog();
  const [deleteId, setDeleteId] = useState(null);
  const [value, setValue] = useState("ready_for_pickup");
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [cookerPhones, setCookerPhones] = useState({});
  const activeOrdersCount = useMemo(() => {
    if (!orders || !userId) return 0;
    return orders.filter(
      (o) => o.status === "out_for_delivery" && o.delivery_id === userId
    ).length;
  }, [orders, userId]);
  const limitReached = activeOrdersCount >= 2;
  console.log(orders);

  const selectedStatus = Array.isArray(value)
    ? value[value.length - 1] ?? "Default"
    : value || "Default";

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus]);

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => setUserId(data?.user?.id || null));
  }, []);

  useEffect(() => {
    if (!orders) return;
    const cookerIds = Array.from(
      new Set((orders || []).map((o) => o.cooker_id).filter(Boolean))
    );
    if (cookerIds.length === 0) return;
    supabase
      .from("users")
      .select("id, phone")
      .in("id", cookerIds)
      .then(({ data }) => {
        if (data) {
          const map = {};
          data.forEach((u) => {
            map[u.id] = u.phone;
          });
          setCookerPhones(map);
        }
      });
  }, [orders]);

  // Filter out hidden orders
  const ordersAfterHidden = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => !hiddenOrderIds.includes(order.id));
  }, [orders, hiddenOrderIds]);

  const isToday = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const filteredOrders = useMemo(() => {
    // First filter by today's activity (updated_at or created_at)
    const todayOrders = ordersAfterHidden.filter((order) =>
      isToday(order.updated_at || order.created_at)
    );

    if (selectedStatus === "Default") {
      return todayOrders;
    }

    return todayOrders.filter((order) => order.status === selectedStatus);
  }, [ordersAfterHidden, selectedStatus]);

  // Pagination logic
  const { paginatedOrders, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    const endIndex = startIndex + ORDERS_PER_PAGE;
    const paginated = filteredOrders.slice(startIndex, endIndex);
    const pages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

    return {
      paginatedOrders: paginated,
      totalPages: pages,
    };
  }, [filteredOrders, currentPage]);

  // Reset to page 1 when orders change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleStatusUpdate = async (orderId, status) => {
    const result = updateStatus({ orderId, status });
    if (result && typeof result.unwrap === "function") {
      return result.unwrap();
    }
    return result;
  };

  const handleRemoveOrder = (orderId) => {
    setHiddenOrderIds((prev) => [...prev, orderId]);
    // If we removed the last order on a page, go to previous page
    if (paginatedOrders.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (details) => {
    setCurrentPage(details.page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box py={6}>
      <Flex my={4} justifyContent="space-between" alignItems="center">
        <Heading
          size="lg"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          color={
            colorMode === "light"
              ? testColor.light.textMain
              : testColor.dark.textMain
          }
        >
          {t("delivery.orders.title")}
        </Heading>

        <Tabs.Root
          variant="enclosed"
          fitted
          value={
            selectedStatus === "Default" ? "ready_for_pickup" : selectedStatus
          }
          onValueChange={(e) => setValue(e.value)}
          width={{ base: "60%", md: "auto" }}
        >
          <Tabs.List
            overflowX={{ base: "auto", md: "visible" }}
            whiteSpace={{ base: "nowrap", md: "normal" }}
            gap={{ base: 2, md: 3 }}
            px={{ base: 1, md: 2 }}
            sx={{ "&::-webkit-scrollbar": { display: "none" } }}
            bg={
              colorMode === "light"
                ? testColor.light.bgInput
                : testColor.dark.bgInput
            }
          >
            <Tabs.Trigger
              value="out_for_delivery"
              px={{ base: 2, md: 4 }}
              py={{ base: 2, md: 2 }}
              fontSize={{ base: "sm", md: "md" }}
              flexShrink={0}
              _selected={{
                bg:
                  colorMode == "light"
                    ? colors.light.bgThird
                    : colors.dark.bgThird,
                color: colors.light.mainFixed,
              }}
            >
              {t("delivery.tabs.active")}
            </Tabs.Trigger>
            <Tabs.Trigger
              value="ready_for_pickup"
              px={{ base: 2, md: 4 }}
              py={{ base: 2, md: 2 }}
              fontSize={{ base: "sm", md: "md" }}
              flexShrink={0}
              _selected={{
                bg:
                  colorMode == "light"
                    ? colors.light.bgThird
                    : colors.dark.bgThird,
                color: colors.light.mainFixed,
              }}
            >
              {t("delivery.tabs.new")}
            </Tabs.Trigger>
            <Tabs.Trigger
              value="delivered"
              px={{ base: 7, md: 5 }}
              py={{ base: 2, md: 2 }}
              fontSize={{ base: "sm", md: "md" }}
              flexShrink={0}
              _selected={{
                bg:
                  colorMode == "light"
                    ? colors.light.bgThird
                    : colors.dark.bgThird,
                color: colors.light.mainFixed,
              }}
            >
              {t("delivery.tabs.completed")}
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </Flex>

      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" py={10}>
          <Image
            src={srcLoadingImg}
            alt="loading"
            w={{ base: "180px", md: "220px" }}
          />
        </Flex>
      ) : (
        <Box py={4} align="center" textAlign="center">
          {/* Orders count */}
          {!isLoading && filteredOrders.length > 0 && (
            <Text
              color={
                colorMode === "light"
                  ? colors.light.textSub
                  : colors.dark.textSub
              }
              fontSize="sm"
              mb={4}
            >
              {t("delivery.orders.showingOrders", {
                start: (currentPage - 1) * ORDERS_PER_PAGE + 1,
                end: Math.min(currentPage * ORDERS_PER_PAGE, filteredOrders.length),
                total: filteredOrders.length
              })}
            </Text>
          )}

          {!orders || filteredOrders.length === 0 ? (
            <Box
              bg={
                colorMode === "light"
                  ? colors.light.bgThird
                  : colors.dark.bgThird
              }
              rounded="20px"
              p={{ base: 6, md: 8 }}
              my={4}
              textAlign="center"
            >
              <Flex direction="column" align="center" gap={3}>
                <Box
                  p={3}
                  rounded="full"
                  bg={
                    colorMode === "light"
                      ? colors.light.warning10a
                      : colors.dark.warning10a
                  }
                >
                  <BsBoxSeam
                    size={40}
                    color={
                      colorMode === "light"
                        ? colors.light.mainFixed
                        : colors.dark.mainFixed
                    }
                  />
                </Box>
                <Text
                  fontSize={{ base: "16px", md: "18px" }}
                  color={
                    colorMode === "light"
                      ? colors.light.textSub
                      : colors.dark.textSub
                  }
                >
                  {t("delivery.orders.noOrdersTitle")}
                </Text>
                <Text
                  fontSize={{ base: "12px", md: "14px" }}
                  color={
                    colorMode === "light"
                      ? colors.light.textSub
                      : colors.dark.textSub
                  }
                  opacity={0.8}
                >
                  {t("delivery.orders.noOrdersDesc")}
                </Text>
              </Flex>
            </Box>
          ) : (
            paginatedOrders.map((order) => {
              const dt = new Date(order.created_at);
              const formattedDate = dt.toLocaleDateString();
              const formattedTime = dt.toLocaleTimeString();

              return (
                <Box
                  key={order.id}
                  bg={
                    colorMode === "light"
                      ? colors.light.bgThird
                      : colors.dark.bgThird
                  }
                  rounded={{ base: "24px", md: "32px" }}
                  p={{ base: 4, md: 5 }}
                  my={4}
                >
                  <Flex
                    justifyContent="space-between"
                    alignItems={{ base: "flex-start", md: "center" }}
                    direction={{ base: "column", md: "row" }}
                    gap={{ base: 2, md: 0 }}
                    mb={4}
                    pb={3}
                    borderBottom={`1px solid ${
                      colorMode === "light"
                        ? colors.light.bgFourth
                        : colors.dark.bgFourth
                    }`}
                  >
                    <Text
                      color={
                        colorMode === "light"
                          ? colors.light.textSub
                          : colors.dark.textSub
                      }
                      fontSize={{ base: "13px", md: "14px" }}
                      fontWeight=""
                    >
                      {formattedDate} | {formattedTime} | # {t("delivery.orders.orderId")}-
                      {order.id.slice(0, 8).toUpperCase()}
                    </Text>
                    <Text
                      color={colors.light.mainFixed}
                      fontSize={{ base: "20px", md: "24px" }}
                      fontWeight="bold"
                    >
                      {order.total?.toFixed(2) || "0.00"} {t("common.currency")}
                    </Text>
                  </Flex>

                  <Grid
                    templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                    gap={{ base: 4, md: 5 }}
                    mb={4}
                  >
                    <Box
                      bg={
                        colorMode === "light"
                          ? colors.light.bgFourth
                          : colors.dark.bgFourth
                      }
                      rounded="20px"
                      p={{ base: 4, md: 5 }}
                    >
                      <Heading
                        as="h3"
                        fontSize={{ base: "16px", md: "18px" }}
                        fontWeight={600}
                        mb={3}
                        color={
                          colorMode === "light"
                            ? colors.light.textMain
                            : colors.dark.textMain
                        }
                        textAlign={"start"}
                      >
                        {t("delivery.orders.orderItems")}
                      </Heading>
                      <Box maxH="120px" overflowY="auto " textAlign={"start"}>
                        {order.order_items && order.order_items.length > 0 ? (
                          order.order_items.map((item, index) => (
                            <Text
                              key={index}
                              mb={1.5}
                              color={
                                colorMode === "light"
                                  ? colors.light.textSub
                                  : colors.dark.textSub
                              }
                              fontSize={{ base: "14px", md: "15px" }}
                            >
                              {item.quantity}x {item.title}
                            </Text>
                          ))
                        ) : (
                          <Text
                            color={
                              colorMode === "light"
                                ? colors.light.textSub
                                : colors.dark.textSub
                            }
                            fontSize="14px"
                          >
                            {t("delivery.orders.noItems")}
                          </Text>
                        )}
                      </Box>
                    </Box>

                    <Box
                      bg={
                        colorMode === "light"
                          ? colors.light.info10a
                          : colors.dark.info10a
                      }
                      rounded="20px"
                      p={{ base: 4, md: 5 }}
                    >
                      <Heading
                        as="h3"
                        fontSize={{ base: "16px", md: "18px" }}
                        fontWeight={600}
                        mb={3}
                        color={
                          colorMode === "light"
                            ? colors.light.textMain
                            : colors.dark.textMain
                        }
                        textAlign={"start"}
                      >
                        {t("delivery.orders.customerDetails")}
                      </Heading>
                      {order.customer ? (
                        <Box>
                          <Flex
                            mb={2}
                            color={
                              colorMode === "light"
                                ? colors.light.textSub
                                : colors.dark.textSub
                            }
                            alignItems="center"
                            gap={2}
                          >
                            <IoPerson
                              size={16}
                              color={
                                colorMode === "light"
                                  ? colors.light.info
                                  : colors.dark.info
                              }
                            />
                            <Text
                              fontSize={{ base: "14px", md: "15px" }}
                              noOfLines={1}
                              fontWeight={"light"}
                            >
                              {order.customer.name || "No name"}
                            </Text>
                          </Flex>
                          <Flex
                            mb={2}
                            color={
                              colorMode === "light"
                                ? colors.light.textSub
                                : colors.dark.textSub
                            }
                            alignItems="flex-start"
                            gap={2}
                          >
                            <Box mt={0.5}>
                              <FaLocationDot
                                size={16}
                                color={
                                  colorMode === "light"
                                    ? colors.light.info
                                    : colors.dark.info
                                }
                              />
                            </Box>
                            <Text
                              fontSize={{ base: "14px", md: "15px" }}
                              noOfLines={2}
                              fontWeight={"light"}
                            >
                              {order.address || t("delivery.orders.noAddress")}
                            </Text>
                          </Flex>
                          <Flex
                            mb={3}
                            color={
                              colorMode === "light"
                                ? colors.light.textSub
                                : colors.dark.textSub
                            }
                            alignItems="center"
                            gap={2}
                          >
                            <FaPhone
                              size={14}
                              color={
                                colorMode === "light"
                                  ? colors.light.info
                                  : colors.dark.info
                              }
                            />
                            <Text
                              fontSize={{ base: "14px", md: "15px" }}
                              fontWeight={"light"}
                            >
                              {order.customer.phone || "No phone"}
                            </Text>
                          </Flex>
                          <Box
                            mt={3}
                            pt={3}
                            borderTop={`1px solid ${
                              colorMode === "light"
                                ? colors.light.bgThird
                                : colors.dark.bgThird
                            }`}
                          >
                            <Text
                              fontSize={{ base: "16px", md: "18px" }}
                              fontWeight={600}
                              mb={2}
                              color={
                                colorMode === "light"
                                  ? colors.light.textMain
                                  : colors.dark.textMain
                              }
                              textAlign={"start"}
                            >
                              {t("delivery.orders.chefDetails")}
                            </Text>
                            <Flex
                              mb={2}
                              color={
                                colorMode === "light"
                                  ? colors.light.textSub
                                  : colors.dark.textSub
                              }
                              alignItems="center"
                              gap={2}
                            >
                              <Box mt={0.5}>
                                <FaLocationDot
                                  size={16}
                                  color={
                                    colorMode === "light"
                                      ? colors.light.info
                                      : colors.dark.info
                                  }
                                />
                              </Box>
                              <Text
                                fontSize={{ base: "14px", md: "15px" }}
                                fontWeight={"light"}
                                noOfLines={2}
                              >
                                {order.cooker_address || "No chef address"}
                              </Text>
                            </Flex>
                            <Flex
                              color={
                                colorMode === "light"
                                  ? colors.light.textSub
                                  : colors.dark.textSub
                              }
                              alignItems="center"
                              gap={2}
                            >
                              <FaPhone
                                size={14}
                                color={
                                  colorMode === "light"
                                    ? colors.light.info
                                    : colors.dark.info
                                }
                              />
                              <Text
                                fontSize={{ base: "14px", md: "15px" }}
                                fontWeight={"light"}
                              >
                                {cookerPhones?.[order.cooker_id] || "No phone"}
                              </Text>
                            </Flex>
                          </Box>
                          <Box
                            pt={2}
                            borderTop={`1px solid ${
                              colorMode === "light"
                                ? colors.light.bgThird
                                : colors.dark.bgThird
                            }`}
                          >
                            <Text
                              fontSize={{ base: "16px", md: "18px" }}
                              fontWeight={600}
                              mb={1}
                              color={
                                colorMode === "light"
                                  ? colors.light.textMain
                                  : colors.dark.textMain
                              }
                              textAlign={"start"}
                            >
                              {t("delivery.orders.paymentMethod")}
                            </Text>
                            <Flex alignItems="center" gap={1.5}>
                              <BsFillCreditCardFill
                                size={14}
                                color={
                                  colorMode === "light"
                                    ? colors.light.info
                                    : colors.dark.info
                                }
                              />
                              <Text
                                fontSize="13px"
                                color={
                                  colorMode === "light"
                                    ? colors.light.textSub
                                    : colors.dark.textSub
                                }
                                fontWeight={"light"}
                              >
                                {order.payment_method || "Not specified"}
                              </Text>
                            </Flex>
                          </Box>
                        </Box>
                      ) : (
                        <Text
                          color={
                            colorMode === "light"
                              ? colors.light.textSub
                              : colors.dark.textSub
                          }
                          fontSize="14px"
                        >
                          {t("delivery.orders.noCustomerInfo")}
                        </Text>
                      )}
                    </Box>
                  </Grid>

                  <Flex
                    direction={{ base: "column", md: "row" }}
                    justifyContent="space-between"
                    gap={3}
                    mt={4}
                  >
                    <Flex
                      gap={2}
                      direction={{ base: "column", sm: "row" }}
                      flex={1}
                    >
                      <Button
                        size={{ base: "sm", md: "md" }}
                        variant="solid"
                        rounded="16px"
                        bg={
                          order.status === "out_for_delivery"
                            ? colors.mainFixed
                            : colorMode === "light"
                            ? colors.light.mainFixed
                            : colors.dark.mainFixed
                        }
                        color={
                          order.status === "out_for_delivery"
                            ? "white"
                            : colorMode === "light"
                            ? colors.light.white
                            : colors.dark.white
                        }
                        fontSize={{ base: "13px", md: "14px" }}
                        display={
                          order.status === "ready_for_pickup" ? "flex" : "none"
                        }
                        onClick={async () => {
                          if (order.status !== "ready_for_pickup") return;
                          if (limitReached) {
                            toaster.create({
                              title: "Limit reached",
                              description:
                                "You can only receive 2 active orders.",
                              type: "warning",
                            });
                            return;
                          }
                          try {
                            await handleStatusUpdate(
                              order.id,
                              "out_for_delivery"
                            );
                            toaster.create({
                              title: "Order received",
                              description: "Order is now out for delivery.",
                              type: "success",
                            });
                          } catch (e) {
                            toaster.create({
                              title: "Action failed",
                              description:
                                e?.message || "Failed to receive order.",
                              type: "error",
                            });
                          }
                        }}
                        isDisabled={
                          isUpdating ||
                          order.status !== "ready_for_pickup" ||
                          limitReached
                        }
                        _hover={{
                          opacity: 0.8,
                        }}
                        flex={1}
                        py={2}
                      >
                        <RiFileList3Fill size={16} />

                        <Box as="span" ml={1}>
                          {t("delivery.orders.receiveOrder")}
                        </Box>
                      </Button>

                      <Button
                        size={{ base: "sm", md: "md" }}
                        variant="outline"
                        rounded="16px"
                        border="none"
                        bg={
                          colorMode === "light"
                            ? colors.light.mainFixed10a
                            : colors.dark.mainFixed10a
                        }
                        color={
                          colorMode === "light"
                            ? colors.light.mainFixed
                            : colors.dark.mainFixed
                        }
                        py={2}
                        fontSize={{ base: "13px", md: "14px" }}
                        display={
                          order.status === "ready_for_pickup" ||
                          order.status === "out_for_delivery"
                            ? "flex"
                            : "none"
                        }
                        onClick={() =>
                          navigate(`/delivery/orders/map/${order.id}`, {
                            state: { order },
                          })
                        }
                        _hover={{
                          bg: colors.light.bgThird,
                        }}
                        flex={1}
                      >
                        <FaLocationDot size={16} />
                        <Box as="span" ml={1}>
                          {t("delivery.orders.openMap")}
                        </Box>
                      </Button>

                      <Button
                        size={{ base: "sm", md: "md" }}
                        variant="outline"
                        rounded="16px"
                        bg={
                          order.status === "delivered"
                            ? colors.light.mainFixed
                            : colorMode === "light"
                            ? colors.light.mainFixed
                            : colors.dark.mainFixed
                        }
                        color={
                          order.status === "delivered"
                            ? "white"
                            : colorMode === "light"
                            ? colors.light.white
                            : colors.dark.white
                        }
                        fontSize={{ base: "13px", md: "14px" }}
                        display={
                          order.status === "out_for_delivery" ? "flex" : "none"
                        }
                        onClick={async () => {
                          try {
                            await handleStatusUpdate(order.id, "delivered");
                            toaster.create({
                              title: "Order completed",
                              description: "Order marked as delivered.",
                              type: "success",
                            });
                          } catch (e) {
                            toaster.create({
                              title: "Action failed",
                              description:
                                e?.message || "Failed to complete order.",
                              type: "error",
                            });
                          }
                        }}
                        isDisabled={
                          isUpdating || order.status !== "out_for_delivery"
                        }
                        _hover={{
                          opacity: 0.8,
                        }}
                        flex={1}
                        py={2}
                      >
                        <IoCheckmarkDoneSharp size={16} />

                        <Box as="span" ml={1}>
                          {t("delivery.orders.markComplete")}
                        </Box>
                      </Button>

                      <Button
                        size={{ base: "sm", md: "md" }}
                        variant="outline"
                        rounded="16px"
                        bg={
                          order.status === "Unable to Deliver"
                            ? colors.mainFixed
                            : colorMode === "light"
                            ? colors.light.bgFourth
                            : colors.dark.bgFourth
                        }
                        border={"1px solid #FA2C23"}
                        color={"#FA2C23"}
                        fontSize={{ base: "13px", md: "14px" }}
                        display={
                          order.status === "ready_for_pickup" ? "flex" : "none"
                        }
                        onClick={() => {
                          dialog.setOpen(true);
                          setDeleteId(order.id);
                        }}
                        isDisabled={
                          isUpdating || order.status === "Unable to Deliver"
                        }
                        _hover={{
                          bg:
                            order.status === "Unable to Deliver"
                              ? colors.mainFixed
                              : colorMode === "light"
                              ? colors.light.bgThird
                              : colors.dark.bgThird,
                        }}
                        flex={1}
                        py={2}
                      >
                        <IoMdClose />
                        <Box as="span" ml={1}>
                          {t("delivery.orders.unableToDeliver")}
                        </Box>
                      </Button>
                      <Box
                        display={
                          order.status === "delivered" ? "inline-flex" : "none"
                        }
                        alignItems="center"
                        justifyContent="center"
                        px={3}
                        py={1}
                        rounded="16px"
                        bg="green.500"
                        color="white"
                        fontSize={{ base: "13px", md: "14px" }}
                        ml="auto"
                        alignSelf="flex-end"
                      >

                        {t("delivery.orders.completedLabel")}
                      </Box>
                    </Flex>
                  </Flex>
                </Box>
              );
            })
          )}

          {/* Pagination */}
          {!isLoading && filteredOrders.length > ORDERS_PER_PAGE && (
            <Flex justifyContent="center" mt={8} mb={4}>
              <Pagination.Root
                count={filteredOrders.length}
                pageSize={ORDERS_PER_PAGE}
                page={currentPage}
                onPageChange={handlePageChange}
              >
                <ButtonGroup
                  variant="ghost"
                  size={{ base: "sm", md: "md" }}
                  gap={1}
                >
                  <Pagination.PrevTrigger asChild>
                    <IconButton
                      bg={
                        colorMode === "light"
                          ? colors.light.bgThird
                          : colors.dark.bgThird
                      }
                      color={
                        colorMode === "light"
                          ? colors.light.textSub
                          : colors.dark.textSub
                      }
                      _hover={{
                        bg:
                          colorMode === "light"
                            ? colors.light.bgFourth
                            : colors.dark.bgFourth,
                      }}
                      _disabled={{
                        opacity: 0.4,
                        cursor: "not-allowed",
                      }}
                    >
                      <LuChevronLeft />
                    </IconButton>
                  </Pagination.PrevTrigger>

                  <Pagination.Items
                    render={(page) => (
                      <IconButton
                        bg={
                          page.type === "page" && page.value === currentPage
                            ? colors.light.mainFixed
                            : colorMode === "light"
                            ? colors.light.bgThird
                            : colors.dark.bgThird
                        }
                        color={
                          page.type === "page" && page.value === currentPage
                            ? "white"
                            : colorMode === "light"
                            ? colors.light.textSub
                            : colors.dark.textSub
                        }
                        _hover={{
                          bg:
                            page.type === "page" && page.value === currentPage
                              ? colors.light.mainFixed
                              : colorMode === "light"
                              ? colors.light.bgFourth
                              : colors.dark.bgFourth,
                        }}
                      >
                        {page.value}
                      </IconButton>
                    )}
                  />

                  <Pagination.NextTrigger asChild>
                    <IconButton
                      bg={
                        colorMode === "light"
                          ? colors.light.bgThird
                          : colors.dark.bgThird
                      }
                      color={
                        colorMode === "light"
                          ? colors.light.textSub
                          : colors.dark.textSub
                      }
                      _hover={{
                        bg:
                          colorMode === "light"
                            ? colors.light.bgFourth
                            : colors.dark.bgFourth,
                      }}
                      _disabled={{
                        opacity: 0.4,
                        cursor: "not-allowed",
                      }}
                    >
                      <LuChevronRight />
                    </IconButton>
                  </Pagination.NextTrigger>
                </ButtonGroup>
              </Pagination.Root>
            </Flex>
          )}
        </Box>
      )}

      <CustomAlertDialog
        dialog={dialog}
        title={t("delivery.orders.confirmRemoveTitle")}
        description={t("delivery.orders.confirmRemoveDesc")}
        cancelTxt={t("delivery.orders.confirmRemoveNo")}
        okTxt={t("delivery.orders.confirmRemoveYes")}
        onOkHandler={() => {
          if (deleteId) {
            handleRemoveOrder(deleteId);
          }
        }}
      />
    </Box>
  );
};

export default DeliveryOrders;
