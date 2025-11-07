import {
  Box,
  Grid,
  Flex,
  Spinner,
  Input,
  InputGroup,
  NativeSelect,
  Stack,
  Heading,
  Table,
  Pagination,
  ButtonGroup,
  IconButton,
  Badge,
  Avatar,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useGetUsersQuery } from "../../app/features/UserSlice";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const { data: users, error, isLoading } = useGetUsersQuery();
  const [page, setPage] = useState(1);
  console.log(users);

  if (isLoading)
    return (
      <Flex justify="center" align="center" height="50vh">
        <Spinner size="xl" />
      </Flex>
    );

  if (error)
    return (
      <Flex justify="center" align="center" height="50vh">
        <Text color="red.500">Error loading users</Text>
      </Flex>
    );

  const customerCount = users?.filter((u) => u.role === "customer").length || 0;
  const chefCount = users?.filter((u) => u.role === "cooker").length || 0;
  const deliveryCount = users?.filter((u) => u.role === "delivery").length || 0;

  const filteredUsers = users.filter(
    (user) =>
      (selectedRole === "" || user.role === selectedRole) &&
      (searchTerm === "" ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pageSize = 5; 

  // pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const getBadgeColor = (role) => {
    if (role === "customer") return "orange";
    if (role === "cooker") return "green";
    if (role === "delivery") return "blue";
    return "red";
  };

  return (
    <>
      {/* Header */}
      <Box textStyle="3xl">User Management</Box>
      <Box textStyle="md" color="gray.500" margin={5}>
        Manage all platform users
      </Box>
      {/* Cards */}
      <Flex height="1/6" gap="6" marginBlockEnd={5}>
        <Box flex={1} borderWidth="1px" borderRadius={10} padding={5}>
          <Box textStyle="sm" color="gray.500">
            Total Cutomers
          </Box>
          <Box
            textStyle="3xl"
            fontWeight="bold"
            marginBlockStart={3}
            color="#e77240"
          >
            {customerCount}
          </Box>
        </Box>
        <Box flex={1} borderWidth="1px" borderRadius={10} padding={5}>
          <Box textStyle="sm" color="gray.500">
            Total Chefs
          </Box>
          <Box
            textStyle="3xl"
            fontWeight="bold"
            marginBlockStart={3}
            color="#16a249"
          >
            {chefCount}
          </Box>
        </Box>
        <Box flex={1} borderWidth="1px" borderRadius={10} padding={5}>
          <Box textStyle="sm" color="gray.500">
            Deliveries Partners
          </Box>
          <Box
            textStyle="3xl"
            fontWeight="bold"
            marginBlockStart={3}
            color="#3ea2e6"
          >
            {deliveryCount}
          </Box>
        </Box>
      </Flex>
      {/* Table */}
      <Stack
        borderWidth="1px"
        borderRadius={10}
        padding={5}
        borderColor="gray.500"
        background="white"
      >
        <Box height="1/6">
          <Flex alignItems={"center"}>
            <Flex flex={2} marginInlineEnd={5}>
              <InputGroup startElement={<CiSearch />}>
                <Input
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </InputGroup>
            </Flex>
            <Flex flex={1}>
              <NativeSelect.Root size="sm" width="240px">
                <NativeSelect.Field
                  value={selectedRole}
                  onChange={handleRoleChange}
                  placeholder="All"
                >
                  <option value="customer">Customer</option>
                  <option value="cooker">Chef</option>
                  <option value="delivery">Delivery</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Flex>
          </Flex>
        </Box>
        <Box height="5/6">
          <Stack width="full" gap="5">
            <Table.Root size="sm" bg="inherit" color="inherit">
              <Table.Header>
                <Table.Row _hover={{ background: "gray.200" }}>
                  <Table.ColumnHeader></Table.ColumnHeader>
                  <Table.ColumnHeader>Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Email</Table.ColumnHeader>
                  <Table.ColumnHeader>Role</Table.ColumnHeader>
                  {/* <Table.ColumnHeader textAlign="end">
                    Status
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">
                    Transactions
                  </Table.ColumnHeader> */}
                  <Table.ColumnHeader>Registration Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body border={"none"}>
                {paginatedUsers.map((user) => (
                  <Table.Row key={user.id} _hover={{ background: "gray.200" }}>
                    <Table.Cell>
                      <Avatar.Root shape="full" size="lg">
                        <Avatar.Fallback name={user.name} />
                        <Avatar.Image src={user.avatar_url} />
                      </Avatar.Root>
                    </Table.Cell>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        style={{
                          borderRadius: "20px",
                          padding: "4px 8px",
                          borderColor: "{getBadgeColor(user.role)}",
                          borderWidth: "1px",
                        }}
                        colorPalette={getBadgeColor(user.role)}
                      >
                        {user.role}
                      </Badge>
                    </Table.Cell>
                    {/* <Table.Cell textAlign="end">{user.status}</Table.Cell>
                    <Table.Cell textAlign="end">{user.transactions}</Table.Cell> */}
                    <Table.Cell>
                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      }).format(new Date(user.created_at))}
                    </Table.Cell>
                    <Table.Cell textAlign={"end"}>
                      <Flex gap={2}>
                        <Button
                          size="sm"
                          variant="ghost"
                          borderWidth={"1px"}
                          borderColor={"gray.200"}
                          borderRadius={"10px"}
                          _hover={{ backgroundColor: "#16a249" }}
                          // onClick={() => handleDelete(user.id)}
                        >
                          <FaEye />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          borderWidth={"1px"}
                          borderColor={"gray.200"}
                          borderRadius={"10px"}
                          _hover={{ backgroundColor: "#16a249" }}
                          // onClick={() => handleDelete(user.id)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          borderWidth={"1px"}
                          borderColor={"red.500"}
                          borderRadius={"10px"}
                          _hover={{ backgroundColor: "#f9e7e6" }}
                          // onClick={() => handleDelete(user.id)}
                        >
                          <FaUserXmark color="red" />
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>

            <Pagination.Root
              count={users.length}
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
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
