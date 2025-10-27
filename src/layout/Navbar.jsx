import {
  Box,
  Flex,
  Avatar,
  Button,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  Stack,
  Center,
  Text,
  HStack,
  IconButton,
  VStack,
  // useDisclosure,
  Image,
  Container,
} from "@chakra-ui/react";
import { useColorMode } from "../theme/color-mode";
import { Link } from "react-router-dom";
import CookieService from "../services/cookies";
import { useTranslation } from "react-i18next";
import { FiBell, FiChevronDown} from "react-icons/fi";
import { FaMoon ,FaSun} from "react-icons/fa";
import CustomAlertDailog from "../shared/CustomAlertDailog";
import Navlogo from "../assets/Navlogo.png";
import colors from "../theme/color";

export default function Navbar() {
  const { t } = useTranslation();
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  // const bg = colorMode === "light" ? "white" : "gray.900";
  // const bg2 = colorMode === "light" ? "gray.200" : "gray.700";
  // const navigate = useNavigate();

  // const user = CookieService.get("user");

  // const onOkHandler = () => {
  //   CookieService.remove("jwt", { path: "/" });
  //   CookieService.remove("user", { path: "/" });
  //   onClose();
  //   window.location.reload();
  //   navigate("/login");
  // };

  return (
    <>
      <Container size={"s"}>
        <Box
          bg={
            colorMode === "light" ? colors.light.bgFixed : colors.dark.bgFixed
          }
          px={{ base: 4, md: 8 }}
          position="sticky"
          top="0"
          zIndex="10"
          borderRadius={"25px"}
          maxH={160}
          maxW={1600}
          mt={4}
        >
          <Flex
            h={16}
            alignItems="center"
            justifyContent="space-between"
            maxW="1200px"
            mx="auto"
          >
            {/* Logo */}
            <Image src={Navlogo} alt={t("navbar.logo_alt")} w={"150px"} />

            <Flex alignItems="center">
              <Stack direction="row" spacing={5} align="center">
                {/* mode toggle */}
                <Button
                  onClick={toggleColorMode}
                  variant="ghost"
                  size="sm"
                  aria-label={t("navbar.toggle_mode")}
                  bg={"#FFF7F01A"}
                >
                  {colorMode === "light" ? (
                    <FaMoon color="white" />
                  ) : (
                    <FaSun color="white" />
                  )}
                </Button>

                {/* If logged in → show avatar menu
              {user && (
                <HStack spacing={{ base: "0", md: "6" }}>
                  <Flex alignItems={"center"}>
                    <MenuRoot>
                      <MenuTrigger asChild>
                        <Button variant="ghost" py={2} transition="all 0.3s">
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
                            </VStack>
                            <Box display={{ base: "none", md: "flex" }}>
                              <FiChevronDown />
                            </Box>
                          </HStack>
                        </Button>
                      </MenuTrigger>
                      <MenuContent bg={bg} borderColor={bg2}>
                        <MenuItem
                          value="logout"
                          onClick={() => {
                            onOpen();
                          }}
                        >
                          {t("navbar.logout")}
                        </MenuItem>
                      </MenuContent>
                    </MenuRoot>
                  </Flex>
                </HStack>
              )}

              {/* If not logged in → show Sign In / Sign Up */}
                {/* {!user && (
                <Stack direction="row" spacing={4}>
                  <Button
                    as={Link}
                    to="/login"
                    variant="ghost"
                    fontWeight={500}
                    size="sm"
                  >
                    {t("navbar.sign_in")}
                  </Button>
                  <Button
                    as={Link}
                    to="/signup"
                    colorPalette="blue"
                    fontWeight="semibold"
                    size="sm"
                    px={5}
                  >
                    {t("navbar.sign_up")}
                  </Button>
                </Stack>
              )} */}
              </Stack>
            </Flex>
          </Flex>
        </Box>
      </Container>
      {/* <CustomAlertDailog
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        title={t("navbar.logout_confirm_title")}
        description={t("navbar.logout_confirm_description")}
        cancelTxt={t("navbar.cancel")}
        okTxt={t("navbar.ok")}
        onOkHandler={onOkHandler}
      /> */}
    </>
  );
}
