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
import colors from "../../theme/color";
import { toaster } from "../../components/ui/toaster";

function Deliveries() {
  const { data: orders, isLoading } = useGetOrdersQuery();
  // console.log(orders);
  const { colorMode } = useColorMode();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
      restaurant:
        order.cooker?.kitchen_name ||
        order.cooker?.users?.name ||
        "Unknown Chef",
      customer: order.customer?.users?.name || "Unknown Customer",
      deliveryPartner: order.delivery?.users?.name || "Unassigned",
      status: order.status,
      total: `$${order.total?.toFixed(2) || "0.00"}`,
      orderDate: order.created_at,
      orderTime: order.created_at,
    }));
  }, [orders]);

  const filterByStatus = (order, status) => {
    return !status || order.status === status;
  };

  const filterBySearch = (order, search) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      order.restaurant.toLowerCase().includes(s) ||
      order.customer.toLowerCase().includes(s) ||
      order.deliveryPartner.toLowerCase().includes(s)
    );
  };

  const filterByDate = (order, start, end) => {
    const orderDate = new Date(order.orderDate);
    const from = start ? new Date(start) : null;
    const to = end ? new Date(end) : null;
    return (!from || orderDate >= from) && (!to || orderDate <= to);
  };

  // const filterByCurrentMonth = (order) => {
  //   const orderDate = new Date(order.orderDate);
  //   const now = new Date();

  //   return (
  //     orderDate.getMonth() === now.getMonth() &&
  //     orderDate.getFullYear() === now.getFullYear()
  //   );
  // };

  const filteredOrders = useMemo(() => {
    return ordersData.filter((order) => {
      return (
        filterByStatus(order, statusFilter) &&
        filterBySearch(order, searchTerm) &&
        filterByDate(order, startDate, endDate)
        // && filterByCurrentMonth(order)
      );
    });
  }, [ordersData, statusFilter, searchTerm, startDate, endDate]);

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

  const handleExportCSV = () => {
    if (!filteredOrders || filteredOrders.length === 0) {
      toaster.create({
        title: "No orders to export",
        type: "error",
      });
      return;
    }

    // Define CSV headers
    const headers = [
      "Order ID",
      "Restaurant",
      "Customer",
      "Delivery Partner",
      "Status",
      "Total",
      "Order Date",
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      order.restaurant,
      order.customer,
      order.deliveryPartner,
      order.status,
      order.total,
      new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(new Date(order.orderDate)),
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
      }).format(new Date(order.orderTime)),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toaster.create({
      title: "Orders exported successfully",
      type: "success",
    });
  };

  if (isLoading)
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  // console.log("OrderModal received order:", selectedOrder);

  return (
    <Box
      p={"30px"}
      bg={colorMode === "light" ? colors.light.bgMain : colors.dark.bgMain}
    >
      {/* Header */}
      <Box textStyle="3xl" color={colorMode === "light" ? "black" : "white"}>
        Orders & Deliveries
      </Box>
      <Box textStyle="md" marginBlock={5} color="gray.500">
        Track all orders and delivery status
      </Box>

      {/* Stats */}
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        gap={["5px", "30px"]}
        justify={["center", "center"]}
        marginBottom={5}
      >
        {/* Confirmed Orders */}
        <StatCard
          icon={FaClipboardCheck}
          iconBg="#eaf2ff"
          backgroundColor={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
          iconColor="#3b82f6"
          label="Confirmed Orders"
          value={ordersData.filter((o) => o.status === "confirmed").length}
          valueColor="#3b82f6"
        />

        {/* Preparing Orders */}
        <StatCard
          icon={FiPackage}
          iconBg="#fdf8e9"
          backgroundColor={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
          iconColor="#f4c127"
          label="Preparing Orders"
          value={ordersData.filter((o) => o.status === "preparing").length}
          valueColor="#e77240"
        />

        {/* Ready for Pickup */}
        <StatCard
          icon={MdOutlineDeliveryDining}
          iconBg="#fff5e6"
          backgroundColor={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
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
          backgroundColor={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
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
          backgroundColor={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
          iconColor="#24a855"
          label="Delivered Orders"
          value={ordersData.filter((o) => o.status === "delivered").length}
          valueColor="#24a855"
        />

        {/* Cancelled Orders */}
        <StatCard
          icon={MdCancel}
          iconBg="#fdecec"
          backgroundColor={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
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
        background={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
        overflowX="auto"
      >
        {/* Search + Filter */}
        <Flex mb={4} gap={3} alignItems="center" flexWrap="wrap">
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

          <Flex flex={3} gap={2}>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setSearchTerm("");
                setStatusFilter("");
                setPage(1);
                toaster.create({
                  title: "Filters cleared",
                  type: "success",
                });
              }}
            >
              Clear
            </Button>
          </Flex>

          <Button
            size={"md"}
            background="#fa2c23"
            color="white"
            onClick={handleExportCSV}
          >
            Export to CSV
          </Button>
        </Flex>

        {/* Table */}
        {filteredOrders.length > 0 ? (
          <Table.Root size="sm">
            <Table.Header
              background={colorMode === "light" ? "white" : "#261c17"}
            >
              <Table.Row
                _hover={{
                  bg: colorMode === "light" ? "gray.100" : "#140f0cff",
                }}
                background={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
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
                  background={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
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
                      _hover={{ bg: "#16a249", color: "white" }}
                      onClick={() => {
                        const fullOrder = orders?.find(
                          (o) => o.id === order.id
                        );
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
        ) : (
          <Box textAlign={"center"}>There are no orders to display</Box>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
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
        )}
      </Stack>

      <OrderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
    </Box>
  );
}

export default Deliveries;
