import {
  Flex,
  Box,
  Avatar,
  IconButton,
  HStack,
  Icon,
  Portal,
  Menu,
  Text,
  Separator,
  Button,
  Float,
  Circle,
} from "@chakra-ui/react";
import { Moon, Sun, SignOut, User } from "@phosphor-icons/react";
import { FaRegBell } from "react-icons/fa";

import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import CookieService from "../../services/cookies";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authApi } from "../../app/features/Auth/authSlice";
import { useGetUserDataQuery } from "../../app/features/Auth/authSlice";
import Notifications from "./Notifications";


export default function AdminNavBar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const token = CookieService.get("access_token");
  const { data: admin } = useGetUserDataQuery(undefined, { skip: !token });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogout = () => {
    CookieService.remove("access_token", { path: "/" });
    dispatch(authApi.util.resetApiState());
    navigate("/login");
    window.location.reload();
  };

  return (
    <Box
      background={colors.dark.bgThird}
      px={6}
      py={3}
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Flex align="center" justify="flex-end" gap={4}>

          {/* bell Notification  */}
         <Notifications/>
        {/* Color Mode Toggle */}
        <IconButton
          onClick={toggleColorMode}
          aria-label="Toggle color mode"
          variant="ghost"
          size="sm"
          color={colorMode === "light" ? "gray.600" : "white"}
          _hover={{ bg: "transparent" }}
        >
          {colorMode === "light" ? (
            <Icon as={Moon} boxSize={5} />
          ) : (
            <Icon as={Sun} boxSize={5} />
          )}
        </IconButton>
        {/* <IconButton
          aria-label="Notifications"
          variant="ghost"
          size="sm"
          color={colorMode === "light" ? "gray.600" : "white"}
          _hover={{ bg: "transparent" }}
        >
          <FaRegBell />
          <Float placement="top-end" offsetX="1" offsetY="1">
            <Circle
              // bg="green.500"
              size="16px"
              outline="0.1em solid"
              
            >
              11
              </Circle>
          </Float>
        </IconButton> */}

        {/* Avatar with menu */}
        <Menu.Root positioning={{ placement: "bottom-end" }}>
          <Menu.Trigger rounded="full" focusRing="none">
            <Avatar.Root borderColor="orange" borderWidth="2px" size="sm">
              <Avatar.Fallback name={admin?.name || "Admin"} />
              <Avatar.Image
                src={
                  admin?.avatar_url || "https://ui-avatars.com/api/?name=Admin"
                }
              />
            </Avatar.Root>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content
                bg={
                  colorMode === "light"
                    ? colors.light.bgSecond
                    : colors.dark.bgFixed
                }
                p={3}
                borderRadius="md"
                minW="200px"
              >
                <HStack spacing={3} align="center" mb={2}>
                  <Avatar.Root size="sm">
                    <Avatar.Fallback name={admin?.name || "Admin"} />
                    <Avatar.Image
                      src={
                        admin?.avatar_url ||
                        "https://ui-avatars.com/api/?name=Admin"
                      }
                    />
                  </Avatar.Root>
                  <Box>
                    <Text fontWeight="medium" fontSize="sm">
                      {admin?.name || "Admin"}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {admin?.email || "admin@example.com"}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {admin?.phone || null}
                    </Text>
                  </Box>
                </HStack>

                <Separator my={2} />

                <Button
                  onClick={onLogout}
                  leftIcon={<SignOut size={18} />}
                  size="sm"
                  w="full"
                  colorScheme="red"
                  variant="solid"
                >
                  Logout
                </Button>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
    </Box>
  );
}
