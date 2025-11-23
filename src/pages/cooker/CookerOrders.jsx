import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  Button,
  Group,
  useDialog,
  Grid,
  Pagination,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import { toaster } from "../../components/ui/toaster";
import {
  useGetCookerOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} from "../../app/features/Cooker/CookerAcceptOrder";
import { IoPerson } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { BsFillCreditCardFill } from "react-icons/bs";
import { MdOutlineDoneOutline } from "react-icons/md";
import { PiCookingPot } from "react-icons/pi";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import srcLoadingImg from "../../assets/Transparent Version.gif";
import CustomAlertDialog from "../../shared/CustomAlertDailog";

const ORDERS_PER_PAGE = 2;

const CookerOrders = () => {
  /* ---------------variable----------------- */
  const { colorMode } = useColorMode();

  /* ---------------state----------------- */
  const [selectedStatus, setSelectedStatus] = useState("Default");
  const [deleteId, setDeleteId] = useState([]);
  const [allOrder, setAllOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dialog = useDialog();

  /* ---------------Redux Query----------------- */
  const { data: orders, isLoading, error } = useGetCookerOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  /* ---------------useEffect----------------- */
  useEffect(() => {
    if (!orders) {
      setAllOrder([]);
      return;
    }

    if (selectedStatus === "Default") {
      setAllOrder(orders);
      return;
    }

    const filteredOrders = orders.filter(
      (order) => order.status?.toLowerCase() === selectedStatus.toLowerCase()
    );

    setAllOrder(filteredOrders);
    // Reset to page 1 when filter changes
    setCurrentPage(1);
  }, [orders, selectedStatus]);

  /* ---------------Pagination Logic----------------- */
  const { paginatedOrders } = useMemo(() => {
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    const endIndex = startIndex + ORDERS_PER_PAGE;
    const paginated = allOrder.slice(startIndex, endIndex);
    const pages = Math.ceil(allOrder.length / ORDERS_PER_PAGE);

    return {
      paginatedOrders: paginated,
      totalPages: pages,
    };
  }, [allOrder, currentPage]);

  /* ---------------HANDLER----------------- */
  const canTransitionStatus = (currentStatus, nextStatus) => {
    switch (nextStatus) {
      case "confirmed":
        return (
          currentStatus !== "confirmed" &&
          currentStatus !== "preparing" &&
          currentStatus !== "ready_for_pickup"
        );
      case "preparing":
        return currentStatus === "confirmed";
      case "ready_for_pickup":
        return currentStatus === "preparing";
      default:
        return false;
    }
  };

  const handleStatusUpdate = async (order, status) => {
    const currentStatus = (order.status || "").toLowerCase();

    if (!canTransitionStatus(currentStatus, status)) {
      toaster.create({
        title: "Attention",
        description: "You can't go back to the previous step or skip a step.",
        type: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      await updateOrderStatus({ orderId: order.id, status }).unwrap();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId).unwrap();
      // If we deleted the last order on a page, go to previous page
      if (paginatedOrders.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  };

  const handlePageChange = (details) => {
    setCurrentPage(details.page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const statusTabs = [
    { label: "All", value: "Default" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Preparing", value: "preparing" },
    { label: "Ready", value: "ready_for_pickup" },
  ];

  return (
    <>
      <Box py={6}>
        {/* name order and select */}
        <Flex
          my={4}
          justifyContent="space-between"
          alignItems="center"
          direction={{ base: "column", md: "row" }}
          gap={{ base: 3, md: 0 }}
          w="100%"
        >
          {/* order */}
          <Heading
            fontSize={{ base: "25px", lg: "45px" }}
            fontWeight={700}
            mb={4}
          >
            Orders
          </Heading>

          {/* select menu */}
          <Flex
            bg={
              colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
            }
            borderRadius="999px"
            p="4px"
            alignItems="center"
            gap={1}
            w={{ base: "100%", md: "auto" }}
            overflowX={{ base: "auto", md: "visible" }}
            flexWrap={{ base: "nowrap", md: "nowrap" }}
            justifyContent={{ base: "flex-start", md: "flex-start" }}
            sx={{
              scrollSnapType: "x mandatory",
              "::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {statusTabs.map((tab) => {
              const isActive = selectedStatus === tab.value;
              return (
                <Button
                  key={tab.value}
                  size="sm"
                  variant="ghost"
                  px={{ base: 3, md: 4 }}
                  py={{ base: 1.5, md: 2 }}
                  borderRadius="999px"
                  bg={isActive ? "white" : "transparent"}
                  color={
                    isActive ? colors.light.mainFixed : colors.light.textSub
                  }
                  fontWeight={isActive ? "bold" : "medium"}
                  fontSize={{ base: "13px", md: "14px" }}
                  onClick={() => setSelectedStatus(tab.value)}
                  flexShrink={0}
                  sx={{ scrollSnapAlign: "center" }}
                  _hover={{
                    bg: isActive ? "white" : colors.bgFourth,
                  }}
                >
                  {tab.label}
                </Button>
              );
            })}
          </Flex>
        </Flex>

        {/* Orders count */}
        {!isLoading && !error && allOrder.length > 0 && (
          <Text
            color={
              colorMode === "light" ? colors.light.textSub : colors.dark.textSub
            }
            fontSize="sm"
            mb={4}
          >
            Showing {(currentPage - 1) * ORDERS_PER_PAGE + 1} -{" "}
            {Math.min(currentPage * ORDERS_PER_PAGE, allOrder.length)} of{" "}
            {allOrder.length} orders
          </Text>
        )}

        {/* content order */}
        {isLoading && (
          <Image
            boxSize={40}
            mx={"auto"}
            rounded="md"
            src={srcLoadingImg}
            alt="Loading"
          />
        )}

        {error && (
          <Text color="red.500" textAlign="center" my={6}>
            Error: {error.message || "Failed to load orders"}
          </Text>
        )}

        {!isLoading && !error && orders && allOrder.length === 0 && (
          <Text
            color={
              colorMode === "light" ? colors.light.textSub : colors.dark.textSub
            }
            textAlign="center"
            my={6}
          >
            {selectedStatus === "Default"
              ? "No orders found"
              : "No orders with the selected status"}
          </Text>
        )}

        {!isLoading &&
          !error &&
          orders &&
          paginatedOrders.map((order) => {
            const orderDate = new Date(order.created_at);
            const formattedDate = orderDate.toLocaleDateString("en-GB");
            const formattedTime = orderDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            const normalizedStatus = (order.status || "").toLowerCase();
            const isConfirmed = normalizedStatus === "confirmed";
            const isPreparing = normalizedStatus === "preparing";
            const isReadyForPickup = normalizedStatus === "ready_for_pickup";
            const canClickConfirm =
              !isConfirmed && !isPreparing && !isReadyForPickup;
            const canClickPreparing = isConfirmed;
            const canClickReadyForPickup = isPreparing;

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
                {/* Header: date, time, id and total */}
                <Flex
                  justifyContent={"space-between"}
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
                    fontWeight={"medium"}
                  >
                    {formattedDate} | {formattedTime} | #ORD-
                    {order.id.slice(0, 8).toUpperCase()}
                  </Text>
                  <Text
                    color={
                      colorMode === "light"
                        ? colors.light.mainFixed
                        : colors.dark.mainFixed
                    }
                    fontSize={{ base: "20px", md: "24px" }}
                    fontWeight={"bold"}
                  >
                    {order.total?.toFixed(2) || "0.00"} LE
                  </Text>
                </Flex>

                {/* Main Content: order items and customer details */}
                <Grid
                  templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                  gap={{ base: 4, md: 5 }}
                  mb={4}
                >
                  {/* Order Items */}
                  <Box
                    bg={
                      colorMode === "light"
                        ? colors.light.bgFourth
                        : colors.dark.bgFourth
                    }
                    rounded={"20px"}
                    p={{ base: 4, md: 5 }}
                  >
                    <Heading
                      as={"h3"}
                      fontSize={{ base: "16px", md: "18px" }}
                      fontWeight={600}
                      mb={3}
                      color={
                        colorMode === "light"
                          ? colors.light.textMain
                          : colors.dark.textMain
                      }
                    >
                      Order Items
                    </Heading>
                    <Box maxH="120px" overflowY="auto">
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
                          No items
                        </Text>
                      )}
                    </Box>

                    {/* Notes */}
                    {order.notes && (
                      <Box
                        mt={3}
                        pt={3}
                        borderTop={`1px solid ${
                          colorMode === "light"
                            ? colors.light.bgThird
                            : colors.dark.bgThird
                        }`}
                      >
                        <Heading
                          as={"h4"}
                          fontSize={{ base: "14px", md: "16px" }}
                          fontWeight={600}
                          mb={1}
                          color={
                            colorMode === "light"
                              ? colors.light.textMain
                              : colors.dark.textMain
                          }
                        >
                          Notes
                        </Heading>
                        <Text
                          color={
                            colorMode === "light"
                              ? colors.light.textSub
                              : colors.dark.textSub
                          }
                          fontSize="13px"
                          noOfLines={2}
                        >
                          {order.notes}
                        </Text>
                      </Box>
                    )}
                  </Box>

                  {/* Customer Details */}
                  <Box
                    bg={
                      colorMode === "light"
                        ? colors.light.info10a
                        : colors.dark.info10a
                    }
                    rounded={"20px"}
                    p={{ base: 4, md: 5 }}
                  >
                    <Heading
                      as={"h3"}
                      fontSize={{ base: "16px", md: "18px" }}
                      fontWeight={"bold"}
                      mb={3}
                      color={
                        colorMode === "light"
                          ? colors.light.textMain
                          : colors.dark.textMain
                      }
                    >
                      Customer Details
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
                          alignItems={"center"}
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
                          alignItems={"flex-start"}
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
                          >
                            {order.address || "No address"}
                          </Text>
                        </Flex>
                        <Flex
                          mb={3}
                          color={
                            colorMode === "light"
                              ? colors.light.textSub
                              : colors.dark.textSub
                          }
                          alignItems={"center"}
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
                          <Text fontSize={{ base: "14px", md: "15px" }}>
                            {order.customer.phone || "No phone"}
                          </Text>
                        </Flex>

                        {/* Payment Method */}
                        <Box
                          pt={2}
                          borderTop={`1px solid ${
                            colorMode === "light"
                              ? colors.light.bgThird
                              : colors.dark.bgThird
                          }`}
                        >
                          <Text
                            fontSize={{ base: "13px", md: "14px" }}
                            fontWeight={"bold"}
                            mb={1}
                            color={
                              colorMode === "light"
                                ? colors.light.textMain
                                : colors.dark.textMain
                            }
                          >
                            Payment
                          </Text>
                          <Flex alignItems={"center"} gap={1.5}>
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
                        No customer information
                      </Text>
                    )}
                  </Box>
                </Grid>

                {/* Action Buttons */}
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justifyContent={"space-between"}
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
                      variant="outline"
                      py={2}
                      rounded={"16px"}
                      bg={
                        isConfirmed
                          ? colors.light.mainFixed
                          : colors.light.bgFourth
                      }
                      color={isConfirmed ? "white" : colors.light.textSub}
                      fontSize={{ base: "13px", md: "14px" }}
                      onClick={() => handleStatusUpdate(order, "confirmed")}
                      isDisabled={isUpdating || !canClickConfirm}
                      _hover={{
                        bg: isConfirmed
                          ? colors.light.mainFixed
                          : colors.light.bgThird,
                      }}
                      _disabled={{
                        opacity: 0.5,
                        cursor: "not-allowed",
                        bg: colors.light.bgThird,
                        color: colors.light.textSub,
                      }}
                      flex={1}
                    >
                      <MdOutlineDoneOutline size={16} />
                      <Box as="span" ml={1}>
                        Confirmed
                      </Box>
                    </Button>
                    {!canClickConfirm && (
                      <Button
                        py={2}
                        size={{ base: "sm", md: "md" }}
                        variant="outline"
                        rounded={"16px"}
                        bg={
                          isPreparing
                            ? colors.light.mainFixed
                            : colors.light.bgFourth
                        }
                        color={isPreparing ? "white" : colors.light.textSub}
                        fontSize={{ base: "13px", md: "14px" }}
                        onClick={() => handleStatusUpdate(order, "preparing")}
                        isDisabled={isUpdating || !canClickPreparing}
                        _hover={{
                          bg: isPreparing
                            ? colors.light.mainFixed
                            : colors.light.bgThird,
                        }}
                        _disabled={{
                          opacity: 0.5,
                          cursor: "not-allowed",
                          bg: colors.light.bgThird,
                          color: colors.light.textSub,
                        }}
                        flex={1}
                      >
                        <PiCookingPot size={16} />
                        <Box as="span" ml={1}>
                          Preparing
                        </Box>
                      </Button>
                    )}
                    {!canClickConfirm && (
                      <Button
                        py={2}
                        size={{ base: "sm", md: "md" }}
                        variant="outline"
                        rounded={"16px"}
                        bg={
                          isReadyForPickup
                            ? colors.light.mainFixed
                            : colors.light.bgFourth
                        }
                        color={
                          isReadyForPickup ? "white" : colors.light.textSub
                        }
                        fontSize={{ base: "13px", md: "14px" }}
                        onClick={() =>
                          handleStatusUpdate(order, "ready_for_pickup")
                        }
                        isDisabled={isUpdating || !canClickReadyForPickup}
                        _hover={{
                          bg: isReadyForPickup
                            ? colors.light.mainFixed
                            : colors.light.bgThird,
                        }}
                        _disabled={{
                          opacity: 0.5,
                          cursor: "not-allowed",
                          bg: colors.light.bgThird,
                          color: colors.light.textSub,
                        }}
                        flex={1}
                      >
                        <MdOutlineDeliveryDining size={16} />
                        <Box
                          as="span"
                          ml={1}
                          display={{ base: "none", sm: "inline" }}
                        >
                          ready for Pickup
                        </Box>
                        <Box
                          as="span"
                          ml={1}
                          display={{ base: "inline", sm: "none" }}
                        >
                          Delivery
                        </Box>
                      </Button>
                    )}
                  </Flex>
                  {canClickConfirm && (
                    <Button
                      py={2}
                      size={{ base: "sm", md: "md" }}
                      variant="outline"
                      rounded={"16px"}
                      bg={colors.light.bgThird}
                      color={colors.light.mainFixed}
                      fontSize={{ base: "13px", md: "14px" }}
                      onClick={() => {
                        dialog.setOpen(true);
                        setDeleteId(order.id);
                      }}
                      isDisabled={isDeleting}
                      _hover={{ bg: colors.light.bgFourth }}
                      _disabled={{
                        opacity: 0.5,
                        cursor: "not-allowed",
                        bg: colors.light.bgThird,
                        color: colors.light.textSub,
                      }}
                      w={{ base: "100%", md: "auto" }}
                    >
                      <MdOutlineCancel size={16} />
                      <Box as="span" ml={1}>
                        Cancel
                      </Box>
                    </Button>
                  )}
                </Flex>
              </Box>
            );
          })}

        {/* Pagination */}
        {!isLoading && !error && allOrder.length > ORDERS_PER_PAGE && (
          <Flex justifyContent="center" mt={8} mb={4}>
            <Pagination.Root
              count={allOrder.length}
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
                    bg={colors.light.bgThird}
                    color={colors.light.textSub}
                    _hover={{ bg: colors.light.bgFourth }}
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
                          : colors.light.bgThird
                      }
                      color={
                        page.type === "page" && page.value === currentPage
                          ? "white"
                          : colors.light.textSub
                      }
                      _hover={{
                        bg:
                          page.type === "page" && page.value === currentPage
                            ? colors.light.mainFixed
                            : colors.light.bgFourth,
                      }}
                    >
                      {page.value}
                    </IconButton>
                  )}
                />

                <Pagination.NextTrigger asChild>
                  <IconButton
                    bg={colors.light.bgThird}
                    color={colors.light.textSub}
                    _hover={{ bg: colors.light.bgFourth }}
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

      <CustomAlertDialog
        dialog={dialog}
        title={"Are you sure you want to cancel this order?"}
        description={
          "This action cannot be undone. The order will be permanently cancelled."
        }
        cancelTxt={"No, go back"}
        okTxt={"Yes, cancel it"}
        onOkHandler={() => handleDeleteOrder(deleteId)}
      />
    </>
  );
};

export default CookerOrders;
