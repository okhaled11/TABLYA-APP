import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  Stack,
  Center,
  Text,
  HStack,
  IconButton,
  VStack,
  Image,
  Container,
  Icon,
  Portal,
  useDialog,
  Separator,
  Switch,
  Badge,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import {
  User,
  CreditCard,
  Moon,
  Globe,
  SignOut,
  Sun,
  ShoppingBagIcon,
  ShoppingCartSimple,
} from "@phosphor-icons/react";
import { FiSearch } from "react-icons/fi";
import { useColorMode } from "../theme/color-mode";
import CookieService from "../services/cookies";
import { useTranslation } from "react-i18next";
import CustomAlertDialog from "../shared/CustomAlertDailog";
import Navlogo from "../assets/Navlogo.png";
import colors from "../theme/color";
import { useGetUserDataQuery } from "../app/features/Auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../app/features/Auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [checkedLang, setCheckedLang] = useState(isArabic);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { colorMode, toggleColorMode } = useColorMode();
  const [checked, setChecked] = useState(colorMode === "dark");
  const dialog = useDialog();
  const navigate = useNavigate();

  const token = CookieService.get("access_token");
  const { data: user } = useGetUserDataQuery(undefined, {
    skip: !token,
  });

  // handler for color mode switch
  const handleChange = (e) => {
    setChecked(e.checked);
    toggleColorMode();
  };
  //  handler for language switch
  const handleLanguageChange = (e) => {
    setCheckedLang(e.checked);
    const newLang = e.checked ? "ar" : "en";

    i18n.changeLanguage(newLang);
    document.dir = newLang === "ar" ? "rtl" : "ltr";
  };
  // logout handler
  const onOkHandler = () => {
    CookieService.remove("access_token", { path: "/" });
    dispatch(authApi.util.resetApiState());
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <Container size={"s"}>
        <Box
          bg={
            colorMode === "light" ? colors.light.bgFixed : colors.dark.bgFixed
          }
          px={{ base: 4, md: 8 }}
          position="fixed"
          top="0"
          left="0"
          right="0"
          w="95%"
          mx="auto"
          zIndex="1000"
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
            {/* {user && (
              <Flex
                flex="1"
                maxW={"400px"}
                // mx="auto"
                justifyContent="center"
                display={{ base: "none", md: "flex" }}
              >
                <InputGroup startElement={<FiSearch color="#FFF7F04D" />}>
                  <Input
                    placeholder="Search"
                    bg={"#FFF7F01A"}
                    borderRadius="12px"
                    size="md"
                    _placeholder={{ color: "#FFF7F04D" }}
                    color="white"
                    border="none"
                  />
                </InputGroup>
              </Flex>
            )} */}
            <Flex alignItems="center">
              <Stack direction="row" spacing={5} align="center">
                {/* mode and cart stack */}
                {!user ? (
                  <Button
                    onClick={toggleColorMode}
                    variant="ghost"
                    size="sm"
                    aria-label={t("navbar.toggle_mode")}
                    bg={"#FFF7F01A"}
                  >
                    {colorMode === "light" ? (
                      <Moon size={32} weight="fill" color="white" />
                    ) : (
                      <Icon as={Sun} boxSize={5} />
                    )}
                  </Button>
                ) : (
                  <HStack spacing={{ base: "0", md: "6" }}>
                    <Flex gap={3} alignItems={"center"} position="relative">
                      <IconButton
                        as={Link}
                        to="/home/cart"
                        aria-label="Cart"
                        variant="outline"
                        border={"none"}
                        color={"white"}
                        size="2xl"
                        _hover={{ bg: "transparent" }}
                      >
                        <Icon as={ShoppingCartSimple} boxSize={8} />
                        <Badge
                          position="absolute"
                          top="3"
                          right="2"
                          bg="red.500"
                          borderRadius="full"
                          width="20px"
                          height="20px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color="white"
                        >
                          {cartItems.length || "0"}
                        </Badge>
                      </IconButton>
                    </Flex>
                    <Flex alignItems={"center"}>
                      <Menu.Root
                        positioning={{ placement: "bottom" }}
                        closeOnSelect={false}
                      >
                        <Menu.Trigger rounded="full" focusRing="none">
                          <Avatar.Root
                            borderColor="#FA2C23"
                            borderWidth="3px"
                            size="sm"
                          >
                            <Avatar.Fallback
                              color="red"
                              name={user?.name}
                            />
                            <Avatar.Image
                              src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name}`}
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
                            >
                              <Menu.Item value="Personal-Info" asChild>
                                <Link to="/personal-info">
                                  <HStack spacing={3}>
                                    <Icon as={User} boxSize={4} />
                                    <Text>Personal Info</Text>
                                  </HStack>
                                </Link>
                              </Menu.Item>
                              <Menu.Item value="Payment-method">
                                <Link to="/personal-info/payment">
                                <HStack spacing={3}>
                                  <Icon as={CreditCard} boxSize={4} />
                                  <Text fontSize={"sm"}>Payment Method</Text>
                                </HStack>
                                </Link>
                              </Menu.Item>
                              <Separator />
                              {/* Dark Mode with Switch */}
                              <Menu.Item value="color-mode">
                                <HStack justify="space-between" w="full">
                                  <HStack spacing={3}>
                                    <Icon as={Moon} boxSize={4} />
                                    <Text>
                                      {colorMode === "light"
                                        ? "Dark Mode"
                                        : "Light Mode"}
                                    </Text>
                                    <Switch.Root
                                      checked={checked}
                                      onCheckedChange={handleChange}
                                      colorPalette={"green"}
                                      size="sm"
                                    >
                                      <Switch.HiddenInput />
                                      <Switch.Control>
                                        <Switch.Thumb />
                                      </Switch.Control>
                                    </Switch.Root>
                                  </HStack>
                                </HStack>
                              </Menu.Item>
                              {/* Language Switch */}
                              <Menu.Item value="lang">
                                <HStack justify="space-between" w="full">
                                  <HStack spacing={3}>
                                    <Icon as={Globe} boxSize={4} />
                                    <Text>
                                      {i18n.language === "en"
                                        ? "Arabic"
                                        : "English"}
                                    </Text>
                                  </HStack>
                                  <HStack>
                                    <Switch.Root
                                      checked={checkedLang}
                                      onCheckedChange={handleLanguageChange}
                                      size="sm"
                                      colorPalette={"green"}
                                    >
                                      <Switch.HiddenInput />
                                      <Switch.Control>
                                        <Switch.Thumb />
                                      </Switch.Control>
                                    </Switch.Root>
                                  </HStack>
                                </HStack>
                              </Menu.Item>
                              <Separator />
                              <Menu.Item
                                value="logout"
                                color="red.500"
                                onClick={() => dialog.setOpen(true)}
                              >
                                <HStack spacing={3}>
                                  <Icon as={SignOut} boxSize={4} />
                                  <Text>Logout</Text>
                                </HStack>
                              </Menu.Item>
                            </Menu.Content>
                          </Menu.Positioner>
                        </Portal>
                      </Menu.Root>
                    </Flex>
                    <Flex
                      alignItems={"flex-start"}
                      direction={"column"}
                      display={{ base: "none", md: "flex" }}
                    >
                      <Text fontSize="12px" color="#FFF7F0B2">
                        Hello
                      </Text>
                      <Text fontSize="12px" color="#FFF7F0">
                        {user?.name || "UserName"}
                      </Text>
                    </Flex>
                  </HStack>
                )}
              </Stack>
            </Flex>
          </Flex>
        </Box>
      </Container>
      <Box h={{ base: 20, md: 24 }} />
      <CustomAlertDialog
        dialog={dialog}
        title={t("navbar.logout_confirm_title")}
        description={t("navbar.logout_confirm_description")}
        cancelTxt={t("navbar.cancel")}
        okTxt={t("navbar.ok")}
        onOkHandler={onOkHandler}
      />
    </>
  );
}
