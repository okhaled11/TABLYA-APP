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
    id: "RPT-001",
    reporterId: "U001",
    reporterName: "John Doe",
    reporterRole: "customer",
    reportedId: "C001",
    reportedName: "Chef Maria",
    reportedRole: "chef",
    category: "Late Delivery",
    reason: "Order was 45 minutes late",
    dateSubmitted: "2024-01-15",
    status: "pending",
  },
  {
    id: "RPT-002",
    reporterId: "C002",
    reporterName: "Chef Roberto",
    reporterRole: "chef",
    reportedId: "U002",
    reportedName: "Jane Smith",
    reportedRole: "customer",
    category: "Inappropriate Conduct",
    reason: "Rude behavior during delivery",
    dateSubmitted: "2024-01-14",
    status: "reviewed",
  },
  {
    id: "RPT-003",
    reporterId: "U003",
    reporterName: "Mike Johnson",
    reporterRole: "customer",
    reportedId: "C003",
    reportedName: "Chef Lisa",
    reportedRole: "chef",
    category: "Food Quality",
    reason: "Food was spoiled",
    dateSubmitted: "2024-01-13",
    status: "resolved",
  },
  {
    id: "RPT-004",
    reporterId: "C004",
    reporterName: "Chef David",
    reporterRole: "chef",
    reportedId: "U004",
    reportedName: "Sarah Williams",
    reportedRole: "customer",
    category: "Payment Issue",
    reason: "Customer disputed valid charge",
    dateSubmitted: "2024-01-12",
    status: "pending",
  },
  {
    id: "RPT-005",
    reporterId: "U005",
    reporterName: "Tom Brown",
    reporterRole: "customer",
    reportedId: "C005",
    reportedName: "Chef Anna",
    reportedRole: "chef",
    category: "Wrong Order",
    reason: "Received completely different items",
    dateSubmitted: "2024-01-11",
    status: "reviewed",
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
  const [selectedRole, setSelectedRole] = useState("");
  const { colorMode } = useColorMode();

  const pageSize = 3;

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());
  // const handleRoleChange = (e) => setSelectedRole(e.target.value);

  // Filtered data
  const filteredReports = useMemo(() => {
    return mockReports.filter((r) => {
      const matchesSearch =
        r.reporterName.toLowerCase().includes(searchTerm) ||
        r.reportedName.toLowerCase().includes(searchTerm) ||
        r.category.toLowerCase().includes(searchTerm);
      const matchesRole = selectedRole
        ? r.reporterRole === selectedRole || r.reportedRole === selectedRole
        : true;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, selectedRole]);

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
      <SimpleGrid columns={[2, null, 2]} gap="10px" mb={5} >
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
        <Box mb={5}>
          <Flex alignItems="center" gap={4}>
            <Flex flex={2}>
              <InputGroup startElement={<CiSearch />}>
                <Input
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </InputGroup>
            </Flex>

            {/* <Flex flex={1}>
              <NativeSelect.Root size="sm" width="240px">
                <NativeSelect.Field
                  value={selectedRole}
                  onChange={handleRoleChange}
                >
                  <option value="">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="chef">Chef</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Flex> */}
          </Flex>
        </Box>

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
                <Table.ColumnHeader>Report ID</Table.ColumnHeader>
                <Table.ColumnHeader>Reporter</Table.ColumnHeader>
                <Table.ColumnHeader>Reported User</Table.ColumnHeader>
                <Table.ColumnHeader>Category</Table.ColumnHeader>
                <Table.ColumnHeader>Reason</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Date</Table.ColumnHeader>
                {/* <Table.ColumnHeader>Actions</Table.ColumnHeader> */}
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
                  <Table.Cell>
                    {r.reporterName}
                    <Badge
                      ml="2"
                      colorPalette="blue"
                      textTransform="capitalize"
                    >
                      {r.reporterRole}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {r.reportedName}
                    <Badge
                      ml="2"
                      colorPalette="purple"
                      textTransform="capitalize"
                    >
                      {r.reportedRole}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{r.category}</Table.Cell>
                  <Table.Cell>{r.reason}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={getStatusColor(r.status)}
                      textTransform="capitalize"
                    >
                      {r.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }).format(new Date(r.dateSubmitted))}
                  </Table.Cell>
                  {/* <Table.Cell>
                    <Flex gap={2}>
                      <Button size="sm" variant="ghost">
                        <FaEye />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <FaEdit />
                      </Button>
                      <Button size="sm" variant="ghost" colorScheme="red">
                        <FaUserXmark />
                      </Button>
                    </Flex>
                  </Table.Cell> */}
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
