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
  Pagination,
  Spinner,
} from "@chakra-ui/react";
import { CiSearch } from "react-icons/ci";
import { FiFileText, FiAlertTriangle } from "react-icons/fi";
import { FaRegCheckCircle, FaEye, FaEdit } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";
import StatCard from "../../components/Admin/StatCard";
import { useColorMode } from "../../theme/color-mode";
import { useGetReportsQuery } from "../../app/features/Admin/reportsApi";
// import { useGetReportActionsQuery } from "../../app/features/Admin/adminReportActionsApi";

import { useGetAdminIdQuery } from "../../app/features/Admin/adminData";
import EditReportModal from "../../components/Admin/EditReportModal";
import ViewReportModal from "../../components/Admin/ReportModal";
import colors from "../../theme/color";
import { toaster } from "../../components/ui/toaster";

// Badge color by status
const getStatusColor = (status) => {
  switch (status) {
    case "open":
      return "yellow";
    case "closed":
      return "red";
    case "resolved":
      return "green";
    default:
      return "gray";
  }
};

export default function Complaints() {
  const { data: reports, error, isLoading } = useGetReportsQuery();
  console.log(reports);
  if (error) console.error("Error fetching reports:", error);
  const { data: adminId } = useGetAdminIdQuery();
  // console.log(adminId);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredByDate, setFilteredByDate] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewReport, setViewReport] = useState(null);
  const [editReport, setEditReport] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { colorMode } = useColorMode();

  const pageSize = 5;

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const filterByStatus = (report, status) => {
    return status === "all" || report.status === status;
  };

  const filterBySearch = (report, search) => {
    const s = search.toLowerCase();
    return (
      report.reason.toLowerCase().includes(s) ||
      (report.details?.toLowerCase().includes(s) ?? false) ||
      report.reporter?.name.toLowerCase().includes(s) ||
      report.id.toLowerCase().includes(s) ||
      report.reporter_user_id.toLowerCase().includes(s) ||
      report.target_id.toLowerCase().includes(s)
    );
  };

  const filterByDate = (user, start, end) => {
    const createdAt = new Date(user.created_at);
    const from = start ? new Date(start) : null;
    const to = end ? new Date(end) : null;
    return (!from || createdAt >= from) && (!to || createdAt <= to);
  };

  // const filterByCurrentMonth = (report) => {
  //   const createdAt = new Date(report.created_at);
  //   const now = new Date();

  //   return (
  //     createdAt.getMonth() === now.getMonth() &&
  //     createdAt.getFullYear() === now.getFullYear()
  //   );
  // };

  const filteredReports = useMemo(() => {
    if (!reports) return [];
    return reports.filter((r) => {
      return (
        filterByStatus(r, selectedStatus) &&
        filterBySearch(r, searchTerm) &&
        filterByDate(r, startDate, endDate)
        // && filterByCurrentMonth(r)
      );
    });
  }, [reports, searchTerm, selectedStatus, startDate, endDate]);

  const totalPages = Math.ceil(filteredReports.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
    toaster.create({
      title: "Filters cleared",
      type: "success",
    });
  };

  const handleExportCSV = () => {
    if (!filteredReports || filteredReports.length === 0) {
      toaster.create({
        title: "No data to export",
        type: "error",
      });
      return;
    }

    // Define CSV headers
    const headers = [
      "Report ID",
      "Reporter Name",
      "Reporter User ID",
      "Target ID",
      "Target Type",
      "Reason",
      "Details",
      "Status",
      "Assigned Admin",
      "Order ID",
      "Created Date",
      "Created Time",
    ];

    // Convert report data to CSV rows
    const rows = filteredReports.map((r) => [
      `"ORD_${r.id.toString().slice(-4)}"`,
      `"${r.reporter?.name ?? ""}"`,
      `"${r.reporter_user_id}"`,
      `"${r.target_id ?? ""}"`,
      `"${r.target_type}"`,
      `"${r.reason}"`,
      `"${r.details ?? ""}"`,
      `"${r.status}"`,
      `"${r?.admin?.users?.name ?? ""}"`,
      `"${r.order_id ?? ""}"`,
      `"${new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(new Date(r.created_at))}"`,
      `"${new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
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

    // Success toast
    toaster.create({
      title: "CSV exported successfully",
      type: "success",
    });
  };
  if (isLoading)
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );

  return (
    <Box
      p={"30px"}
      bg={colorMode === "light" ? colors.light.bgMain : colors.dark.bgMain}
    >
      <Box textStyle="3xl" color={colorMode === "light" ? "black" : "white"}>
        Reports & Complaints
      </Box>
      <Box textStyle="md" color="gray.500" marginBlock={5}>
        Manage user reports and complaints
      </Box>

      {/* Cards */}
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        gap={["12px", "30px"]}
        justify={["center", "center"]}
        marginBottom={5}
      >
        <StatCard
          icon={FiFileText}
          backgroundColor={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
          iconBg="transparent"
          iconColor="#19a2e6"
          label="Total Reports"
          value={reports.length}
          valueColor="#19a2e6"
        />
        <StatCard
          icon={FiAlertTriangle}
          backgroundColor={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
          iconBg="transparent"
          iconColor="#d3df2b"
          label="Pending"
          value={reports.filter((r) => r.status === "open").length}
          valueColor="#d3df2b"
        />
        <StatCard
          icon={FaEye}
          backgroundColor={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
          iconBg="transparent"
          iconColor="#da1414ff"
          label="Reviewed"
          value={reports.filter((r) => r.status === "closed").length}
          valueColor="#da1414ff"
        />
        <StatCard
          icon={FaRegCheckCircle}
          backgroundColor={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
          iconBg="transparent"
          iconColor="#24a855"
          label="Resolved"
          value={reports.filter((r) => r.status === "resolved").length}
          valueColor="#24a855"
        />
      </SimpleGrid>
      <Stack
        borderWidth="1px"
        borderRadius={10}
        padding={5}
        borderColor={colorMode === "light" ? "gray.100" : "gray.900"}
        background={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
        overflowX={"auto"}
      >
        {/* Search + Filter */}
        <Flex mb={5} flexWrap="wrap" gap={3} alignItems="center">
          <Flex flex={5} minW="200px">
            <InputGroup minW="200px" gap={2}>
              <Input
                placeholder="Search by Name or Report ID"
                value={searchTerm}
                onChange={handleSearch}
              />
            </InputGroup>
          </Flex>
          <Flex flex={1} minW="200px">
            <NativeSelect.Root size="md">
              <NativeSelect.Field
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="resolved">Resolved</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Flex>

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
          <Flex gap={2}>
            <Button colorScheme="gray" onClick={handleClearFilters}>
              Clear
            </Button>
          </Flex>

          <Flex
            flex={{ base: "1 1 100%", md: 1 }}
            justify={{ base: "flex-start", md: "flex-end" }}
            minW="150px"
          >
            <Button
              size={"md"}
              background="#fa2c23"
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
              background={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
            >
              <Table.Row
                _hover={{
                  bg: colorMode === "light" ? "gray.100" : "#140f0cff",
                }}
                background={colorMode === "light" ? "white" : "#261c17"}
              >
                <Table.ColumnHeader>ID</Table.ColumnHeader>
                <Table.ColumnHeader>Reporter User </Table.ColumnHeader>
                {/* <Table.ColumnHeader>Target ID</Table.ColumnHeader> */}
                <Table.ColumnHeader>Target Type</Table.ColumnHeader>
                <Table.ColumnHeader>Reason</Table.ColumnHeader>
                {/* <Table.ColumnHeader>Details</Table.ColumnHeader> */}
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Assigned Admin</Table.ColumnHeader>
                {/* <Table.ColumnHeader>Order ID</Table.ColumnHeader> */}
                <Table.ColumnHeader>Created At</Table.ColumnHeader>
                <Table.ColumnHeader>Time</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {paginatedReports.map((r) => (
                <Table.Row
                  key={r.id}
                  _hover={{
                    bg: colorMode === "light" ? "gray.100" : "#140f0cff",
                  }}
                  background={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
                >
                  <Table.Cell>ORDER_{r.id.toString().slice(-4)}</Table.Cell>
                  <Table.Cell>{r.reporter?.name}</Table.Cell>
                  {/* <Table.Cell>{r.target_id}</Table.Cell> */}
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
                  {/* <Table.Cell>{r.details}</Table.Cell> */}
                  <Table.Cell>
                    <Badge
                      colorPalette={getStatusColor(r.status)}
                      textTransform="capitalize"
                    >
                      {r.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{r?.admin?.users.name ?? "—"}</Table.Cell>
                  {/* <Table.Cell>{r.order_id ?? "—"}</Table.Cell> */}
                  <Table.Cell>
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }).format(new Date(r.created_at))}
                  </Table.Cell>
                  <Table.Cell>
                    {new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                    }).format(new Date(r.created_at))}
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap={2}>
                      <Button
                        size="sm"
                        variant="ghost"
                        borderColor={
                          colorMode === "light" ? "gray.200" : "gray.800"
                        }
                        borderRadius={"10px"}
                        background={
                          colorMode === "light" ? "white" : "#140f0cff"
                        }
                        _hover={{ backgroundColor: "#16a249" }}
                        onClick={() => {
                          setViewReport(r);
                          setIsViewOpen(true);
                        }}
                      >
                        <FaEye />
                      </Button>

                      {r.status === "open" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          borderColor={
                            colorMode === "light" ? "gray.200" : "gray.800"
                          }
                          borderRadius={"10px"}
                          background={
                            colorMode === "light" ? "white" : "#140f0cff"
                          }
                          _hover={{ backgroundColor: "#16a249" }}
                          onClick={() => {
                            setEditReport(r);
                            setIsEditOpen(true);
                          }}
                        >
                          <FaRegEdit />
                        </Button>
                      )}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {/* Pagination */}
          {paginatedReports.length === 0 && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100px"
              fontWeight="bold"
            >
              No reports found
            </Box>
          )}

          {paginatedReports.length !== 0 && (
            <Pagination.Root
              alignSelf={"center"}
              count={filteredReports.length}
              pageSize={pageSize}
              page={page}
              onPageChange={(e) => setPage(e.page)}
            >
              <ButtonGroup variant="ghost" size="sm" wrap="wrap">
                <Pagination.PrevTrigger asChild>
                  <IconButton>
                    <LuChevronLeft />
                  </IconButton>
                </Pagination.PrevTrigger>

                <Pagination.Items
                  render={(pageItem) => (
                    <IconButton
                      key={pageItem.value}
                      variant={pageItem.value === page ? "solid" : "ghost"}
                      background={
                        pageItem.value === page ? "gray.800" : "white"
                      }
                      color={pageItem.value === page ? "white" : "gray.500"}
                      onClick={() => setPage(pageItem.value)}
                    >
                      {pageItem.value}
                    </IconButton>
                  )}
                />

                <Pagination.NextTrigger asChild>
                  <IconButton>
                    <LuChevronRight />
                  </IconButton>
                </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
          )}
        </Stack>
        {viewReport && (
          <ViewReportModal
            report={viewReport}
            isOpen={isViewOpen}
            onClose={() => setIsViewOpen(false)}
          />
        )}
        {editReport && (
          <EditReportModal
            report={editReport}
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            adminId={adminId}
          />
        )}
      </Stack>
    </Box>
  );
}
