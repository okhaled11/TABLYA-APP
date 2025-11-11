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
  Status,
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
import { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { clearCart } from "../app/features/Customer/CartSlice";
import { supabase } from "../services/supabaseClient";
import { toaster } from "../components/ui/toaster";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [checkedLang, setCheckedLang] = useState(isArabic);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { colorMode, toggleColorMode } = useColorMode();
  const [checked, setChecked] = useState(colorMode === "dark");
  const [isAvailable, setIsAvailable] = useState(false);
  const dialog = useDialog();
  const navigate = useNavigate();

  const token = CookieService.get("access_token");
  const { data: user } = useGetUserDataQuery(undefined, {
    skip: !token,
  });

  // Fetch cooker availability status
  useEffect(() => {
    const fetchAvailability = async () => {
      if (user?.role === "cooker" && user?.id) {
        console.log("Fetching availability for user_id:", user.id);
        const { data, error } = await supabase
          .from("cookers")
          .select("is_available")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching availability:", error);
        } else if (data) {
          console.log("Availability data:", data);
          setIsAvailable(data.is_available || false);
        }
      }
    };

    fetchAvailability();
  }, [user]);

  // handler for color mode switch
  const handleChange = (e) => {
    setChecked(e.checked);
    toggleColorMode();
  };

  // handler for availability switch (cooker only)
  const handleAvailabilityChange = async (e) => {
    const newAvailability = e.checked;
    
    // Debug: Check user object
    console.log("Full user object:", user);
    console.log("User ID:", user?.id);
    
    // Validate user ID before updating
    if (!user?.id) {
      console.error("User ID is undefined!");
      toaster.create({
        title: "Failed to update availability",
        description: "User information not available. Please refresh the page.",
        type: "error",
      });
      return;
    }
    
    setIsAvailable(newAvailability);

    console.log("Updating availability for user_id:", user.id, "to:", newAvailability);

    // Update in database
    const { data, error } = await supabase
      .from("cookers")
      .update({ is_available: newAvailability })
      .eq("user_id", user.id)
      .select();

    if (error) {
      console.error("Error updating availability:", error);
      // Revert on error
      setIsAvailable(!newAvailability);
      toaster.create({
        title: "Failed to update availability",
        description: error.message,
        type: "error",
      });
    } else {
      console.log("Successfully updated availability:", data);
      toaster.create({
        title: newAvailability ? "You are now available" : "You are now unavailable",
        type: "success",
        duration: 2000,
      });
    }
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
    dispatch(clearCart());
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
                    {/* Show Cart only for customers, not for cookers */}
                    {user?.role !== "cooker" && (
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
                    )}
                      {/* Availability Badge with Switch for Cooker */}
                      {user?.role === "cooker" && (
                        <Badge
                          bg={
                            isAvailable
                              ? colorMode === "light"
                                ? colors.light.success20a
                                : colors.dark.success20a
                              : colorMode === "light"
                              ? "#FFE5E5"
                              : "#4A2626"
                          }
                          borderRadius="8px"
                          fontSize={{ base: "xs", md: "sm" }}
                          px={3}
                          py={1}
                          transition="all 0.3s ease"
                        >
                          <Flex gap={2} alignItems="center">
                            <Status.Root
                              colorPalette={isAvailable ? "green" : "red"}
                              color={
                                isAvailable
                                  ? colorMode === "light"
                                    ? colors.light.success
                                    : colors.dark.success
                                  : colorMode === "light"
                                  ? "#DC2626"
                                  : "#EF4444"
                              }
                            >
                              <Status.Indicator
                                bg={isAvailable ? "green.400" : "red.400"}
                                boxShadow={
                                  isAvailable
                                    ? "0 0 12px 2px #2EB200"
                                    : "0 0 12px 2px #DC2626"
                                }
                                filter="blur(0.5px)"
                              />
                              {isAvailable ? "Available" : "Unavailable"}
                            </Status.Root>
                            
                            <Switch.Root
                              checked={isAvailable}
                              onCheckedChange={handleAvailabilityChange}
                              colorPalette={isAvailable ? "green" : "red"}
                              size="sm"
                            >
                              <Switch.HiddenInput />
                              <Switch.Control>
                                <Switch.Thumb />
                              </Switch.Control>
                            </Switch.Root>
                          </Flex>
                        </Badge>
                    )}
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
                              {/* <Menu.Item value="Personal-Info" asChild>
                                <Link to="/personal-info">
                                  <HStack spacing={3}>
                                    <Icon as={User} boxSize={4} />
                                    <Text>Personal Info</Text>
                                  </HStack>
                                </Link>
                              </Menu.Item> */}
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
