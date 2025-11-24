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
  SimpleGrid,
  Wrap,
  WrapItem,
  Spacer,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../app/features/Admin/adminUserManagemnetSlice";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { CiDeliveryTruck } from "react-icons/ci";
import ConfirmDialog from "../../components/Admin/ConfirmDialog";
import colors from "../../theme/color";
import { FaUserXmark } from "react-icons/fa6";
import { FaUserFriends, FaUtensils, FaMotorcycle } from "react-icons/fa";
import StatCard from "../../components/Admin/StatCard";
import { useColorMode } from "../../theme/color-mode";
import UserInfoModal from "../../components/Admin/UserModal";
import EditUserModal from "../../components/Admin/EditUserModal";
import DeliveryModal from "../../components/Admin/DeliveryModal";
import { toaster } from "../../components/ui/toaster";
export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const { data: users, error, isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  // const [localUsers, setLocalUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // console.log(users);
  const { colorMode } = useColorMode();

  

  if (isLoading)
    return (
      <Flex justify="center" align="center" height="100vh">
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
  //  const adminCount = users?.filter((u) => u.role === "admin").length || 0;

  const filteredUsers = users
    ?.filter((user) => (selectedRole ? user.role === selectedRole : true))
    ?.filter((user) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    })
    ?.filter((user) => {
      const createdAt = new Date(user.created_at);
      const from = startDate ? new Date(startDate) : null;
      const to = endDate ? new Date(endDate) : null;

      if (from && to && to < from) {
        return false;
      }

      if (from && !to) return createdAt >= from;

      if (!from && to) return createdAt <= to;

      if (from && to) return createdAt >= from && createdAt <= to;

      return true; // no dates selected
    });

  const pageSize = 5;

  // pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setPage(1);
  };

  // const handleFilterByDate = () => {
  //   if (!startDate && !endDate) {
  //     setLocalUsers(users);
  //     return;
  //   }

  //   const filtered = users.filter((user) => {
  //     const createdAt = new Date(user.created_at);
  //     const from = startDate ? new Date(startDate) : null;
  //     const to = endDate ? new Date(endDate) : null;

  //     if (from && createdAt < from) return false;
  //     if (to && createdAt > to) return false;
  //     return true;
  //   });

  //   setLocalUsers(filtered);
  //   setPage(1);
  // };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
      toaster.create({
        title: "User deleted successfully",
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Failed to delete user",
        type: "error",
      });
      console.error(error);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleOpenModal = (user, mode) => {
    setSelectedUser(user);

    if (mode === "view") {
      setIsInfoOpen(true);
    } else if (mode === "edit") {
      setIsEditOpen(true);
    }
  };

  const handleDeliveryModal = () => {
    setIsDeliveryModalOpen(true);
  };

  const handleExportCSV = () => {
    if (!filteredUsers || filteredUsers.length === 0) {
      toaster.create({ title: "No data to export", type: "error" });
      return;
    }

    const headers = ["Name", "Email", "Role", "Phone", "Registration Date"];
    const rows = filteredUsers.map((user) => [
      `"${user.name}"`,
      `"${user.email}"`,
      `"${user.role}"`,
      `"${user.phone}"`,
      `"${new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(new Date(user.created_at))}"`,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toaster.create({ title: "CSV exported successfully", type: "success" });
  };

  const getBadgeColor = (role) => {
    if (role === "customer") return "orange";
    if (role === "cooker") return "green";
    if (role === "delivery") return "blue";
    return "red";
  };

  return (
    <Box
      p={30}
      bg={colorMode === "light" ? colors.light.bgMain : colors.dark.bgMain}
    >
      {/* Header */}
      <Flex>
        <Box textStyle="3xl" color={colorMode === "light" ? "black" : "white"}>
          User Management
        </Box>
        <Spacer />
        <Box onClick={handleDeliveryModal}>
          <Button background="#fa2c23">
            Add new Delivery
            <CiDeliveryTruck />
          </Button>
        </Box>
      </Flex>

      <Box textStyle="md" color="gray.500" marginBlock={5}>
        Manage all platform users
      </Box>
      {/* Cards */}
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        gap={["12px", "30px"]}
        justify={["center", "center"]}
        marginBottom={8}
      >
        <StatCard
          backgroundColor={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
          icon={FaUserFriends}
          iconBg="#fdf8e9"
          iconColor="#e77240"
          label="Total Customers"
          value={customerCount}
          valueColor="#e77240"
        />

        <StatCard
          backgroundColor={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
          icon={FaUtensils}
          iconBg="#e7f5ec"
          iconColor="#16a249"
          label="Total Chefs"
          value={chefCount}
          valueColor="#16a249"
        />

        <StatCard
          backgroundColor={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
          icon={FaMotorcycle}
          iconBg="#e8f5fc"
          iconColor="#3ea2e6"
          label="Delivery Partners"
          value={deliveryCount}
          valueColor="#3ea2e6"
        />
      </SimpleGrid>

      {/* Table */}
      <Stack
        borderWidth="1px"
        borderRadius={10}
        padding={5}
        borderColor={colorMode === "light" ? "gray.100" : "gray.900"}
        bg={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
        overflowX="auto"
      >
        <Box height="1/6" alignItems={"center"}>
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
            <Flex flex={1} marginInlineEnd={5}>
              <NativeSelect.Root size="md">
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
            <Flex flex={2} marginInlineEnd={5} gap={2}>
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
              <Button
                colorScheme="gray"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRole("");
                  setStartDate("");
                  setEndDate("");
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
            <Flex flex={1}>
              <Button
                background="#fa2c23"
                color="white"
                onClick={handleExportCSV}
              >
                Export to CSV
              </Button>
            </Flex>
          </Flex>
        </Box>
        <Box height="5/6">
          <Stack width="full" gap="5">
            <Table.Root size="sm">
              <Table.Header
                bg={
                  colorMode === "light"
                    ? colors.light.bgMain
                    : colors.dark.bgMain
                }
              >
                <Table.Row
                  _hover={{
                    bg: colorMode === "light" ? "gray.100" : "#140f0cff",
                  }}
                  background={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
                >
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
                  <Table.Row
                    key={user.id}
                    _hover={{
                      bg: colorMode === "light" ? "gray.100" : "#140f0cff",
                    }}
                    height="10px"
                    background={
                      colorMode === "light" ? "white" : "rgb(20, 4, 2)"
                    }
                  >
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
                          borderColor={
                            colorMode === "light" ? "gray.200" : "gray.800"
                          }
                          borderRadius={"10px"}
                          background={
                            colorMode === "light" ? "white" : "#140f0cff"
                          }
                          _hover={{ backgroundColor: "#16a249" }}
                          onClick={() => handleOpenModal(user, "view")}
                        >
                          <FaEye />
                        </Button>
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
                          onClick={() => handleOpenModal(user, "edit")}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          borderWidth={"1px"}
                          borderColor={
                            colorMode === "light" ? "red.200" : "red.800"
                          }
                          borderRadius={"10px"}
                          _hover={{ backgroundColor: "#f9e7e6" }}
                          onClick={() => {
                            setUserToDelete(user);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <FaUserXmark color="red" />
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            {paginatedUsers.length === 0 && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                No users found
              </Box>
            )}
            {paginatedUsers.length !== 0 && (
              <Pagination.Root
                alignSelf={"center"}
                count={filteredUsers.length}
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
        </Box>
      </Stack>
      {/*  Modal */}
      <UserInfoModal
        user={selectedUser}
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
      {/* Edit */}
      <EditUserModal
        user={selectedUser}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          handleDelete(userToDelete.id);
        }}
        title="Delete User"
        message={`Are you sure you want to permanently delete ${userToDelete?.name}?`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
      <DeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
      />
    </Box>
  );
}
