
// // import { Avatar, Box, Flex, Separator, Spacer, Text } from "@chakra-ui/react";
// // import { NavLink, Outlet } from "react-router-dom";
// // import AdminNavBar from "./AdminNavBar";
// // import { useColorMode } from "../../theme/color-mode";

// // export default function SidebarLayout() {
// //   const links = [
// //     { to: "/admin", label: "Dashboard", exact: true },
// //     { to: "/admin/analytics", label: "Analytics" },
// //     { to: "/admin/chef-verification", label: "Chef Verification" },
// //     { to: "/admin/user-management", label: "User Management" },
// //     { to: "/admin/deliveries", label: "Deliveries" },
// //     { to: "/admin/complaints", label: "Complaints" },
// //   ];

// //   const { colorMode } = useColorMode();
// //   return (
// //     <Box>
// //       {/* Sidebar */}
// //       <Box
// //         position="fixed"
// //         left="0"
// //         top="0"
// //         h="100vh"
// //         w="250px"
// //         background={colorMode === "light" ? "white" : "#181310"}
// //         color="white"
// //         p="4"
// //       >
// //         <Text
// //           fontSize="xl"
// //           mb="4"
// //           fontWeight="bold"
// //           color={colorMode === "light" ? "black" : "white"}
// //         >
// //           Admin Dashboard
// //         </Text>
// //         <Separator marginBlock={5}></Separator>

// //         <Box as="nav">
// //           {links.map((link) => (
// //             <NavLink
// //               key={link.to}
// //               to={link.to}
// //               end={link.exact}
// //               style={({ isActive }) => ({
// //                 display: "block",
// //                 marginBottom: "10px",
// //                 padding: "10px",
// //                 borderRadius: "5px",
// //                 backgroundColor: isActive ? "#e77240" : "transparent",
// //                 textDecoration: "none",
// //               })}
// //             >
// //               <Text color={colorMode === "light" ? "gray.700" : "white"}>
// //                 {link.label}
// //               </Text>
// //             </NavLink>
// //           ))}
// //         </Box>
// //       </Box>

// //       {/* Main content */}
// //       <Box ml="250px" flex="1">
// //         <AdminNavBar />

// //         <Box p="6" background={colorMode === "light" ? "white" : "#181310"}>
// //           <Outlet />
// //         </Box>
// //       </Box>
// //     </Box>
// //   );
// // }
// import {
//   Avatar,
//   Box,
//   Flex,
//   Separator,
//   Spacer,
//   Text,
//   HStack,
// } from "@chakra-ui/react";
// import { NavLink, Outlet } from "react-router-dom";
// import AdminNavBar from "./AdminNavBar";
// import { useColorMode } from "../../theme/color-mode";

// import { LuLayoutDashboard, LuChartColumn, LuUserCheck } from "react-icons/lu";
// import { FiUsers, FiShoppingBag } from "react-icons/fi";


// import { GrCompliance } from "react-icons/gr";
// export default function SidebarLayout() {
//   const links = [
//     { to: "/admin", label: "Dashboard", icon: LuLayoutDashboard, exact: true },
//     { to: "/admin/analytics", label: "Analytics", icon: LuChartColumn },
//     {
//       to: "/admin/chef-verification",
//       label: "Chef Verification",
//       icon: LuUserCheck,
//     },
//     { to: "/admin/user-management", label: "User Management", icon: FiUsers },
//     { to: "/admin/deliveries", label: "Deliveries", icon: FiShoppingBag },
//     { to: "/admin/complaints", label: "Complaints", icon: GrCompliance },
//   ];

//   const { colorMode } = useColorMode();

//   return (
//     <Box>
//       {/* Sidebar */}
//       <Box
//         position="fixed"
//         left="0"
//         top="0"
//         h="100vh"
//         w="250px"
//         background={colorMode === "light" ? "white" : "#181310"}
//         color="white"
//         zIndex="10"
//         p="4"
//       >
//         <Text
//           fontSize="xl"
//           mb="4"
//           fontWeight="bold"
//           color={colorMode === "light" ? "black" : "white"}
//         >
//           Admin Dashboard
//         </Text>
//         <Separator marginBlock={5} />

//         <Box as="nav">
//           {links.map((link) => {
//             const Icon = link.icon;
//             return (
//               <NavLink
//                 key={link.to}
//                 to={link.to}
//                 end={link.exact}
//                 style={({ isActive }) => ({
//                   display: "block",
//                   marginBottom: "10px",
//                   padding: "10px",
//                   borderRadius: "5px",
//                   backgroundColor: isActive ? "#e77240" : "transparent",
//                   textDecoration: "none",
//                 })}
//               >
//                 <HStack spacing={3}>
//                   <Icon
//                     size={18}
//                     color={colorMode === "light" ? "black" : "white"}
//                   />
//                   <Text color={colorMode === "light" ? "gray.700" : "white"}>
//                     {link.label}
//                   </Text>
//                 </HStack>
//               </NavLink>
//             );
//           })}
//         </Box>
//       </Box>

//       {/* Main content */}
//       <Box ml="250px" flex="1">
//         <AdminNavBar />

//         <Box p="6" background={colorMode === "light" ? "white" : "#181310"}>
//           <Outlet />
//         </Box>
//       </Box>
//     </Box>
//   );
// }
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  Separator,
  Drawer,
  Portal,
  CloseButton,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router-dom";
import AdminNavBar from "./AdminNavBar";
import { useColorMode } from "../../theme/color-mode";

import { LuLayoutDashboard, LuChartColumn, LuUserCheck } from "react-icons/lu";
import { FiUsers, FiShoppingBag } from "react-icons/fi";
import { GrCompliance } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import colors from "../../theme/color";
import logo from '../../assets/logotitle.png';
import { Image } from "@chakra-ui/react";
export default function SidebarLayout() {
  const links = [
    { to: "/admin", label: "Dashboard", icon: LuLayoutDashboard, exact: true },
    { to: "/admin/analytics", label: "Analytics", icon: LuChartColumn },
    {
      to: "/admin/chef-verification",
      label: "Chef Verification",
      icon: LuUserCheck,
    },
    { to: "/admin/user-management", label: "User Management", icon: FiUsers },
    { to: "/admin/deliveries", label: "Deliveries", icon: FiShoppingBag },
    { to: "/admin/complaints", label: "Complaints", icon: GrCompliance },
    { to: "/admin/settings", label: "Settings", icon: IoSettingsOutline },
  ];

  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const sidebarContent = (
    <Box
      w={{ base: "full", md: "250px" }}
      h="full"
      bg={colors.dark.bgThird}
      p="4"
    >

    {/* LOGO */}
      <Box
        alignItems={"center"}
        flex={1}
        display={"flex"}
        justifyContent={"flex-start"}
      >
        <Image
          src={logo}
          alt={"."}
          height={{ base: "25px", md: "40px" }}
        />
      </Box>



      <Separator marginBlock={5} />
      <Box as="nav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              style={({ isActive }) => ({
                display: "block",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: isActive ? colors.light.mainFixed : "transparent",
                textDecoration: "none",
              })}
              onClick={() => setIsDrawerOpen(false)}
            >
              <HStack spacing={3}>
                <Icon
                  size={18}
                  color={"white"}
                />
                <Text color={"white"}>
                  {link.label}
                </Text>
              </HStack>
            </NavLink>
          );
        })}
      </Box>
    </Box>
  );

  return (
    <Box>
      {/* Sidebar for desktop */}
      {!isMobile && (
        <Box position="fixed" left="0" top="0" h="100vh" w="250px" zIndex="10">
          {sidebarContent}
        </Box>
      )}

      {/* Drawer for mobile */}
      {isMobile && (
        <Drawer.Root isOpen={isDrawerOpen} placement="left">
          {/* <Drawer.Trigger asChild>
            <IconButton
              aria-label="Open sidebar"
              icon={<GiHamburgerMenu />}
              m="3"
              size="md"
              color={colorMode === "light" ? "black" : "white"}
              b
              
            />
          </Drawer.Trigger>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.CloseTrigger asChild>
                  <CloseButton
                    size="sm"
                    position="absolute"
                    top="3"
                    right="3"
                  />
                </Drawer.CloseTrigger>
                {sidebarContent}
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal> */}
        </Drawer.Root>
      )}

      {/* Main content */}
      <Box ml={{ base: 0, md: "250px" }} flex="1">
        <AdminNavBar />
        <Box  bg={colorMode === "light" ? "white" : "#181310"}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
