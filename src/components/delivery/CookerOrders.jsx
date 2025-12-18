import React, { useState, useMemo, useEffect } from "react";
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
  Portal,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import testColor from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import { IoPerson } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { BsFillCreditCardFill } from "react-icons/bs";
import srcLoadingImg from "../../assets/Transparent Version.gif";
import {
  useGetOrdersForDeliveryCityQuery,
  useUpdateOrderStatusMutation,
} from "../../app/features/delivery/deleveryOrder";
import { useColorStyles } from "../../hooks/useColorStyles";
import CustomAlertDialog from "../../shared/CustomAlertDailog";
import { IoMdClose } from "react-icons/io";

const ORDERS_PER_PAGE = 2;

const DeliveryOrders = () => {
  const colors = useColorStyles();
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const { data: orders, isLoading } = useGetOrdersForDeliveryCityQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();
  const [hiddenOrderIds, setHiddenOrderIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dialog = useDialog();
  const [deleteId, setDeleteId] = useState(null);
  console.log(orders);

  // Filter out hidden orders
  const visibleOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => !hiddenOrderIds.includes(order.id));
  }, [orders, hiddenOrderIds]);

  // Pagination logic
  const { paginatedOrders, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    const endIndex = startIndex + ORDERS_PER_PAGE;
    const paginated = visibleOrders.slice(startIndex, endIndex);
    const pages = Math.ceil(visibleOrders.length / ORDERS_PER_PAGE);

    return {
      paginatedOrders: paginated,
      totalPages: pages,
    };
  }, [visibleOrders, currentPage]);

  // Reset to page 1 when orders change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleStatusUpdate = async (orderId, status) => {
    await updateStatus({ orderId, status });
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
      <Heading
        size="lg"
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="bold"
        my={4}
        color={
          colorMode === "light"
            ? testColor.light.textMain
            : testColor.dark.textMain
        }
      >
        Orders
      </Heading>

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
          {!isLoading && visibleOrders.length > 0 && (
            <Text color={colors.textSub} fontSize="sm" mb={4}>
              Showing {(currentPage - 1) * ORDERS_PER_PAGE + 1} -{" "}
              {Math.min(currentPage * ORDERS_PER_PAGE, visibleOrders.length)} of{" "}
              {visibleOrders.length} orders
            </Text>
          )}

          {!orders || visibleOrders.length === 0 ? (
            <Text
              color={colors.textSub}
              fontSize={{ base: "14px", md: "15px" }}
            >
              No orders available in your city
            </Text>
          ) : (
            paginatedOrders.map((order) => {
              const dt = new Date(order.created_at);
              const formattedDate = dt.toLocaleDateString();
              const formattedTime = dt.toLocaleTimeString();

              return (
                <Box
                  key={order.id}
                  bg={colors.bgThird}
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
                    borderBottom={`1px solid ${colors.bgFourth}`}
                  >
                    <Text
                      color={colors.textSub}
                      fontSize={{ base: "13px", md: "14px" }}
                      fontWeight="medium"
                    >
                      {formattedDate} | {formattedTime} | #
                      {order.id.slice(0, 8)}
                    </Text>
                    <Text
                      color={colors.mainFixed}
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
                      bg={colors.bgFourth}
                      rounded="20px"
                      p={{ base: 4, md: 5 }}
                    >
                      <Heading
                        as="h3"
                        fontSize={{ base: "16px", md: "18px" }}
                        fontWeight={600}
                        mb={3}
                        color={colors.textMain}
                        textAlign={"left"}
                      >
                        Order Items
                      </Heading>
                      <Box maxH="120px" overflowY="auto " textAlign={"left"}>
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
                      {order.notes && (
                        <Box
                          mt={3}
                          pt={3}
                          borderTop={`1px solid ${colors.bgThird}`}
                        >
                          <Heading
                            as="h4"
                            fontSize={{ base: "14px", md: "16px" }}
                            fontWeight={600}
                            mb={1}
                            color={colors.textMain}
                            textAlign={"left"}
                          >
                            Notes
                          </Heading>
                          <Text
                            color={colors.textSub}
                            fontSize="13px"
                            noOfLines={2}
                            textAlign={"left"}
                          >
                            {order.notes}
                          </Text>
                        </Box>
                      )}
                    </Box>

                    <Box
                      bg={colors.info10a}
                      rounded="20px"
                      p={{ base: 4, md: 5 }}
                    >
                      <Heading
                        as="h3"
                        fontSize={{ base: "16px", md: "18px" }}
                        fontWeight={600}
                        mb={3}
                        color={colors.textMain}
                        textAlign={"left"}
                      >
                        Customer Details
                      </Heading>
                      {order.customer ? (
                        <Box>
                          <Flex
                            mb={2}
                            color={colors.textSub}
                            alignItems="center"
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
                            alignItems="flex-start"
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
                            alignItems="center"
                            gap={2}
                          >
                            <FaPhone size={14} color={colors.info} />
                            <Text fontSize={{ base: "14px", md: "15px" }}>
                              {order.customer.phone || "No phone"}
                            </Text>
                          </Flex>
                          <Box pt={2} borderTop={`1px solid ${colors.bgThird}`}>
                            <Text
                              fontSize={{ base: "13px", md: "14px" }}
                              fontWeight={600}
                              mb={1}
                              color={colors.textMain}
                              textAlign={"left"}
                            >
                              Payment
                            </Text>
                            <Flex alignItems="center" gap={1.5}>
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
                        variant="outline"
                        rounded="16px"
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
                        onClick={() => {
                          const newStatus =
                            order.status === "out_for_delivery"
                              ? "ready_for_pickup"
                              : "out_for_delivery";
                          handleStatusUpdate(order.id, newStatus);
                        }}
                        isDisabled={isUpdating || order.status === "delivered"}
                        _hover={{
                          bg:
                            order.status === "out_for_delivery"
                              ? colors.mainFixed
                              : colors.bgThird,
                        }}
                        flex={1}
                      >
                        <svg
                          width="26"
                          height="22"
                          viewBox="0 0 26 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M24.7 15.7667C24.5393 15.6477 24.3438 15.5833 24.1429 15.5833H23.2143V3.66667C23.2143 2.69421 22.823 1.76157 22.1264 1.07394C21.4298 0.386308 20.4851 0 19.5 0H3.71429C2.7292 0 1.78445 0.386308 1.08789 1.07394C0.391325 1.76157 0 2.69421 0 3.66667C0 5.22615 1.16652 6.13479 1.3 6.23333C1.46029 6.35317 1.65608 6.41759 1.85714 6.41667C2.05067 6.41614 2.2392 6.35594 2.39637 6.24448C2.55355 6.13301 2.67152 5.97585 2.73379 5.79496C2.79606 5.61407 2.79952 5.4185 2.7437 5.23557C2.68787 5.05265 2.57554 4.89151 2.42241 4.77469C2.41777 4.76896 1.85714 4.32438 1.85714 3.66667C1.85714 3.18044 2.05281 2.71412 2.40109 2.3703C2.74937 2.02649 3.22174 1.83333 3.71429 1.83333C4.20683 1.83333 4.6792 2.02649 5.02748 2.3703C5.37577 2.71412 5.57143 3.18044 5.57143 3.66667V18.3333C5.57143 19.3058 5.96275 20.2384 6.65932 20.9261C7.35588 21.6137 8.30062 22 9.28571 22H22.2857C23.2708 22 24.2155 21.6137 24.9121 20.9261C25.6087 20.2384 26 19.3058 26 18.3333C26 16.7739 24.8393 15.8652 24.7 15.7667ZM11.1429 7.33333H18.5714C18.8177 7.33333 19.0539 7.42991 19.228 7.60182C19.4022 7.77373 19.5 8.00688 19.5 8.25C19.5 8.49312 19.4022 8.72627 19.228 8.89818C19.0539 9.07009 18.8177 9.16667 18.5714 9.16667H11.1429C10.8966 9.16667 10.6604 9.07009 10.4863 8.89818C10.3121 8.72627 10.2143 8.49312 10.2143 8.25C10.2143 8.00688 10.3121 7.77373 10.4863 7.60182C10.6604 7.42991 10.8966 7.33333 11.1429 7.33333ZM10.2143 11.9167C10.2143 11.6736 10.3121 11.4404 10.4863 11.2685C10.6604 11.0966 10.8966 11 11.1429 11H18.5714C18.8177 11 19.0539 11.0966 19.228 11.2685C19.4022 11.4404 19.5 11.6736 19.5 11.9167C19.5 12.1598 19.4022 12.3929 19.228 12.5648C19.0539 12.7368 18.8177 12.8333 18.5714 12.8333H11.1429C10.8966 12.8333 10.6604 12.7368 10.4863 12.5648C10.3121 12.3929 10.2143 12.1598 10.2143 11.9167ZM22.2857 20.1667H11.5735C11.9005 19.6097 12.0723 18.9771 12.0714 18.3333C12.0717 18.0225 12.0243 17.7135 11.931 17.4167H23.7703C24.0008 17.669 24.1336 17.9937 24.1452 18.3333C24.1452 18.5743 24.0971 18.8129 24.0036 19.0354C23.9101 19.258 23.7731 19.4602 23.6004 19.6305C23.4277 19.8008 23.2227 19.9358 22.9971 20.0278C22.7715 20.1198 22.5298 20.167 22.2857 20.1667Z"
                            fill="#FFF7F0"
                          />
                        </svg>

                        <Box as="span" ml={1}>
                          Receive Order
                        </Box>
                      </Button>

                      <Button
                        size={{ base: "sm", md: "md" }}
                        variant="outline"
                        rounded="16px"
                        bg={
                          order.status === "Open In Map"
                            ? colors.mainFixed
                            : colors.bgFourth
                        }
                        color={
                          order.status === "Open In Map"
                            ? "white"
                            : colors.textSub
                        }
                        fontSize={{ base: "13px", md: "14px" }}
                        // onClick={() =>
                        //   // navigate page  ya omer to map
                        // }
                        isDisabled={
                          isUpdating || order.status === "Open In Map"
                        }
                        _hover={{
                          bg:
                            order.status === "Open In Map"
                              ? colors.mainFixed
                              : colors.bgThird,
                        }}
                        flex={1}
                      >
                        <svg
                          width="22"
                          height="16"
                          viewBox="0 0 22 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21.6256 2.15755L8.09115 15.6286C7.97327 15.7463 7.8332 15.8397 7.67896 15.9034C7.52473 15.9672 7.35938 16 7.19238 16C7.02538 16 6.86002 15.9672 6.70579 15.9034C6.55156 15.8397 6.41149 15.7463 6.29361 15.6286L0.372284 9.73499C0.254255 9.61751 0.16063 9.47805 0.0967533 9.32456C0.0328768 9.17107 1.75876e-09 9.00657 0 8.84043C-1.75876e-09 8.6743 0.0328768 8.50979 0.0967533 8.3563C0.16063 8.20281 0.254255 8.06335 0.372284 7.94587C0.490312 7.8284 0.630432 7.73521 0.784644 7.67163C0.938855 7.60806 1.10414 7.57533 1.27106 7.57533C1.43797 7.57533 1.60326 7.60806 1.75747 7.67163C1.91168 7.73521 2.0518 7.8284 2.16983 7.94587L7.19344 12.9459L19.8302 0.370538C20.0685 0.133286 20.3918 0 20.7289 0C21.066 0 21.3893 0.133286 21.6277 0.370538C21.8661 0.60779 22 0.929572 22 1.2651C22 1.60062 21.8661 1.9224 21.6277 2.15966L21.6256 2.15755Z"
                            fill="#FFF7F0"
                          />
                        </svg>

                        <Box as="span" ml={1}>
                          Open In Map
                        </Box>
                      </Button>

                      <Button
                        size={{ base: "sm", md: "md" }}
                        variant="outline"
                        rounded="16px"
                        bg={
                          order.status === "delivered"
                            ? colors.mainFixed
                            : colors.bgFourth
                        }
                        color={
                          order.status === "delivered"
                            ? "white"
                            : colors.textSub
                        }
                        fontSize={{ base: "13px", md: "14px" }}
                        onClick={() =>
                          handleStatusUpdate(order.id, "delivered")
                        }
                        isDisabled={isUpdating || order.status === "delivered"}
                        _hover={{
                          bg:
                            order.status === "delivered"
                              ? colors.mainFixed
                              : colors.bgThird,
                        }}
                        flex={1}
                      >
                        <svg
                          width="17"
                          height="22"
                          viewBox="0 0 17 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.5 0C6.24644 0.0025995 4.08592 0.914028 2.49242 2.53433C0.89891 4.15463 0.0025565 6.35149 0 8.64294C0 16.0386 7.72727 21.6241 8.05665 21.8578C8.18657 21.9504 8.34136 22 8.5 22C8.65863 22 8.81343 21.9504 8.94335 21.8578C9.27273 21.6241 17 16.0386 17 8.64294C16.9974 6.35149 16.1011 4.15463 14.5076 2.53433C12.9141 0.914028 10.7536 0.0025995 8.5 0ZM8.5 5.50005C9.11132 5.50005 9.70892 5.68438 10.2172 6.02973C10.7255 6.37507 11.1217 6.86592 11.3556 7.44021C11.5896 8.0145 11.6508 8.64643 11.5315 9.25609C11.4123 9.86575 11.1179 10.4258 10.6856 10.8653C10.2533 11.3048 9.70258 11.6042 9.10301 11.7254C8.50343 11.8467 7.88195 11.7845 7.31716 11.5466C6.75237 11.3087 6.26964 10.9059 5.93 10.389C5.59037 9.87219 5.40909 9.26455 5.40909 8.64294C5.40909 7.8094 5.73474 7.00999 6.3144 6.42059C6.89405 5.83118 7.68024 5.50005 8.5 5.50005Z"
                            fill="#FA2C23"
                          />
                        </svg>

                        <Box as="span" ml={1}>
                          Mark Complete
                        </Box>
                      </Button>

                      <Button
                        size={{ base: "sm", md: "md" }}
                        variant="outline"
                        rounded="16px"
                        bg={
                          order.status === "Unable to Deliver"
                            ? colors.mainFixed
                            : colors.bgFourth
                        }
                        border={"1px solid #FA2C23"}
                        color={"#FA2C23"}
                        fontSize={{ base: "13px", md: "14px" }}
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
                              : colors.bgThird,
                        }}
                        flex={1}
                      >
                        <IoMdClose />
                        <Box as="span" ml={1}>
                          Unable to Deliver
                        </Box>
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              );
            })
          )}

          {/* Pagination */}
          {!isLoading && visibleOrders.length > ORDERS_PER_PAGE && (
            <Flex justifyContent="center" mt={8} mb={4}>
              <Pagination.Root
                count={visibleOrders.length}
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
      )}

      <CustomAlertDialog
        dialog={dialog}
        title={"Are you sure you don't want this order?"}
        description={
          "This order will be removed from your view. It will not be deleted from the system."
        }
        cancelTxt={"No, go back"}
        okTxt={"Yes, remove it"}
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
