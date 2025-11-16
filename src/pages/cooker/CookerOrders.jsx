import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  Portal,
  Select,
  createListCollection,
  Button,
  Group,
  useDialog,
  Grid,
  Pagination,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { useColorStyles } from "../../hooks/useColorStyles";
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
  const colors = useColorStyles();

  /* ---------------state----------------- */
  const [value, setValue] = useState([]);
  const [deleteId, setDeleteId] = useState([]);
  const [allOrder, setAllOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dialog = useDialog();

  /* ---------------Redux Query----------------- */
  const { data: orders, isLoading, error } = useGetCookerOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const selectedStatus = Array.isArray(value)
    ? value[value.length - 1] ?? "Default"
    : value || "Default";

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
  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus({ orderId, status }).unwrap();
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

  const frameworks = createListCollection({
    items: [
      { label: "Default", value: "Default" },
      { label: "confirmed", value: "confirmed" },
      { label: "preparing", value: "preparing" },
      { label: "out_for_delivery", value: "out_for_delivery" },
    ],
  });

  return (
    <>
      <Box py={6}>
        {/* name order and select */}
        <Flex my={4} justifyContent={"space-between"} alignItems="center">
          {/* order */}
          <Heading
            fontSize={{ base: "25px", lg: "45px" }}
            fontWeight={700}
            mb={4}
          >
            Orders
          </Heading>

          {/* select menu */}
          <Select.Root
            collection={frameworks}
            width={{ base: "140px", md: "260px" }}
            value={value}
            onValueChange={(e) => setValue(e.value)}
            rounded={"2xl"}
            bg={colors.bgFixed}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger border="none" outline="none">
                <Select.ValueText placeholder="Default" color={"white"} />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content
                  bg={colors.bgFixed}
                  color={"white"}
                  rounded={"2xl"}
                >
                  {frameworks.items.map((framework) => (
                    <Select.Item item={framework} key={framework.value}>
                      {framework.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Flex>

        {/* Orders count */}
        {!isLoading && !error && allOrder.length > 0 && (
          <Text color={colors.textSub} fontSize="sm" mb={4}>
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
          <Text color={colors.textSub} textAlign="center" my={6}>
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

            return (
              <Box
                key={order.id}
                bg={colors.bgThird}
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
                  borderBottom={`1px solid ${colors.bgFourth}`}
                >
                  <Text
                    color={colors.textSub}
                    fontSize={{ base: "13px", md: "14px" }}
                    fontWeight={"medium"}
                  >
                    {formattedDate} | {formattedTime} | #{order.id.slice(0, 8)}
                  </Text>
                  <Text
                    color={colors.mainFixed}
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
                    bg={colors.bgFourth}
                    rounded={"20px"}
                    p={{ base: 4, md: 5 }}
                  >
                    <Heading
                      as={"h3"}
                      fontSize={{ base: "16px", md: "18px" }}
                      fontWeight={600}
                      mb={3}
                      color={colors.textMain}
                    >
                      Order Items
                    </Heading>
                    <Box maxH="120px" overflowY="auto">
                      {order.order_items && order.order_items.length > 0 ? (
                        order.order_items.map((item, index) => (
                          <Text
                            key={index}
                            mb={1.5}
                            color={colors.textSub}
                            fontSize={{ base: "14px", md: "15px" }}
                          >
                            {item.quantity}x {item.title}
                          </Text>
                        ))
                      ) : (
                        <Text color={colors.textSub} fontSize="14px">
                          No items
                        </Text>
                      )}
                    </Box>

                    {/* Notes */}
                    {order.notes && (
                      <Box
                        mt={3}
                        pt={3}
                        borderTop={`1px solid ${colors.bgThird}`}
                      >
                        <Heading
                          as={"h4"}
                          fontSize={{ base: "14px", md: "16px" }}
                          fontWeight={600}
                          mb={1}
                          color={colors.textMain}
                        >
                          Notes
                        </Heading>
                        <Text
                          color={colors.textSub}
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
                    bg={colors.info10a}
                    rounded={"20px"}
                    p={{ base: 4, md: 5 }}
                  >
                    <Heading
                      as={"h3"}
                      fontSize={{ base: "16px", md: "18px" }}
                      fontWeight={600}
                      mb={3}
                      color={colors.textMain}
                    >
                      Customer Details
                    </Heading>

                    {order.customer ? (
                      <Box>
                        <Flex
                          mb={2}
                          color={colors.textSub}
                          alignItems={"center"}
                          gap={2}
                        >
                          <IoPerson size={16} color={colors.info} />
                          <Text
                            fontSize={{ base: "14px", md: "15px" }}
                            noOfLines={1}
                          >
                            {order.customer.name || "No name"}
                          </Text>
                        </Flex>
                        <Flex
                          mb={2}
                          color={colors.textSub}
                          alignItems={"flex-start"}
                          gap={2}
                        >
                          <Box mt={0.5}>
                            <FaLocationDot size={16} color={colors.info} />
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
                          color={colors.textSub}
                          alignItems={"center"}
                          gap={2}
                        >
                          <FaPhone size={14} color={colors.info} />
                          <Text fontSize={{ base: "14px", md: "15px" }}>
                            {order.customer.phone || "No phone"}
                          </Text>
                        </Flex>

                        {/* Payment Method */}
                        <Box pt={2} borderTop={`1px solid ${colors.bgThird}`}>
                          <Text
                            fontSize={{ base: "13px", md: "14px" }}
                            fontWeight={600}
                            mb={1}
                            color={colors.textMain}
                          >
                            Payment
                          </Text>
                          <Flex alignItems={"center"} gap={1.5}>
                            <BsFillCreditCardFill
                              size={14}
                              color={colors.info}
                            />
                            <Text fontSize="13px" color={colors.textSub}>
                              {order.payment_method || "Not specified"}
                            </Text>
                          </Flex>
                        </Box>
                      </Box>
                    ) : (
                      <Text color={colors.textSub} fontSize="14px">
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
                      rounded={"16px"}
                      bg={
                        order.status === "confirmed"
                          ? colors.mainFixed
                          : colors.bgFourth
                      }
                      color={
                        order.status === "confirmed" ? "white" : colors.textSub
                      }
                      fontSize={{ base: "13px", md: "14px" }}
                      onClick={() => handleStatusUpdate(order.id, "confirmed")}
                      isDisabled={isUpdating || order.status === "confirmed"}
                      _hover={{
                        bg:
                          order.status === "confirmed"
                            ? colors.mainFixed
                            : colors.bgThird,
                      }}
                      flex={1}
                    >
                      <MdOutlineDoneOutline size={16} />
                      <Box as="span" ml={1}>
                        Confirmed
                      </Box>
                    </Button>
                    <Button
                      size={{ base: "sm", md: "md" }}
                      variant="outline"
                      rounded={"16px"}
                      bg={
                        order.status === "preparing"
                          ? colors.mainFixed
                          : colors.bgFourth
                      }
                      color={
                        order.status === "preparing" ? "white" : colors.textSub
                      }
                      fontSize={{ base: "13px", md: "14px" }}
                      onClick={() => handleStatusUpdate(order.id, "preparing")}
                      isDisabled={isUpdating || order.status === "preparing"}
                      _hover={{
                        bg:
                          order.status === "preparing"
                            ? colors.mainFixed
                            : colors.bgThird,
                      }}
                      flex={1}
                    >
                      <PiCookingPot size={16} />
                      <Box as="span" ml={1}>
                        Preparing
                      </Box>
                    </Button>
                    <Button
                      size={{ base: "sm", md: "md" }}
                      variant="outline"
                      rounded={"16px"}
                      bg={
                        order.status === "out_for_delivery"
                          ? colors.mainFixed
                          : colors.bgFourth
                      }
                      color={
                        order.status === "out_for_delivery"
                          ? "white"
                          : colors.textSub
                      }
                      fontSize={{ base: "13px", md: "14px" }}
                      onClick={() =>
                        handleStatusUpdate(order.id, "out_for_delivery")
                      }
                      isDisabled={
                        isUpdating || order.status === "out_for_delivery"
                      }
                      _hover={{
                        bg:
                          order.status === "out_for_delivery"
                            ? colors.mainFixed
                            : colors.bgThird,
                      }}
                      flex={1}
                    >
                      <MdOutlineDeliveryDining size={16} />
                      <Box
                        as="span"
                        ml={1}
                        display={{ base: "none", sm: "inline" }}
                      >
                        Out for Delivery
                      </Box>
                      <Box
                        as="span"
                        ml={1}
                        display={{ base: "inline", sm: "none" }}
                      >
                        Delivery
                      </Box>
                    </Button>
                  </Flex>
                  <Button
                    size={{ base: "sm", md: "md" }}
                    variant="outline"
                    rounded={"16px"}
                    bg={colors.bgThird}
                    color={colors.mainFixed}
                    fontSize={{ base: "13px", md: "14px" }}
                    onClick={() => {
                      dialog.setOpen(true);
                      setDeleteId(order.id);
                    }}
                    isDisabled={isDeleting}
                    _hover={{ bg: colors.bgFourth }}
                    w={{ base: "100%", md: "auto" }}
                  >
                    <MdOutlineCancel size={16} />
                    <Box as="span" ml={1}>
                      Cancel
                    </Box>
                  </Button>
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
                    bg={colors.bgThird}
                    color={colors.textSub}
                    _hover={{ bg: colors.bgFourth }}
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
                          ? colors.mainFixed
                          : colors.bgThird
                      }
                      color={
                        page.type === "page" && page.value === currentPage
                          ? "white"
                          : colors.textSub
                      }
                      _hover={{
                        bg:
                          page.type === "page" && page.value === currentPage
                            ? colors.mainFixed
                            : colors.bgFourth,
                      }}
                    >
                      {page.value}
                    </IconButton>
                  )}
                />

                <Pagination.NextTrigger asChild>
                  <IconButton
                    bg={colors.bgThird}
                    color={colors.textSub}
                    _hover={{ bg: colors.bgFourth }}
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
