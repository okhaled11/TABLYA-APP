import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  Button,
  useDialog,
  Pagination,
  ButtonGroup,
  IconButton,
  Badge,
  Table,
  HStack,
  VStack,
  Drawer,
  Grid,
  Avatar,
} from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import { toaster } from "../../components/ui/toaster";
import {
  useGetCookerOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../app/features/Cooker/CookerAcceptOrder";
import { IoPerson, IoCall } from "react-icons/io5";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { BsBoxSeamFill, BsFillCreditCardFill } from "react-icons/bs";
import { MdOutlineDoneOutline, MdOutlineCancel, MdClose } from "react-icons/md";
import { PiCookingPot } from "react-icons/pi";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import srcLoadingImg from "../../assets/Transparent Version.gif";
import CustomAlertDialog from "../../shared/CustomAlertDailog";

const ORDERS_PER_PAGE = 10;

const CookerOrders = () => {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [deleteId, setDeleteId] = useState([]);
  const [allOrder, setAllOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dialog = useDialog();

  const { data: orders, isLoading, error } = useGetCookerOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  useEffect(() => {
    if (!orders) {
      setAllOrder([]);
      return;
    }

    // Filter for current month first
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyOrders = orders.filter((order) => {
      const created = order?.created_at ? new Date(order.created_at) : null;
      if (!created) return false;
      return (
        created.getMonth() === currentMonth &&
        created.getFullYear() === currentYear
      );
    });

    if (selectedStatus === "active") {
      const filtered = monthlyOrders.filter(
        (order) => (order.status || "").toLowerCase() === "created"
      );
      setAllOrder(filtered);
      setCurrentPage(1);
      return;
    }

    if (selectedStatus === "ready_for_pickup") {
      const filtered = monthlyOrders.filter(
        (order) => (order.status || "").toLowerCase() === "ready_for_pickup"
      );
      setAllOrder(filtered);
      setCurrentPage(1);
      return;
    }

    if (selectedStatus === "out_for_delivery") {
      const filtered = monthlyOrders.filter((order) => {
        const s = (order.status || "").toLowerCase();
        return s === "out_for_delivery" || s === "delivered";
      });
      setAllOrder(filtered);
      setCurrentPage(1);
      return;
    }

    const filteredOrders = monthlyOrders.filter(
      (order) =>
        (order.status || "").toLowerCase() === selectedStatus.toLowerCase()
    );

    setAllOrder(filteredOrders);
    setCurrentPage(1);
  }, [orders, selectedStatus]);

  const { paginatedOrders } = useMemo(() => {
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    const endIndex = startIndex + ORDERS_PER_PAGE;
    const paginated = allOrder.slice(startIndex, endIndex);

    return {
      paginatedOrders: paginated,
    };
  }, [allOrder, currentPage]);

  const canTransitionStatus = (currentStatus, nextStatus) => {
    if (
      currentStatus === "out_for_delivery" ||
      currentStatus === "delivered" ||
      currentStatus === "cancelled"
    ) {
      return false;
    }
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
        title: t("cookerOrders.toast.attention"),
        description: t("cookerOrders.toast.cantSkip"),
        type: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      await updateOrderStatus({ orderId: order.id, status }).unwrap();
      setIsDrawerOpen(false);
      
      // Automatically switch to the appropriate tab based on new status
      setSelectedStatus(status);
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await updateOrderStatus({ orderId, status: "cancelled" }).unwrap();
      setIsDrawerOpen(false);
      
      // Automatically switch to cancelled tab
      setSelectedStatus("cancelled");
    } catch (err) {
      console.error("Failed to cancel order:", err);
    }
  };

  const handlePageChange = (details) => {
    setCurrentPage(details.page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      created: { bg: "#F3F4F6", color: "#374151", label: t("cookerOrders.statusMeta.created") },
      confirmed: { bg: "#DBEAFE", color: "#1E40AF", label: t("cookerOrders.statusMeta.confirmed") },
      preparing: { bg: "#FEF3C7", color: "#B45309", label: t("cookerOrders.statusMeta.preparing") },
      ready_for_pickup: { bg: "#D1FAE5", color: "#065F46", label: t("cookerOrders.statusMeta.ready_for_pickup") },
      out_for_delivery: { bg: "#DBEAFE", color: "#1E40AF", label: t("cookerOrders.statusMeta.out_for_delivery") },
      delivered: { bg: "#D1FAE5", color: "#065F46", label: t("cookerOrders.statusMeta.delivered") },
      cancelled: { bg: "#FEE2E2", color: "#991B1B", label: t("cookerOrders.statusMeta.cancelled") },
    };

    const normalizedStatus = (status || "created").toLowerCase();
    const config = statusColors[normalizedStatus] || statusColors.created;

    return (
      <Badge
        bg={config.bg}
        color={config.color}
        px={3}
        py={1}
        borderRadius="full"
        fontSize="xs"
        fontWeight="bold"
      >
        {config.label}
      </Badge>
    );
  };

  const statusTabs = [
    { label: t("cookerOrders.tabs.active"), value: "active" },
    { label: t("cookerOrders.tabs.confirmed"), value: "confirmed" },
    { label: t("cookerOrders.tabs.preparing"), value: "preparing" },
    { label: t("cookerOrders.tabs.readyPickup"), value: "ready_for_pickup" },
    { label: t("cookerOrders.tabs.outDelivery"), value: "out_for_delivery" },
    { label: t("cookerOrders.tabs.cancelled"), value: "cancelled" },
  ];

  return (
    <>
      <Box py={6}>
        {/* Header */}
        <Flex
          my={4}
          justifyContent="space-between"
          alignItems="center"
          direction={{ base: "column", md: "row" }}
          gap={{ base: 3, md: 0 }}
          w="100%"
        >
          <Heading fontSize={{ base: "25px", lg: "45px" }} fontWeight={700}>
            {t("cookerOrders.title")}
          </Heading>

          {/* Status Filter */}
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
                  _hover={{
                    bg: isActive ? "white" : colors.light.bgFourth,
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

            {t("cookerOrders.showing", {
              start: (currentPage - 1) * ORDERS_PER_PAGE + 1,
              end: Math.min(currentPage * ORDERS_PER_PAGE, allOrder.length),
              total: allOrder.length
            })}
          </Text>
        )}

        {/* Loading */}
        {isLoading && (
          <Flex justify="center" py={10}>
            <Image boxSize={40} src={srcLoadingImg} alt="Loading" />
          </Flex>
        )}

        {/* Error */}
        {error && (
          <Text color="red.500" textAlign="center" my={6}>

            {error?.message || t("cookerOrders.error")}
          </Text>
        )}

        {/* Empty State */}
        {!isLoading && !error && orders && allOrder.length === 0 && (
          <Flex justify="center" py={10} direction="column" alignItems="center">
            <BsBoxSeamFill
              size={40}
              color={
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed
              }
            />
            <Text
              color={
                colorMode === "light"
                  ? colors.light.textSub
                  : colors.dark.textSub
              }
              textAlign="center"
              my={6}
            >

              {t("cookerOrders.noOrdersStatus")}
            </Text>
          </Flex>
        )}

        {/* Orders Table */}
        {!isLoading && !error && paginatedOrders.length > 0 && (
          <Box
            bg={
              colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
            }
            borderRadius="16px"
            overflow="hidden"
            boxShadow="lg"
          >
            <Box overflowX="auto">
              <Table.Root size="md">
                <Table.Header>
                  <Table.Row
                    bg={
                      colorMode === "light"
                        ? colors.light.bgFourth
                        : colors.dark.bgFourth
                    }
                  >
                    <Table.ColumnHeader minW="120px" fontWeight="bold">
                      {t("cookerOrders.table.id")}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader minW="150px" fontWeight="bold">
                      {t("cookerOrders.table.dateTime")}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader minW="180px" fontWeight="bold">
                      {t("cookerOrders.table.customer")}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                      minW="100px"
                      fontWeight="bold"
                      textAlign="right"
                    >
                      {t("cookerOrders.table.total")}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader minW="100px" fontWeight="bold">
                      {t("cookerOrders.table.status")}
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {paginatedOrders.map((order) => {
                    const orderDate = new Date(order.created_at);
                    const formattedDate = orderDate.toLocaleDateString("en-GB");
                    const formattedTime = orderDate.toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    );

                    return (
                      <Table.Row
                        key={order.id}
                        cursor="pointer"
                        onClick={() => handleRowClick(order)}
                        _hover={{
                          bg:
                            colorMode === "light"
                              ? colors.light.bgThird
                              : colors.dark.bgThird,
                        }}
                        bg={
                          colorMode === "light"
                            ? colors.light.bgMain
                            : colors.dark.bgMain
                        }
                        transition="all 0.2s"
                      >
                        <Table.Cell>
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color={colors.light.mainFixed}
                          >
                            #ORD-{order.id.slice(0, 8).toUpperCase()}
                          </Text>
                        </Table.Cell>

                        <Table.Cell>
                          <VStack align="start" gap={0}>
                            <Text fontSize="sm">{formattedDate}</Text>
                            <Text fontSize="xs" color={colors.light.textSub}>
                              {formattedTime}
                            </Text>
                          </VStack>
                        </Table.Cell>

                        <Table.Cell>
                          <VStack align="start" gap={0.5}>
                            <Text fontSize="sm" noOfLines={1}>

                              {order.customer?.name || t("cookerOrders.drawer.noCustomerInfo")}
                            </Text>
                          </VStack>
                        </Table.Cell>

                        <Table.Cell textAlign="right">
                          <Text
                            fontSize="md"
                            fontWeight="bold"
                            color={colors.light.mainFixed}
                          >
                            {order.total?.toFixed(2) || "0.00"} {t("common.currency")}
                          </Text>
                        </Table.Cell>

                        <Table.Cell>{getStatusBadge(order.status)}</Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>
        )}

        {/* Pagination */}
        {!isLoading && !error && allOrder.length > ORDERS_PER_PAGE && (
          <Flex justifyContent="center" mt={6}>
            <Pagination.Root
              count={allOrder.length}
              pageSize={ORDERS_PER_PAGE}
              page={currentPage}
              onPageChange={handlePageChange}
            >
              <ButtonGroup size="sm" gap={1}>
                <Pagination.PrevTrigger asChild>
                  <IconButton
                    bg={colors.light.bgThird}
                    color={colors.light.textSub}
                    _hover={{ bg: colors.light.bgFourth }}
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
                  >
                    <LuChevronRight />
                  </IconButton>
                </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
          </Flex>
        )}
      </Box>

      {/* Order Details Drawer */}
      <Drawer.Root
        open={isDrawerOpen}
        onOpenChange={(e) => setIsDrawerOpen(e.open)}
        placement="end"
        size="md"
      >
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content
            bg={
              colorMode === "light"
                ? colors.light.bgSecond
                : colors.dark.bgSecond
            }
          >
            <Drawer.Header borderBottomWidth="1px">
              <Flex justify="space-between" w={"full"} align="center">
                <Heading size="md">

                  {t("cookerOrders.drawer.orderId", { id: selectedOrder?.id.slice(0, 8).toUpperCase() })}
                </Heading>
                <IconButton
                  variant="ghost"
                  onClick={() => setIsDrawerOpen(false)}
                  size="sm"
                >
                  <MdClose size={20} />
                </IconButton>
              </Flex>
            </Drawer.Header>

            <Drawer.Body p={0}>
              {selectedOrder &&
                (() => {
                  const orderDate = new Date(selectedOrder.created_at);
                  const formattedDate = orderDate.toLocaleDateString("en-GB");
                  const formattedTime = orderDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });

                  const normalizedStatus = (
                    selectedOrder.status || ""
                  ).toLowerCase();
                  const isConfirmed = normalizedStatus === "confirmed";
                  const isPreparing = normalizedStatus === "preparing";
                  const isReadyForPickup =
                    normalizedStatus === "ready_for_pickup";
                  const isCancelled = normalizedStatus === "cancelled";
                  const isOutForDelivery =
                    normalizedStatus === "out_for_delivery";
                  const isDelivered = normalizedStatus === "delivered";
                  const isTerminal =
                    isCancelled || isOutForDelivery || isDelivered || isReadyForPickup;
                  const canClickConfirm =
                    !isConfirmed &&
                    !isPreparing &&
                    !isReadyForPickup &&
                    !isTerminal;
                  const canClickPreparing = isConfirmed;
                  const canClickReadyForPickup = isPreparing;

                  return (
                    <Box>
                      {/* Order Header Section */}
                      <Box
                        bg={colors.light.bgFourth}
                        p={6}
                        borderBottom={`1px solid ${colors.light.bgThird}`}
                      >
                        <Flex justify="space-between" align="start" mb={4}>
                          <Box>
                            <Text
                              fontSize="xs"
                              color={colors.light.textSub}
                              mb={1}
                            >
                              {formattedDate} • {formattedTime}
                            </Text>
                            <Text
                              fontSize="3xl"
                              fontWeight="bold"
                              color={colors.light.mainFixed}
                              mt={4}
                            >
                              {selectedOrder.total?.toFixed(2) || "0.00"} {t("common.currency")}
                            </Text>
                          </Box>
                          {getStatusBadge(selectedOrder.status)}
                        </Flex>
                      </Box>

                      {/* Order Content */}
                      <VStack
                        align="stretch"
                        gap={0}
                        divideY={`1px solid ${colors.light.bgFourth}`}
                      >
                        {/* Order Items Section */}
                        <Box p={6}>
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            color={colors.light.textSub}
                            mb={3}
                            textTransform="uppercase"
                            letterSpacing="wider"
                          >
                            {t("cookerOrders.drawer.items")}
                          </Text>
                          <VStack align="stretch" gap={3}>
                            {selectedOrder.order_items &&
                            selectedOrder.order_items.length > 0 ? (
                              selectedOrder.order_items.map((item, index) => (
                                <Flex
                                  key={index}
                                  justify="space-between"
                                  align="center"
                                >
                                  <HStack gap={3}>
                                    <Box
                                      bg={colors.light.mainFixed}
                                      color="white"
                                      rounded="md"
                                      w="32px"
                                      h="32px"
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                      fontSize="sm"
                                      fontWeight="bold"
                                    >
                                      {item.quantity}x
                                    </Box>
                                    <Text fontSize="md" fontWeight="medium">
                                      {item.title}
                                    </Text>
                                  </HStack>
                                </Flex>
                              ))
                            ) : (
                              <Text fontSize="sm" color={colors.light.textSub}>

                                {t("cookerOrders.drawer.noItems")}
                              </Text>
                            )}
                          </VStack>

                          {selectedOrder.notes && (
                            <Box
                              mt={4}
                              p={3}
                              bg={colors.light.bgFourth}
                              rounded="lg"
                            >
                              <Text fontSize="xs" fontWeight="bold" mb={1}>

                                {t("cookerOrders.drawer.specialInstructions")}
                              </Text>
                              <Text fontSize="sm" color={colors.light.textSub}>
                                {selectedOrder.notes}
                              </Text>
                            </Box>
                          )}
                        </Box>

                        {/* Customer Details Section */}
                        <Box p={6}>
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            color={colors.light.textSub}
                            mb={3}
                            textTransform="uppercase"
                            letterSpacing="wider"
                          >
                            {t("cookerOrders.drawer.customerInfo")}
                          </Text>
                          {selectedOrder.customer ? (
                            <VStack align="stretch" gap={3}>
                              <HStack gap={3}>
                                <Box
                                  bg={colors.light.info10a}
                                  rounded="full"
                                  w="40px"
                                  h="40px"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <IoPerson
                                    size={20}
                                    color={colors.light.info}
                                  />
                                </Box>
                                <Box>
                                  <Text
                                    fontSize="xs"
                                    color={colors.light.textSub}
                                  >
                                    {t("cookerOrders.drawer.name")}
                                  </Text>
                                  <Text fontSize="md" fontWeight="medium">
                                    {selectedOrder.customer.name || t("cookerOrders.drawer.noCustomerInfo")}
                                  </Text>
                                </Box>
                              </HStack>

                              <HStack gap={3} align="start">
                                <Box
                                  bg={colors.light.info10a}
                                  rounded="full"
                                  w="40px"
                                  h="40px"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  flexShrink={0}
                                >
                                  <FaLocationDot
                                    size={18}
                                    color={colors.light.info}
                                  />
                                </Box>
                                <Box>
                                  <Text
                                    fontSize="xs"
                                    color={colors.light.textSub}
                                  >

                                    {t("cookerOrders.drawer.deliveryAddress")}
                                  </Text>
                                  <Text fontSize="sm">
                                    {selectedOrder.address || t("cookerOrders.drawer.noAddress")}
                                  </Text>
                                </Box>
                              </HStack>

                              <HStack gap={3}>
                                <Box
                                  bg={colors.light.info10a}
                                  rounded="full"
                                  w="40px"
                                  h="40px"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <BsFillCreditCardFill
                                    size={18}
                                    color={colors.light.info}
                                  />
                                </Box>
                                <Box>
                                  <Text
                                    fontSize="xs"
                                    color={colors.light.textSub}
                                  >

                                    {t("cookerOrders.drawer.paymentMethod")}
                                  </Text>
                                  <Text fontSize="sm" fontWeight="medium">
                                    {selectedOrder.payment_method ||
                                      t("cookerOrders.drawer.notSpecified")}
                                  </Text>
                                </Box>
                              </HStack>
                            </VStack>
                          ) : (
                            <Text fontSize="sm" color={colors.light.textSub}>
                              {t("cookerOrders.drawer.noCustomerInfo")}
                            </Text>
                          )}
                        </Box>

                        {/* Delivery Information Section - Only show when assigned and in delivery/delivered status */}
                        {selectedOrder.delivery &&
                          (isOutForDelivery || isDelivered) && (
                            <Box p={6}>
                              <Text
                                fontSize="xs"
                                fontWeight="bold"
                                color={colors.light.textSub}
                                mb={3}
                                textTransform="uppercase"
                                letterSpacing="wider"
                              >
                                {t("cookerOrders.drawer.deliveryInfo")}
                              </Text>
                              <VStack align="stretch" gap={3}>
                                <HStack gap={3}>
                                  <Avatar.Root
                                    size="md"
                                    name={
                                      selectedOrder.delivery?.name || "Delivery"
                                    }
                                    colorPalette="purple"
                                  >
                                    {selectedOrder.delivery?.avatar_url ? (
                                      <Avatar.Image
                                        src={selectedOrder.delivery.avatar_url}
                                      />
                                    ) : (
                                      <Avatar.Fallback>
                                        {(selectedOrder.delivery?.name || "D")
                                          .charAt(0)
                                          .toUpperCase()}
                                      </Avatar.Fallback>
                                    )}
                                  </Avatar.Root>
                                  <Box>
                                    <Text
                                      fontSize="xs"
                                      color={colors.light.textSub}
                                    >
                                      {t("cookerOrders.drawer.deliveryPerson")}
                                    </Text>
                                    <Text fontSize="md" fontWeight="medium">
                                      {selectedOrder.delivery?.name ||
                                        t("cookerOrders.drawer.notAssigned")}
                                    </Text>
                                  </Box>
                                </HStack>

                                {selectedOrder.delivery?.phone && (
                                  <HStack gap={3}>
                                    <Box
                                      bg={colors.light.info10a}
                                      rounded="full"
                                      w="40px"
                                      h="40px"
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                    >
                                      <IoCall
                                        size={18}
                                        color={colors.light.info}
                                      />
                                    </Box>
                                    <Box>
                                      <Text
                                        fontSize="xs"
                                        color={colors.light.textSub}
                                      >
                                        {t("cookerOrders.drawer.phoneNumber")}
                                      </Text>
                                      <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        as="a"
                                        href={`tel:${selectedOrder.delivery.phone}`}
                                        color={
                                          colorMode === "light"
                                            ? colors.light.mainFixed
                                            : colors.dark.mainFixed
                                        }
                                        _hover={{ textDecoration: "underline" }}
                                      >
                                        {selectedOrder.delivery.phone}
                                      </Text>
                                    </Box>
                                  </HStack>
                                )}
                              </VStack>
                            </Box>
                          )}

                        {/* Actions Section */}
                        <Box
                          p={6}
                          bg={
                            colorMode === "light"
                              ? colors.light.bgFourth
                              : colors.dark.bgFourth
                          }
                        >
                          {isTerminal ? (
                            <Flex justify="center" p={4}>
                              <Badge
                                bg={
                                  isCancelled
                                    ? "red.100"
                                    : isReadyForPickup
                                    ? "green.100"
                                    : isOutForDelivery
                                    ? "blue.100"
                                    : "green.100"
                                }
                                color={
                                  isCancelled
                                    ? "red.700"
                                    : isReadyForPickup
                                    ? "green.700"
                                    : isOutForDelivery
                                    ? "blue.700"
                                    : "green.700"
                                }
                                rounded="full"
                                px={6}
                                py={3}
                                fontSize="md"
                                fontWeight="bold"
                              >
                                {isCancelled
                                  ? t("cookerOrders.drawer.status.cancelled")
                                  : isReadyForPickup
                                  ? t("cookerOrders.drawer.status.waitingDelivery")
                                  : isOutForDelivery
                                  ? t("cookerOrders.drawer.status.outForDelivery")
                                  : t("cookerOrders.drawer.status.delivered")}
                              </Badge>
                            </Flex>
                          ) : (
                            <VStack align="stretch" gap={3}>
                              <Text
                                fontSize="xs"
                                fontWeight="bold"
                                color={
                                  colorMode === "light"
                                    ? colors.light.textSub
                                    : colors.dark.textSub
                                }
                                mb={1}
                                textTransform="uppercase"
                                letterSpacing="wider"
                              >

                                {t("cookerOrders.drawer.updateStatus")}
                              </Text>

                              <Button
                                size="lg"
                                rounded="xl"
                                bg={canClickConfirm ? "green.600" : "gray.500"}
                                color="white"
                                border="none"
                                onClick={() =>
                                  handleStatusUpdate(selectedOrder, "confirmed")
                                }
                                isDisabled={isUpdating || !canClickConfirm}
                                _hover={{
                                  bg: canClickConfirm
                                    ? "green.700"
                                    : "gray.500",
                                }}
                                _disabled={{
                                  opacity: 0.5,
                                  cursor: "not-allowed",
                                }}
                                leftIcon={<MdOutlineDoneOutline size={22} />}
                              >

                                {t("cookerOrders.drawer.confirmOrder")}
                              </Button>

                              {!canClickConfirm && (
                                <Button
                                  size="lg"
                                  rounded="xl"
                                  bg={isPreparing ? "gray.500" : "green.500"}
                                  color={
                                    isPreparing
                                      ? "white"
                                      : colorMode === "light"
                                      ? colors.light.textMain
                                      : colors.dark.textMain
                                  }
                                  border={
                                    isPreparing
                                      ? "none"
                                      : `2px solid ${"transparent"}`
                                  }
                                  onClick={() =>
                                    handleStatusUpdate(
                                      selectedOrder,
                                      "preparing"
                                    )
                                  }
                                  isDisabled={isUpdating || !canClickPreparing}
                                  _hover={{
                                    bg: isPreparing ? "gray.500" : "green.400",
                                  }}
                                  _disabled={{
                                    opacity: 0.5,
                                    cursor: "not-allowed",
                                  }}
                                  leftIcon={<PiCookingPot size={22} />}
                                >

                                  {t("cookerOrders.drawer.markPreparing")}
                                </Button>
                              )}

                              {!canClickConfirm && (
                                <Button
                                  size="lg"
                                  rounded="xl"
                                  bg={
                                    isReadyForPickup ? "gray.500" : "green.500"
                                  }
                                  color={
                                    isReadyForPickup
                                      ? "white"
                                      : colorMode === "light"
                                      ? colors.light.textMain
                                      : colors.dark.textMain
                                  }
                                  border={
                                    isReadyForPickup
                                      ? "none"
                                      : `2px solid transparent`
                                  }
                                  onClick={() =>
                                    handleStatusUpdate(
                                      selectedOrder,
                                      "ready_for_pickup"
                                    )
                                  }
                                  isDisabled={
                                    isUpdating || !canClickReadyForPickup
                                  }
                                  _hover={{
                                    bg: isReadyForPickup
                                      ? "gray.500"
                                      : "green.400",
                                  }}
                                  _disabled={{
                                    opacity: 0.5,
                                    cursor: "not-allowed",
                                  }}
                                  leftIcon={
                                    <MdOutlineDeliveryDining size={22} />
                                  }
                                >

                                  {t("cookerOrders.drawer.readyPickup")}
                                </Button>
                              )}

                              {canClickConfirm && (
                                <Button
                                  size="lg"
                                  rounded="xl"
                                  variant="outline"
                                  color="red"
                                  borderColor="red"
                                  onClick={() => {
                                    dialog.setOpen(true);
                                    setDeleteId(selectedOrder.id);
                                  }}
                                  isDisabled={isUpdating}
                                  leftIcon={<MdOutlineCancel size={22} />}
                                >

                                  {t("cookerOrders.drawer.cancelOrder")}
                                </Button>
                              )}
                            </VStack>
                          )}
                        </Box>
                      </VStack>
                    </Box>
                  );
                })()}
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>

      <CustomAlertDialog
        dialog={dialog}
        title={t("cookerOrders.cancelAlert.title")}
        description={t("cookerOrders.cancelAlert.desc")}
        cancelTxt={t("cookerOrders.cancelAlert.cancel")}
        okTxt={t("cookerOrders.cancelAlert.confirm")}
        onOkHandler={() => handleCancelOrder(deleteId)}
      />
    </>
  );
};

export default CookerOrders;
