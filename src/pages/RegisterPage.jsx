import { Flex, Image, Box, VStack, Heading, Text } from "@chakra-ui/react";
import CustomerRegister from "../components/CustomerRegister";
import { useColorMode } from "../theme/color-mode";
import { Tabs } from "@chakra-ui/react";
import { PiChefHatDuotone } from "react-icons/pi";
import { FaUserAlt } from "react-icons/fa";
import colors from "../theme/color";
import register from "../assets/register.png"
import Navbar from "../layout/Navbar";
export default function SignUp() {
  const { colorMode } = useColorMode();


  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={colorMode == "light" ? colors.light.bgMain : colors.dark.bgMain}
      px={4}
      py={10}
    >
      <Flex
        w={{ base: "100%", md: "900px" }}
        borderRadius="2xl"
        boxShadow="2xl"
        overflow="hidden"
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
                  Create Account
                </Heading>
                <Text fontSize={"sm"} color={"#968782"}>
                  Join Tablya as a Customer or a Home Chef
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
                  <FaUserAlt style={{ marginRight: "6px" }} />
                  Customer
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
                  Chef
                </Tabs.Trigger>

                <Tabs.Indicator display="none" />
              </Tabs.List>

              {/* Tab Content */}
              <Tabs.Content value="customer">
                <CustomerRegister />
              </Tabs.Content>

              <Tabs.Content value="chef">
                <Box textAlign="center" py={6} fontWeight="medium">
                  Manage your Chef profile here 
                </Box>
              </Tabs.Content>
            </Tabs.Root>
          </Box>
        </Flex>

        {/* Right Side: Image */}
        <Flex flex={1} display={{ base: "none", md: "block" }}>
          <Image
            alt="Signup Image"
            objectFit="cover"
            w="100%"
            h="100%"
            src={register}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
