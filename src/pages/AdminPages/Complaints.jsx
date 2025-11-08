"use client";

import React, { useState } from "react";
import {
  Stack,
  Table,
  Button,
  IconButton,
  ButtonGroup,
  Badge,
  Flex,
  Box,
  Grid,
  SimpleGrid,
} from "@chakra-ui/react";


import { FiFileText } from "react-icons/fi";
import { FiAlertTriangle } from "react-icons/fi";

import { Pagination } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import { FaRegCheckCircle } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";

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
    details:
      "The order was supposed to arrive at 7:00 PM but arrived at 7:45 PM. Food was cold.",
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
    details:
      "Customer was verbally abusive to delivery person and refused to pay tip.",
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
    details: "The food arrived with a bad smell and appeared to be expired.",
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
    details:
      "Customer received order but filed chargeback claiming non-delivery.",
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
    details: "Ordered vegetarian meal but received meat-based dishes.",
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
  const [page, setPage] = useState(1);
  const pageSize = 3; 
  const totalPages = Math.ceil(mockReports.length / pageSize);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedReports = mockReports.slice(startIndex, endIndex);

  return (
    <>
      <Box textStyle="3xl">Reports & Complaints</Box>
      <Box textStyle="md" color="gray.500" margin={5}>
        Manage user reports and complaints
      </Box>
      {/* Cards */}
      <SimpleGrid
        columns={[2, null, 2]}
        height="1/6"
        gap="6px"
        marginBlockEnd={5}
      >
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
              // background="#fdf8e9"
              padding={2}
              borderRadius={10}
              marginInlineEnd="5"
              alignContent="center"
            >
              <FiFileText color="blue" size={50} />
            </Box>
          </Flex>
          <Flex>
            <Box textStyle="sm" color="gray.500">
              Total Reports
              <Box
                textStyle="3xl"
                fontWeight="bold"
                marginBlockStart={3}
                color="blue"
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
              // background="#e8f5fc"
              padding={2}
              borderRadius={10}
              marginInlineEnd="5"
              alignContent="center"
            >
              <FiAlertTriangle color="#19a2e6" size={50} />
            </Box>
          </Flex>
          <Flex>
            <Box textStyle="sm" color="gray.500">
              Pending
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
              // background="#e7f5ec"
              padding={2}
              borderRadius={10}
              marginInlineEnd="5"
              alignContent="center"
            >
              <FaEye color="#d3df2bff" size={50} />
            </Box>
          </Flex>
          <Flex>
            <Box textStyle="sm" color="gray.500">
              Reviewed
              <Box
                textStyle="3xl"
                fontWeight="bold"
                marginBlockStart={3}
                color="#d3df2bff"
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
              // background="#e7f5ec"
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
              Resolved
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
      </SimpleGrid>
      <Stack width="full" gap="5">
        <Table.Root size="sm" bg="inherit" color="inherit">
          <Table.Header>
            <Table.Row _hover={{ background: "gray.200" }}>
              <Table.ColumnHeader>Report ID</Table.ColumnHeader>
              <Table.ColumnHeader>Reporter</Table.ColumnHeader>
              <Table.ColumnHeader>Reported User</Table.ColumnHeader>
              <Table.ColumnHeader>Category</Table.ColumnHeader>
              <Table.ColumnHeader>Reason</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Date Submitted</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body border="none">
            {paginatedReports.map((report) => (
              <Table.Row key={report.id} _hover={{ background: "gray.100" }}>
                <Table.Cell>{report.id}</Table.Cell>
                <Table.Cell>
                  {report.reporterName}{" "}
                  <Badge
                    colorPalette="blue"
                    borderRadius="20px"
                    ml="2"
                    px="2"
                    py="1"
                    textTransform="capitalize"
                  >
                    {report.reporterRole}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {report.reportedName}{" "}
                  <Badge
                    colorPalette="purple"
                    borderRadius="20px"
                    ml="2"
                    px="2"
                    py="1"
                    textTransform="capitalize"
                  >
                    {report.reportedRole}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{report.category}</Table.Cell>
                <Table.Cell>{report.reason}</Table.Cell>
                <Table.Cell>
                  <Badge
                    colorPalette={getStatusColor(report.status)}
                    borderRadius="20px"
                    borderWidth="1px"
                    px="3"
                    py="1"
                    textTransform="capitalize"
                  >
                    {report.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }).format(new Date(report.dateSubmitted))}
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

        {/* Pagination */}
        <Pagination.Root
          count={mockReports.length}
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
    </>
  );
}
