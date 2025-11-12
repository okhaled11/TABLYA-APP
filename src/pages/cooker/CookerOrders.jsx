import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Portal, Select, createListCollection } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useColorStyles } from "../../hooks/useColorStyles";
import { 
  useGetCookerOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation 
} from "../../app/features/Cooker/CookerAcceptOrder";
import { IoPerson } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { BsFillCreditCardFill } from "react-icons/bs";
import { Button, Group } from "@chakra-ui/react";
import { MdOutlineDoneOutline } from "react-icons/md";
import { PiCookingPot } from "react-icons/pi";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";

const CookerOrders = () => {
  /* ---------------variable----------------- */
  const colors = useColorStyles();

  /* ---------------Redux Query----------------- */
  const { data: orders, isLoading, error } = useGetCookerOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  console.log(orders);

  /* ---------------state----------------- */
  const [value, setValue] = useState([]);

  /* ---------------useEffect----------------- */
  useEffect(() => {
    if (orders) {
      console.log("Cooker Orders Data:", orders);
    }
    if (error) {
      console.error("Error fetching orders:", error);
    }
  }, [orders, error]);

  /* ---------------HANDLER----------------- */
  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus({ orderId, status }).unwrap();
      console.log(`Order ${orderId} status updated to ${status}`);
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await deleteOrder(orderId).unwrap();
        console.log(`Order ${orderId} deleted successfully`);
      } catch (err) {
        console.error("Failed to delete order:", err);
      }
    }
  };
  const frameworks = createListCollection({
    items: [
      { label: "Status", value: "Status" },
      { label: "Date", value: "Date" },
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
          <Text color={colors.textSub} textAlign="center" my={6}>
            Loading orders...
          </Text>
        )}

        {error && (
          <Text color="red.500" textAlign="center" my={6}>
            Error: {error.message || "Failed to load orders"}
          </Text>
        )}

        {!isLoading && !error && orders && orders.length === 0 && (
          <Text color={colors.textSub} textAlign="center" my={6}>
            No orders found
          </Text>
        )}

        {!isLoading &&
          !error &&
          orders &&
          orders.map((order) => {
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
                          {item.notes && (
                            <Text as="span" fontSize="sm" ml={2}>
                              ({item.notes})
                            </Text>
                          )}
                        </Text>
                      ))
                    ) : (
                      <Text color={colors.textSub}>No items</Text>
                    )}
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
                        <Flex my={3} color={colors.textSub} alignItems={"center"} gap={3}>
                          <IoPerson size={20} color={colors.info} />
                          <Text fontSize={{ base: "16px", md: "18px" }}>
                            {order.customer.name || "No name"}
                          </Text>
                        </Flex>
                        <Flex my={3} color={colors.textSub} alignItems={"center"} gap={3}>
                          <FaLocationDot size={20} color={colors.info} />
                          <Text fontSize={{ base: "16px", md: "18px" }}>
                            {order.address || "No address"}
                            {order.city && `, ${order.city}`}
                          </Text>
                        </Flex>
                        <Flex my={3} color={colors.textSub} alignItems={"center"} gap={3}>
                          <FaPhone size={20} color={colors.info} />
                          <Text fontSize={{ base: "16px", md: "18px" }}>
                            {order.customer.phone || "No phone"}
                          </Text>
                        </Flex>
                      </>
                    ) : (
                      <Text color={colors.textSub}>No customer information</Text>
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
                        order.status === "confirmed"
                          ? "white"
                          : colors.textSub
                      }
                      p={6}
                      onClick={() => handleStatusUpdate(order.id, "confirmed")}
                      isDisabled={isUpdating || order.status === "confirmed"}
                      _hover={{
                        bg: order.status === "confirmed" ? colors.mainFixed : colors.bgThird
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
                        order.status === "preparing"
                          ? "white"
                          : colors.textSub
                      }
                      p={6}
                      onClick={() => handleStatusUpdate(order.id, "preparing")}
                      isDisabled={isUpdating || order.status === "preparing"}
                      _hover={{
                        bg: order.status === "preparing" ? colors.mainFixed : colors.bgThird
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
                      onClick={() => handleStatusUpdate(order.id, "out_for_delivery")}
                      isDisabled={isUpdating || order.status === "out_for_delivery"}
                      _hover={{
                        bg: order.status === "out_for_delivery" ? colors.mainFixed : colors.bgThird
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
                    onClick={() => handleDeleteOrder(order.id)}
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
    </>
  );
};

export default CookerOrders;
