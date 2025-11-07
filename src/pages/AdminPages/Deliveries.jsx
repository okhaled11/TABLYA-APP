import {
  Badge,
  Box,
  Flex,
  Stack,
  Table,
  Button,
  Pagination,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { useGetOrdersQuery } from "../../app/features/Admin/ordersApi";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { FiPackage } from "react-icons/fi";
import { FiTruck } from "react-icons/fi";
import { FaRegCheckCircle } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";
import { useState } from "react";
function Deliveries() {
  const { data: orders, isLoading } = useGetOrdersQuery();
  console.log(orders);
 
  const ordersData = [
    {
      id: "1",
      orderNumber: "#ORD-2401",
      restaurant: "Maria's Kitchen",
      customer: "John Doe",
      items: 3,
      total: "$45.99",
      status: "Delivered",
      deliveryPartner: "Mike Ross",
      orderDate: "2024-01-20",
    },
    {
      id: "2",
      orderNumber: "#ORD-2402",
      restaurant: "Spice Haven",
      customer: "Sarah Chen",
      items: 2,
      total: "$32.50",
      status: "In Transit",
      deliveryPartner: "Mike Ross",
      orderDate: "2024-01-20",
    },
    {
      id: "3",
      orderNumber: "#ORD-2403",
      restaurant: "Tokyo Delights",
      customer: "Emily White",
      items: 5,
      total: "$78.20",
      status: "Pending",
      deliveryPartner: "Unassigned",
      orderDate: "2024-01-20",
    },
    {
      id: "4",
      orderNumber: "#ORD-2404",
      restaurant: "Pasta Palace",
      customer: "Carlos Rivera",
      items: 4,
      total: "$56.75",
      status: "Delivered",
      deliveryPartner: "Lisa Park",
      orderDate: "2024-01-19",
    },
    {
      id: "5",
      orderNumber: "#ORD-2405",
      restaurant: "Taco Express",
      customer: "Lisa Park",
      items: 2,
      total: "$28.40",
      status: "In Transit",
      deliveryPartner: "Mike Ross",
      orderDate: "2024-01-20",
    },
  ];
  const [page, setPage] = useState(1);
  const pageSize = 3; 
  const totalPages = Math.ceil(ordersData.length / pageSize);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = ordersData.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "green";
      case "In Transit":
        return "orange";
      case "Pending":
        return "yellow";
      default:
        return "gray";
    }
  };

  // if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <Box textStyle="3xl">Orders & Deliveries</Box>
      <Box textStyle="md" color="gray.500" margin={5}>
        Track all orders and delivery status
      </Box>
      {/* Cards */}
      <Flex height="1/6" gap="6" marginBlockEnd={5}>
        <Stack
          flex={1}
          direction="row"
          borderWidth="1px"
          borderRadius={10}
          padding={5}
        >
          <Flex>
            <Box
              height="fit-content"
              background="#fdf8e9"
              padding={2}
              borderRadius={10}
              marginInlineEnd="5"
              alignContent="center"
            >
              <FiPackage color="#f4c127" size={50} />
            </Box>
          </Flex>
          <Flex>
            <Box textStyle="sm" color="gray.500">
              Pending Orders
              <Box
                textStyle="3xl"
                fontWeight="bold"
                marginBlockStart={3}
                color="#e77240"
                textAlign="start"
              >
                {2}
              </Box>
            </Box>
          </Flex>
        </Stack>
        <Stack
          flex={1}
          direction="row"
          borderWidth="1px"
          borderRadius={10}
          padding={5}
        >
          <Flex>
            <Box
              height="fit-content"
              background="#e8f5fc"
              padding={2}
              borderRadius={10}
              marginInlineEnd="5"
              alignContent="center"
            >
              <FiTruck color="#19a2e6" size={50} />
            </Box>
          </Flex>
          <Flex>
            <Box textStyle="sm" color="gray.500">
              In Transit
              <Box
                textStyle="3xl"
                fontWeight="bold"
                marginBlockStart={3}
                color="#19a2e6"
                textAlign="start"
              >
                {2}
              </Box>
            </Box>
          </Flex>
        </Stack>
        <Stack
          flex={1}
          direction="row"
          borderWidth="1px"
          borderRadius={10}
          padding={5}
        >
          <Flex>
            <Box
              height="fit-content"
              background="#e7f5ec"
              padding={2}
              borderRadius={10}
              marginInlineEnd="5"
              alignContent="center"
            >
              <FaRegCheckCircle color="#24a855" size={50} />
            </Box>
          </Flex>
          <Flex>
            <Box textStyle="sm" color="gray.500">
              Delivered Today
              <Box
                textStyle="3xl"
                fontWeight="bold"
                marginBlockStart={3}
                color="#24a855"
                textAlign="start"
              >
                {2}
              </Box>
            </Box>
          </Flex>
        </Stack>
      </Flex>
      <Stack width="full" gap="5">
        <Table.Root size="sm" bg="inherit" color="inherit">
          <Table.Header>
            <Table.Row _hover={{ background: "gray.200" }}>
              <Table.ColumnHeader>Order Number</Table.ColumnHeader>
              <Table.ColumnHeader>Restaurant</Table.ColumnHeader>
              <Table.ColumnHeader>Customer</Table.ColumnHeader>
              <Table.ColumnHeader>Items</Table.ColumnHeader>
              <Table.ColumnHeader>Total</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Delivery Partner</Table.ColumnHeader>
              <Table.ColumnHeader>Order Date</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body border="none">
            {paginatedOrders.map((order) => (
              <Table.Row key={order.id} _hover={{ background: "gray.100" }}>
                <Table.Cell>{order.orderNumber}</Table.Cell>
                <Table.Cell>{order.restaurant}</Table.Cell>
                <Table.Cell>{order.customer}</Table.Cell>
                <Table.Cell>{order.items}</Table.Cell>
                <Table.Cell fontWeight="bold">{order.total}</Table.Cell>
                <Table.Cell>
                  <Badge
                    colorPalette={getStatusColor(order.status)}
                    borderRadius="20px"
                    borderWidth="1px"
                    px="3"
                    py="1"
                  >
                    {order.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{order.deliveryPartner}</Table.Cell>
                <Table.Cell>
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }).format(new Date(order.orderDate))}
                </Table.Cell>
                <Table.Cell textAlign="end">
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      variant="ghost"
                      borderWidth="1px"
                      borderColor="gray.200"
                      borderRadius="10px"
                      _hover={{ backgroundColor: "#16a249", color: "white" }}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      borderWidth="1px"
                      borderColor="gray.200"
                      borderRadius="10px"
                      _hover={{ backgroundColor: "#16a249", color: "white" }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      borderWidth="1px"
                      borderColor="red.500"
                      borderRadius="10px"
                      _hover={{ backgroundColor: "#f9e7e6" }}
                    >
                      <FaUserXmark color="red" />
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {/* Pagination Controls */}
        <Pagination.Root
          count={ordersData.length}
          pageSize={pageSize}
          page={page}
          onPageChange={(e) => setPage(e.page)}
        >
          <ButtonGroup
            variant="ghost"
            size="sm"
            wrap="wrap"
            justifyContent="center"
          >
            <Pagination.PrevTrigger asChild>
              <IconButton isDisabled={page === 1}>
                <LuChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={(pageItem) => (
                <IconButton
                  key={pageItem.value}
                  variant={pageItem.value === page ? "solid" : "ghost"}
                  background={pageItem.value === page ? "green.500" : "white"}
                  color={pageItem.value === page ? "white" : "gray.500"}
                  onClick={() => setPage(pageItem.value)}
                >
                  {pageItem.value}
                </IconButton>
              )}
            />

            <Pagination.NextTrigger asChild>
              <IconButton isDisabled={page === totalPages}>
                <LuChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </Stack>
    </>
  );
}

export default Deliveries;
