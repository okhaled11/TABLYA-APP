"use client";

import React, { useState, useMemo } from "react";
import {
  Stack,
  Table,
  Button,
  IconButton,
  ButtonGroup,
  Badge,
  Flex,
  Box,
  SimpleGrid,
  Input,
  InputGroup,
  NativeSelect,
} from "@chakra-ui/react";
import { CiSearch } from "react-icons/ci";
import { FiFileText, FiAlertTriangle } from "react-icons/fi";
import { FaRegCheckCircle, FaEye, FaEdit } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import StatCard from "../../components/Admin/StatCard";
import { useColorMode } from "../../theme/color-mode";
import { useGetReportsQuery } from "../../app/features/Admin/reportsApi";

const mockReports = [
  {
    id: "4e2c8b15-5f32-4d6e-92e1-1a45af7c9a01",
    reporter_user_id: "6d9f8b15-7a22-4e3b-8f23-1a32df8c4e91",
    target_id: "2a1e9c85-1b42-4d6a-83f2-9b4e2d9c6f12",
    target_type: "order",
    reason: "Order was 45 minutes late",
    details: "The delivery took too long despite the ETA being 20 minutes.",
    status: "open",
    assigned_to_admin: null,
    created_at: "2024-01-15T10:30:00Z",
    order_id: "9b3f4c85-2e6a-4d32-83b9-2a9c8e3f3b91",
  },
  {
    id: "2d8c7a45-6b34-42f3-8d21-5b1e7c3a2e92",
    reporter_user_id: "c3d2a6b1-7e23-4a32-9f8c-1d7b5a2e9c13",
    target_id: "b7e9f6d3-1a5b-42c8-b1a7-2c9f8d5a6b91",
    target_type: "user",
    reason: "Rude behavior during delivery",
    details:
      "The customer was verbally abusive to the chef during the drop-off.",
    status: "open",
    assigned_to_admin: null,
    created_at: "2024-01-14T09:15:00Z",
    order_id: "a5b3c7d8-9e12-4b5f-8a7d-3f2c9b6a4c13",
  },
  {
    id: "1a5e8b12-7d31-43c9-9a21-8b3f6e2d5c11",
    reporter_user_id: "e8f2b6c3-5a7d-41b8-8c9e-3d2b9a4f1a52",
    target_id: "a7b6c5d4-2f9e-4c1a-9d3b-5e7f6a3c2b91",
    target_type: "order",
    reason: "Food was spoiled",
    details: "Meal smelled bad and looked old. Customer refused to eat it.",
    status: "resolved",
    assigned_to_admin: "8c9b1a7d-4f3e-4c2b-9a8d-2e5b1c3f9d42",
    created_at: "2024-01-13T14:40:00Z",
    order_id: "d4f9a6b3-7c1e-4a9f-b5d2-8e3b1c6a9f11",
  },
  {
    id: "8b7e6c4d-1a9f-4e3b-9c5a-2f8d1b7a3e64",
    reporter_user_id: "9f3b6a2d-8b1e-4c7a-9d5b-1a2e8c9f3b71",
    target_id: "3e7a9f1c-6b2d-4f9e-8a1b-9d5f3c2e4a19",
    target_type: "user",
    reason: "Customer disputed valid charge",
    details: "Chef reported a false dispute on a successfully delivered meal.",
    status: "open",
    assigned_to_admin: null,
    created_at: "2024-01-12T11:25:00Z",
    order_id: "b1f9a3c4-2d7e-4b8a-9f3d-6a1c7e2b9d51",
  },
  {
    id: "6e5d4c3b-9a8f-4b7a-8e1f-2d6c5a9b3f81",
    reporter_user_id: "2a3b4c5d-6e7f-8a9b-1c2d-3e4f5a6b7c8d",
    target_id: "9d8c7b6a-5e4f-3d2c-1b9a-8f7e6d5c4b3a",
    target_type: "order",
    reason: "Received completely different items",
    details: "Ordered a pasta meal but received sushi instead.",
    status: "closed",
    assigned_to_admin: "8c9b1a7d-4f3e-4c2b-9a8d-2e5b1c3f9d42",
    created_at: "2024-01-11T13:50:00Z",
    order_id: "c8d7e6f5-1b2a-4c3d-9e8f-7a6b5c4d3e2f",
  },
];

// Badge color by status
const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "yellow";
    case "reviewed":
      return "orange";
    case "resolved":
      return "green";
    default:
      return "gray";
  }
};

export default function Complaints() {
  const { data: reports, isLoading } = useGetReportsQuery();
  console.log(reports);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredByDate, setFilteredByDate] = useState(mockReports);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { colorMode } = useColorMode();

  const pageSize = 4;

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  // Filtered data
  const handleFilterByDate = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = mockReports.filter((r) => {
      const reportDate = new Date(r.created_at);
      return reportDate >= start && reportDate <= end;
    });

    setFilteredByDate(filtered);
  };

  const handleExportCSV = () => {
    if (!filteredReports || filteredReports.length === 0) {
      alert("No data to export.");
      return;
    }

    // Define CSV headers
    const headers = [
      "ID",
      "Reporter User ID",
      "Target ID",
      "Target Type",
      "Reason",
      "Details",
      "Status",
      "Assigned To Admin",
      "Order ID",
      "Created At",
    ];

    // Convert report data to CSV rows
    const rows = filteredReports.map((r) => [
      `"${r.id}"`,
      `"${r.reporter_user_id}"`,
      `"${r.target_id}"`,
      `"${r.target_type}"`,
      `"${r.reason}"`,
      `"${r.details || ""}"`,
      `"${r.status}"`,
      `"${r.assigned_to_admin || ""}"`,
      `"${r.order_id || ""}"`,
      `"${new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(new Date(r.created_at))}"`,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredReports = useMemo(() => {
    const reportsToFilter = filteredByDate.length
      ? filteredByDate
      : mockReports;

    return reportsToFilter.filter((r) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        r.reason.toLowerCase().includes(search) ||
        (r.details?.toLowerCase().includes(search) ?? false) ||
        r.status.toLowerCase().includes(search) ||
        r.target_type.toLowerCase().includes(search) ||
        r.reporter_user_id.toLowerCase().includes(search) ||
        r.target_id.toLowerCase().includes(search);
      return matchesSearch;
    });
  }, [searchTerm, filteredByDate]);

  const totalPages = Math.ceil(filteredReports.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

  return (
    <>
      <Box textStyle="3xl" color={colorMode === "light" ? "black" : "white"}>
        Reports & Complaints
      </Box>
      <Box textStyle="md" color="gray.500" marginBlock={5}>
        Manage user reports and complaints
      </Box>

      {/* Cards */}
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        gap={["12px", "30px"]}
        justify={["center", "center"]}
        marginBottom={5}
      >
        <StatCard
          icon={FiFileText}
          backgroundColor={colorMode === "light" ? "white" : "#261c17"}
          iconBg="transparent"
          iconColor="blue"
          label="Total Reports"
          value={mockReports.length}
          valueColor="blue"
        />
        <StatCard
          icon={FiAlertTriangle}
          backgroundColor={colorMode === "light" ? "white" : "#261c17"}
          iconBg="transparent"
          iconColor="#19a2e6"
          label="Pending"
          value={mockReports.filter((r) => r.status === "pending").length}
          valueColor="#19a2e6"
        />
        <StatCard
          icon={FaEye}
          backgroundColor={colorMode === "light" ? "white" : "#261c17"}
          iconBg="transparent"
          iconColor="#d3df2b"
          label="Reviewed"
          value={mockReports.filter((r) => r.status === "reviewed").length}
          valueColor="#d3df2b"
        />
        <StatCard
          icon={FaRegCheckCircle}
          backgroundColor={colorMode === "light" ? "white" : "#261c17"}
          iconBg="transparent"
          iconColor="#24a855"
          label="Resolved"
          value={mockReports.filter((r) => r.status === "resolved").length}
          valueColor="#24a855"
        />
      </SimpleGrid>
      <Stack
        borderWidth="1px"
        borderRadius={10}
        padding={5}
        borderColor={colorMode === "light" ? "gray.100" : "gray.900"}
        background={colorMode === "light" ? "white" : "#261c17"}
      >
        {/* Search + Filter */}
        <Flex mb={5} flexWrap="wrap" gap={3} alignItems="center">
          <InputGroup flex={{ base: "1 1 100%", md: 2 }} minW="200px" gap={2}>
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>

          <Flex flex={{ base: "1 1 100%", md: 4 }} gap={2} minW="300px">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
          </Flex>

          {/* Filter Button */}
          <Button
            flex={{ base: "1 1 100%", md: 1 }}
            colorScheme="blue"
            onClick={handleFilterByDate}
          >
            Filter
          </Button>

          <Flex
            flex={{ base: "1 1 100%", md: 1 }}
            justify={{ base: "flex-start", md: "flex-end" }}
            minW="150px"
          >
            <Button
              size={"md"}
              background="rgba(236, 110, 57, 1)"
              color="white"
              onClick={handleExportCSV}
            >
              Export to CSV
            </Button>
          </Flex>
        </Flex>

        {/* Table */}
        <Stack width="full" gap="5">
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
                <Table.ColumnHeader>ID</Table.ColumnHeader>
                <Table.ColumnHeader>Reporter User ID</Table.ColumnHeader>
                <Table.ColumnHeader>Target ID</Table.ColumnHeader>
                <Table.ColumnHeader>Target Type</Table.ColumnHeader>
                <Table.ColumnHeader>Reason</Table.ColumnHeader>
                <Table.ColumnHeader>Details</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Assigned Admin</Table.ColumnHeader>
                <Table.ColumnHeader>Order ID</Table.ColumnHeader>
                <Table.ColumnHeader>Created At</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {paginatedReports.map((r) => (
                <Table.Row
                  key={r.id}
                  _hover={{
                    bg: colorMode === "light" ? "gray.100" : "#140f0cff",
                  }}
                  background={colorMode === "light" ? "white" : "#261c17"}
                >
                  <Table.Cell>{r.id}</Table.Cell>
                  <Table.Cell>{r.reporter_user_id}</Table.Cell>
                  <Table.Cell>{r.target_id}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={
                        r.target_type === "order" ? "purple" : "blue"
                      }
                      textTransform="capitalize"
                    >
                      {r.target_type}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{r.reason}</Table.Cell>
                  <Table.Cell>{r.details}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={
                        r.status === "open"
                          ? "yellow"
                          : r.status === "resolved"
                          ? "green"
                          : "gray"
                      }
                      textTransform="capitalize"
                    >
                      {r.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{r.assigned_to_admin ?? "—"}</Table.Cell>
                  <Table.Cell>{r.order_id ?? "—"}</Table.Cell>
                  <Table.Cell>
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }).format(new Date(r.created_at))}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {/* Pagination */}
          <Flex justify="center" align="center" gap={3}>
            <IconButton
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              isDisabled={page === 1}
            >
              <LuChevronLeft />
            </IconButton>

            <ButtonGroup size="sm" variant="ghost">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  bg={page === i + 1 ? "gray.800" : "white"}
                  color={page === i + 1 ? "white" : "gray.600"}
                >
                  {i + 1}
                </Button>
              ))}
            </ButtonGroup>

            <IconButton
              size="sm"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              isDisabled={page === totalPages}
            >
              <LuChevronRight />
            </IconButton>
          </Flex>
        </Stack>
      </Stack>
    </>
  );
}
