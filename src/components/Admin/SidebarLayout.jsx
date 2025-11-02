// src/components/admin/SidebarLayout.jsx
import { Avatar, Box, Flex, Spacer, Text } from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router-dom";
import AdminNavBar from "./AdminNavBar";

export default function SidebarLayout() {
  const links = [
    { to: "/admin", label: "Dashboard", exact: true },
    { to: "/admin/analytics", label: "Analytics" },
    { to: "/admin/chef-verification", label: "Chef Verification" },
    { to: "/admin/user-management", label: "User Management" },
    { to: "/admin/deliveries", label: "Deliveries" },
    { to: "/admin/complaints", label: "Complaints" },
  ];

  return (
    <Flex>
      {/* Sidebar */}
      <Box
        position="fixed"
        left="0"
        top="0"
        h="100vh"
        w="250px"
        bg="#0f1729"
        color="white"
        p="4"
      >
        <Text fontSize="xl" mb="4" fontWeight="bold" color="{#6467f2}">
          Admin Dashboard
        </Text>
        <Box h="1px" w="100%" bg="gray.800" />

        <Box as="nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              style={({ isActive }) => ({
                display: "block",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: isActive ? "#1d283a" : "transparent",
                textDecoration: "none",
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </Box>
      </Box>

      {/* Main content */}
      <Box ml="250px" flex="1" bg="#f6f7f9" minH="100vh">
        <AdminNavBar />

        <Box p="6">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}
