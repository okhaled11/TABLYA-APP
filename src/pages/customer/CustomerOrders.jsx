import { Text } from "@chakra-ui/react";
import { Flex, Box } from "@chakra-ui/react";
import { Portal, Select, createListCollection } from "@chakra-ui/react";
const CustomerOrders = () => {
  /* --------------------------data------------------------- */
  const data = [
    {
      orderId: "ORD1001",
      items: [
        {
          name: "Margherita Pizza",
          quantity: 1,
          price: 50,
          image: "https://i.ibb.co/Tg9s6d3/margherita.jpg",
        },
        {
          name: "Coca-Cola",
          quantity: 2,
          price: 10,
          image: "https://i.ibb.co/8DxYc9M/coca-cola.jpg",
        },
      ],
      totalAmount: 70,
      orderStatus: "Order Placed",
      date: "29 / 10 / 2025 | 10:50 AM",
    },
    {
      orderId: "ORD1002",
      items: [
        {
          name: "Grilled Chicken Sandwich",
          quantity: 2,
          price: 45,
          image: "https://i.ibb.co/7R9q5nW/chicken-sandwich.jpg",
        },
        {
          name: "French Fries",
          quantity: 1,
          price: 25,
          image: "https://i.ibb.co/0rskc7m/fries.jpg",
        },
      ],
      totalAmount: 115,
      orderStatus: "Cooking",
      date: "29 / 10 / 2025 | 11:30 AM",
    },
    {
      orderId: "ORD1003",
      items: [
        {
          name: "Beef Burger",
          quantity: 1,
          price: 60,
          image: "https://i.ibb.co/F3bCNHc/beef-burger.jpg",
        },
        {
          name: "Onion Rings",
          quantity: 1,
          price: 20,
          image: "https://i.ibb.co/tpLdnFS/onion-rings.jpg",
        },
      ],
      totalAmount: 80,
      orderStatus: "Out for Delivery",
      date: "29 / 10 / 2025 | 12:10 PM",
    },
    {
      orderId: "ORD1004",
      items: [
        {
          name: "Chicken Alfredo Pasta",
          quantity: 1,
          price: 85,
          image: "https://i.ibb.co/q0jHfQZ/chicken-alfredo.jpg",
        },
        {
          name: "Garlic Bread",
          quantity: 1,
          price: 25,
          image: "https://i.ibb.co/FxzJwYm/garlic-bread.jpg",
        },
      ],
      totalAmount: 110,
      orderStatus: "Delivered",
      date: "29 / 10 / 2025 | 01:45 PM",
    },
    {
      orderId: "ORD1005",
      items: [
        {
          name: "Cheese Steak Sub",
          quantity: 1,
          price: 75,
          image: "https://i.ibb.co/4gvrHHj/cheese-steak.jpg",
        },
        {
          name: "Pepsi",
          quantity: 1,
          price: 10,
          image: "https://i.ibb.co/4VfWfHS/pepsi.jpg",
        },
      ],
      totalAmount: 85,
      orderStatus: "Cancelled",
      date: "29 / 10 / 2025 | 02:20 PM",
    },
  ];
  /* data menue */
  const frameworks = createListCollection({
    items: [
      { label: "Default", value: "Default" },
      { label: "Status", value: "Status" },
      { label: "Date", value: "Date" },
    ],
  });

  return (
    <>
      <Box>
        <Flex gap="4" direction={"column"} py={4}>
          {/* upper dev */}
          <Flex justify="space-between">
            {/* text ordered */}
            <Text fontSize={"40px"} fontWeight={"700"}>
              My Orders
            </Text>
            {/* menue */}
            <Select.Root collection={frameworks} size="sm" width="220px">
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger rounded={"xl"}>
                  <Select.ValueText placeholder="default" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
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

          <Box bg={"blue"}>card</Box>
          <Box bg={"blue"}>card</Box>
          <Box bg={"blue"}>card</Box>
        </Flex>
      </Box>
    </>
  );
};

export default CustomerOrders;
