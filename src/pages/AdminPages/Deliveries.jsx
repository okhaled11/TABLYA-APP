import {
  Badge,
  Box,
  Flex,
  Stack,
  Table,
  Pagination,
  ButtonGroup,
  IconButton,
  Input,
  InputGroup,
  NativeSelect,
  Spinner,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import { useGetOrdersQuery } from "../../app/features/Admin/ordersApi";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { FiPackage, FiTruck } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { useState, useMemo } from "react";
import StatCard from "../../components/Admin/StatCard";
import { useColorMode } from "../../theme/color-mode";
import { FaRegCheckCircle, FaClipboardCheck, FaEye } from "react-icons/fa";
import { MdOutlineDeliveryDining, MdCancel } from "react-icons/md";
import OrderModal from "../../components/Admin/OrderModal";
function Deliveries() {
  const { data: orders, isLoading } = useGetOrdersQuery();
  console.log(orders);
  const { colorMode } = useColorMode();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Handle user input
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => setStatusFilter(e.target.value);
const handleOpenModal = (order) => {
  setSelectedOrder(order);
  setIsModalOpen(true);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
  setSelectedOrder(null);
  };
  

  const ordersData = useMemo(() => {
    if (!orders) return [];
    return orders.map((order) => ({
      id: order.id,
      restaurant: order.cooker?.users?.name || "Unknown Chef",
      customer: order.customer?.users?.name || "Unknown Customer",
      deliveryPartner: order.delivery?.users?.name || "Unassigned",
      status: order.status,
      total: `$${order.total?.toFixed(2) || "0.00"}`,
      orderDate: order.created_at,
      orderTime: order.created_at,
    }));
  }, [orders]);

  const filteredOrders = ordersData.filter(
    (order) =>
      (statusFilter === "" || order.status === statusFilter) &&
      (searchTerm === "" ||
        order.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.deliveryPartner.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + pageSize
  );

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "blue";
      case "preparing":
        return "orange";
      case "ready_for_pickup":
        return "yellow";
      case "out_for_delivery":
        return "purple";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  if (isLoading)
    return (
      <Flex justify="center" align="center" h="60vh">
        <Spinner size="xl" />
      </Flex>
    );
    console.log("OrderModal received order:", selectedOrder);

  return (
    <>
      {/* Header */}
      <Box textStyle="3xl" color={colorMode === "light" ? "black" : "white"}>
        Orders & Deliveries
      </Box>
      <Box textStyle="md" marginBlock={5} color="gray.500">
        Track all orders and delivery status
      </Box>

      {/* Stats */}
      <SimpleGrid columns={[2, null, 3]} gap="10px" marginBottom={5}>
        {/* Confirmed Orders */}
        <StatCard
          icon={FaClipboardCheck}
          iconBg="#eaf2ff"
          backgroundColor={colorMode === "light" ? "white" : "#261c17"}
          iconColor="#3b82f6"
          label="Confirmed Orders"
          value={ordersData.filter((o) => o.status === "confirmed").length}
          valueColor="#3b82f6"
        />

        {/* Preparing Orders */}
        <StatCard
          icon={FiPackage}
          iconBg="#fdf8e9"
          backgroundColor={colorMode === "light" ? "white" : "#261c17"}
          iconColor="#f4c127"
          label="Preparing Orders"
          value={ordersData.filter((o) => o.status === "preparing").length}
          valueColor="#e77240"
        />

        {/* Ready for Pickup */}
        <StatCard
          icon={MdOutlineDeliveryDining}
          iconBg="#fff5e6"
          backgroundColor={colorMode === "light" ? "white" : "#261c17"}
          iconColor="#fb923c"
          label="Ready for Pickup"
          value={
            ordersData.filter((o) => o.status === "ready_for_pickup").length
          }
          valueColor="#fb923c"
        />

        {/* Out for Delivery */}
        <StatCard
          icon={FiTruck}
          iconBg="#e8f5fc"
          backgroundColor={colorMode === "light" ? "white" : "#261c17"}
          iconColor="#19a2e6"
          label="Out for Delivery"
          value={
            ordersData.filter((o) => o.status === "out_for_delivery").length
          }
          valueColor="#19a2e6"
        />

        {/* Delivered Orders */}
        <StatCard
          icon={FaRegCheckCircle}
          iconBg="#e7f5ec"
          backgroundColor={colorMode === "light" ? "white" : "#261c17"}
          iconColor="#24a855"
          label="Delivered Orders"
          value={ordersData.filter((o) => o.status === "delivered").length}
          valueColor="#24a855"
        />

        {/* Cancelled Orders */}
        <StatCard
          icon={MdCancel}
          iconBg="#fdecec"
          backgroundColor={colorMode === "light" ? "white" : "#261c17"}
          iconColor="#ef4444"
          label="Cancelled Orders"
          value={ordersData.filter((o) => o.status === "cancelled").length}
          valueColor="#ef4444"
        />
      </SimpleGrid>

      {/* Table container */}
      <Stack
        borderWidth="1px"
        borderRadius={10}
        p={5}
        borderColor={colorMode === "light" ? "gray.100" : "gray.900"}
        background={colorMode === "light" ? "white" : "#261c17"}
      >
        {/* Search + Filter */}
        <Flex mb={4} gap={4} alignItems="center">
          <InputGroup flex={2} startElement={<CiSearch />}>
            <Input
              placeholder="Search by restaurant, customer, or partner"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>

          <NativeSelect.Root flex={1}>
            <NativeSelect.Field
              value={statusFilter}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready_for_pickup">Ready for Pickup</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Flex>

        {/* Table */}
        <Table.Root size="sm">
          <Table.Header
            background={colorMode === "light" ? "white" : "#261c17"}
          >
            <Table.Row
              _hover={{
                bg: colorMode === "light" ? "gray.100" : "#140f0cff",
              }}
              background={colorMode === "light" ? "white" : "#261c17"}
            >
              <Table.ColumnHeader>Restaurant</Table.ColumnHeader>
              <Table.ColumnHeader>Customer</Table.ColumnHeader>
              <Table.ColumnHeader>Delivery Partner</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Total</Table.ColumnHeader>
              <Table.ColumnHeader>Date</Table.ColumnHeader>
              <Table.ColumnHeader>Time</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {paginatedOrders.map((order) => (
              <Table.Row
                key={order.id}
                _hover={{
                  bg: colorMode === "light" ? "gray.100" : "#140f0cff",
                }}
                height="10px"
                background={colorMode === "light" ? "white" : "#261c17"}
              >
                <Table.Cell>{order.restaurant}</Table.Cell>
                <Table.Cell>{order.customer}</Table.Cell>
                <Table.Cell>{order.deliveryPartner}</Table.Cell>
                <Table.Cell>
                  <Badge
                    colorPalette={getStatusColor(order.status)}
                    borderRadius="full"
                    px="3"
                    py="1"
                    textTransform="capitalize"
                  >
                    {order.status.replace(/_/g, " ")}
                  </Badge>
                </Table.Cell>
                <Table.Cell fontWeight="bold">{order.total}</Table.Cell>
                <Table.Cell>
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }).format(new Date(order.orderDate))}
                </Table.Cell>
                <Table.Cell>
                  {new Intl.DateTimeFormat("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(order.orderTime))}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    key={order.id}
                    size="sm"
                    variant="outline"
                    colorScheme="teal"
                    onClick={() => {
                      const fullOrder = orders?.find((o) => o.id === order.id);
                      setSelectedOrder(fullOrder);
                      setIsModalOpen(true);
                    }}
                  >
                    <FaEye />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {/* Pagination */}
        <Pagination.Root
          count={filteredOrders.length}
          pageSize={pageSize}
          alignSelf="center"
          page={page}
          onPageChange={(e) => setPage(e.page)}
        >
          <ButtonGroup variant="ghost" size="sm" wrap="wrap">
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
                  background={pageItem.value === page ? "gray.800" : "white"}
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

      <OrderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
    </>
  );
}

export default Deliveries;
