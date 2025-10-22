import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Text,
  HStack,
  IconButton,
  VStack,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import CookieService from "../services/cookies";
import { FiBell, FiChevronDown } from "react-icons/fi";
import CustomAlertDailog from "../shared/CustomAlertDailog";
import logo from "../assets/logo.jpg";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("white", "gray.900");
  const bg2 = useColorModeValue("gray.200", "gray.700");
  const navigate = useNavigate();

  const user = CookieService.get("user");

  const onOkHandler = () => {
    CookieService.remove("jwt", { path: "/" });
    CookieService.remove("user", { path: "/" });
    onClose();
    window.location.reload();
    navigate("/login");
  };

  return (
    <>
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={{ base: 4, md: 8 }}
        boxShadow="sm"
        position="sticky"
        top="0"
        zIndex="10"
      >
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
          maxW="1200px"
          mx="auto"
        >
          {/* Logo */}
          <Text
            as={Link}
            to="/"
            fontSize="xl"
            fontWeight="bold"
            color={useColorModeValue("red.500", "red.300")}
            display="flex"
            alignItems="center"
            // gap="2"
          >
            <Image
              src={logo}
              alt="Tablya Logo"
              boxSize="50px"
              borderRadius="full"
            />
            Tablya
          </Text>

          <Flex alignItems="center">
            <Stack direction="row" spacing={5} align="center">
              {/* mode toggle */}
              <Button
                onClick={toggleColorMode}
                variant="ghost"
                size="sm"
                aria-label="Toggle color mode"
              >
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              {/* If logged in → show avatar menu */}
              {user && (
                <HStack spacing={{ base: "0", md: "6" }}>
                  <Flex alignItems={"center"}>
                    <Menu>
                      <MenuButton
                        py={2}
                        transition="all 0.3s"
                        _focus={{ boxShadow: "none" }}
                      >
                        <HStack>
                          <Avatar
                            size={"sm"}
                            src={`https://ui-avatars.com/api/?name=${user?.name}`}
                          />
                          <VStack
                            display={{ base: "none", md: "flex" }}
                            alignItems="flex-start"
                            spacing="1px"
                            ml="2"
                          >
                            <Text fontSize="sm">
                              {user?.name || "UserName"}
                            </Text>
                            {/* <Text fontSize="xs" color="gray.600">
                          Admin
                        </Text> */}
                          </VStack>
                          <Box display={{ base: "none", md: "flex" }}>
                            <FiChevronDown />
                          </Box>
                        </HStack>
                      </MenuButton>
                      <MenuList bg={bg} borderColor={bg2}>
                        <MenuItem
                          onClick={() => {
                            onOpen();
                          }}
                        >
                          Logout
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                </HStack>
              )}

              {/* If not logged in → show Sign In / Sign Up */}
              {!user && (
                <Stack direction="row" spacing={4}>
                  <Button
                    as={Link}
                    to="/login"
                    variant="ghost"
                    fontWeight={500}
                    size="sm"
                  >
                    Sign In
                  </Button>
                  <Button
                    as={Link}
                    to="/signup"
                    colorScheme="blue"
                    fontWeight="semibold"
                    size="sm"
                    px={5}
                  >
                    Sign Up
                  </Button>
                </Stack>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box>
      <CustomAlertDailog
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        title={"Are You Sure?"}
        description={"You will be logged out from the application!"}
        cancelTxt={"Cancel"}
        okTxt={"Ok"}
        onOkHandler={onOkHandler}
      />
    </>
  );
}
