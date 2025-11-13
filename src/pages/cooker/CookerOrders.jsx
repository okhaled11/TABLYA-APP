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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
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
import srcLoadingImg from "../../assets/Transparent Version.gif";
import CustomAlertDialog from "../../shared/CustomAlertDailog";

const CookerOrders = () => {
  /* ---------------variable----------------- */
  const colors = useColorStyles();
  /* ---------------state----------------- */
  const [value, setValue] = useState([]);
  const [deleteId, setDeleteId] = useState([]);
  const [allOrder, setAllOrder] = useState([]);
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
  }, [orders, selectedStatus]);

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
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
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
        <Flex my={4} justifyContent={"space-between"}>
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

        {/* content order */}
        {isLoading && (
          <Image
            boxSize={40}
            mx={"auto"}
            rounded="md"
            src={srcLoadingImg}
            alt="John Doe"
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
          allOrder.map((order) => {
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
                rounded={"56px"}
                p={6}
                my={6}
              >
                {/* date and total */}
                <Flex
                  justifyContent={"space-between"}
                  direction={{ base: "column", md: "row" }}
                  textAlign={"center"}
                  my={6}
                >
                  <Text
                    color={colors.textSub}
                    fontSize={{ base: "15px" }}
                    fontWeight={"bold"}
                  >
                    {formattedDate} | {formattedTime} | #{order.id.slice(0, 8)}
                  </Text>
                  <Text
                    color={colors.textMain}
                    fontSize={"30px"}
                    fontWeight={"bold"}
                  >
                    Total: {order.total?.toFixed(2) || "0.00"} LE
                  </Text>
                </Flex>
                {/* order item and customer details */}
                <Flex
                  justifyContent={"space-between"}
                  direction={{ base: "column", md: "row" }}
                  gap={6}
                >
                  {/* order item  */}
                  <Box
                    bg={colors.bgFourth}
                    w={{ base: "100%", md: "50%" }}
                    rounded={"26px"}
                    p={6}
                  >
                    <Heading
                      as={"h2"}
                      fontSize={{ base: "25px", md: "28px" }}
                      fontWeight={600}
                      mb={6}
                    >
                      Order Items
                    </Heading>
                    {order.order_items && order.order_items.length > 0 ? (
                      order.order_items.map((item, index) => (
                        <Text key={index} my={2} color={colors.textSub}>
                          {item.quantity}x {item.title}
                        </Text>
                      ))
                    ) : (
                      <Text color={colors.textSub}>No items</Text>
                    )}
                    {/* notes */}

                    {order.notes ? (
                      <Box>
                        {" "}
                        <Heading
                          as={"h2"}
                          fontSize={{ base: "25px", md: "28px" }}
                          fontWeight={600}
                          mb={2}
                        >
                          notes
                        </Heading>
                        <Text my={2} color={colors.textSub}>
                          {order.notes}
                        </Text>
                      </Box>
                    ) : null}
                  </Box>
                  {/* customer details   */}
                  <Box
                    bg={colors.info10a}
                    w={{ base: "100%", md: "40%" }}
                    rounded={"26px"}
                    p={6}
                  >
                    <Heading
                      as={"h2"}
                      fontSize={{ base: "25px", lg: "28px" }}
                      fontWeight={600}
                      mb={6}
                      color={colors.textMain}
                    >
                      Customer Details
                    </Heading>

                    {order.customer ? (
                      <>
                        <Flex
                          my={3}
                          color={colors.textSub}
                          alignItems={"center"}
                          gap={3}
                        >
                          <IoPerson size={20} color={colors.info} />
                          <Text fontSize={{ base: "16px", md: "18px" }}>
                            {order.customer.name || "No name"}
                          </Text>
                        </Flex>
                        <Flex
                          my={3}
                          color={colors.textSub}
                          alignItems={"center"}
                          gap={3}
                        >
                          <FaLocationDot size={28} color={colors.info} />
                          <Text fontSize={{ base: "16px", md: "18px" }}>
                            {order.address || "No address"}
                          </Text>
                        </Flex>
                        <Flex
                          my={3}
                          color={colors.textSub}
                          alignItems={"center"}
                          gap={3}
                        >
                          <FaPhone size={20} color={colors.info} />
                          <Text fontSize={{ base: "16px", md: "18px" }}>
                            {order.customer.phone || "No phone"}
                          </Text>
                        </Flex>
                      </>
                    ) : (
                      <Text color={colors.textSub}>
                        No customer information
                      </Text>
                    )}

                    <Heading
                      as={"h2"}
                      fontSize={{ base: "25px", lg: "28px" }}
                      fontWeight={600}
                      my={6}
                    >
                      Payment Method
                    </Heading>
                    <Flex my={2} color={colors.textSub} alignItems={"center"}>
                      <BsFillCreditCardFill color={colors.info} />
                      <Text mx={2}>
                        {order.payment_method || "Not specified"}
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
                {/* buttons */}
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justifyContent={"space-between"}
                  my={8}
                  gap={3}
                >
                  <Flex gap={4} direction={{ base: "column", md: "row" }}>
                    <Button
                      variant="outline"
                      rounded={"20px"}
                      bg={
                        order.status === "confirmed"
                          ? colors.mainFixed
                          : colors.bgFourth
                      }
                      color={
                        order.status === "confirmed" ? "white" : colors.textSub
                      }
                      p={6}
                      onClick={() => handleStatusUpdate(order.id, "confirmed")}
                      isDisabled={isUpdating || order.status === "confirmed"}
                      _hover={{
                        bg:
                          order.status === "confirmed"
                            ? colors.mainFixed
                            : colors.bgThird,
                      }}
                    >
                      <MdOutlineDoneOutline /> Confirmed
                    </Button>
                    <Button
                      variant="outline"
                      rounded={"20px"}
                      bg={
                        order.status === "preparing"
                          ? colors.mainFixed
                          : colors.bgFourth
                      }
                      color={
                        order.status === "preparing" ? "white" : colors.textSub
                      }
                      p={6}
                      onClick={() => handleStatusUpdate(order.id, "preparing")}
                      isDisabled={isUpdating || order.status === "preparing"}
                      _hover={{
                        bg:
                          order.status === "preparing"
                            ? colors.mainFixed
                            : colors.bgThird,
                      }}
                    >
                      <PiCookingPot />
                      Preparing
                    </Button>
                    <Button
                      variant="outline"
                      rounded={"20px"}
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
                      p={6}
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
                    >
                      <MdOutlineDeliveryDining /> Out for Delivery
                    </Button>
                  </Flex>
                  <Button
                    variant="outline"
                    rounded={"20px"}
                    bg={colors.bgThird}
                    color={colors.mainFixed}
                    p={6}
                    onClick={() => {
                      dialog.setOpen(true);
                      setDeleteId(order.id);
                    }}
                    isDisabled={isDeleting}
                    _hover={{ bg: colors.bgFourth }}
                  >
                    <MdOutlineCancel /> Cancel Order
                  </Button>
                </Flex>
              </Box>
            );
          })}
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
