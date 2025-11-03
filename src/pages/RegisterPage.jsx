import { Flex, Image, Box, VStack, Heading, Text } from "@chakra-ui/react";
import CustomerRegister from "../components/Auth/CustomerRegister";
import { useColorMode } from "../theme/color-mode";
import { Tabs } from "@chakra-ui/react";
import { PiChefHatDuotone } from "react-icons/pi";
import { FaUserAlt } from "react-icons/fa";
import colors from "../theme/color";
import register from "../assets/Images_Auth/register.png";
import ChefRegister from "../components/Auth/ChefRegister";
import Navbar from "../layout/Navbar";
import Footer from "../shared/Footer";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  return (
    <>
      <Navbar />
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bg={colorMode == "light" ? colors.light.bgMain : colors.dark.bgMain}
        px={4}
        py={10}
      >
        <Flex
          w={{ base: "100%", md: "80%" }}
          justifyContent={"center"}
          borderRadius="2xl"
          bg={colorMode == "light" ? colors.light.bgThird : colors.dark.bgFixed}
        >
          {/* Left Side: Tabs + Form */}
          <Flex
            flex={1}
            p={10}
            align="flex-start"
            justify="center"
            position="relative"
          >
            <Box w="100%" maxW="500px">
              {/* Tabs with fixed-style layout */}
              <Tabs.Root defaultValue="customer" variant="plain">
                <VStack mb={5}>
                  <Heading
                    fontSize="3xl"
                    fontWeight={"bold"}
                    textAlign="center"
                    color={
                      colorMode == "light"
                        ? colors.light.textMain
                        : colors.dark.textMain
                    }
                  >
                    {t("register.title")}
                  </Heading>
                  <Text fontSize={"sm"} color={"#968782"}>
                    {t("register.subtitle")}
                  </Text>
                </VStack>
                <Tabs.List
                  display="flex"
                  justifyContent="space-around"
                  bg={colorMode == "light" ? "#1F06040A" : "#FFF7F012"}
                  rounded="lg"
                  p="2"
                  mb="6"
                  top="0"
                  zIndex="10"
                >
                  <Tabs.Trigger
                    value="customer"
                    px={12}
                    py={2}
                    rounded="md"
                    fontWeight="bold"
                    _selected={{
                      bg:
                        colorMode == "light"
                          ? colors.light.bgThird
                          : colors.dark.bgThird,
                      color: colors.light.mainFixed,
                    }}
                  >
                    <FaUserAlt style={{ marginRight: "6px" }} />
                    {t("register.customer")}
                  </Tabs.Trigger>

                  <Tabs.Trigger
                    value="chef"
                    px={8}
                    py={2}
                    rounded="md"
                    fontWeight="bold"
                    _selected={{
                      bg:
                        colorMode == "light"
                          ? colors.light.bgThird
                          : colors.dark.bgThird,
                      color: colors.light.mainFixed,
                    }}
                  >
                    <PiChefHatDuotone style={{ marginRight: "6px" }} />
                    {t("register.chef")}
                  </Tabs.Trigger>

                  <Tabs.Indicator display="none" />
                </Tabs.List>

                {/* Tab Content */}
                <Tabs.Content value="customer" px={0}>
                  <CustomerRegister />
                </Tabs.Content>

                <Tabs.Content value="chef">
                  <Box textAlign="center" py={6} fontWeight="medium">
                    <ChefRegister />
                  </Box>
                </Tabs.Content>
              </Tabs.Root>
            </Box>
          </Flex>

          {/* Right Side: Image */}
          <Flex flex={1} display={{ base: "none", md: "block" }}>
            <Image
              alt={t("register.imageAlt")}
              objectFit="cover"
              w="100%"
              h="100%"
              src={register}
              rounded={"md"}
            />
          </Flex>
        </Flex>
      </Flex>
      <Footer/>
    </>
  );
}
