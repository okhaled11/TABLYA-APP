import { Button, Heading, Text } from "@chakra-ui/react";
import { Flex, Box } from "@chakra-ui/react";
import { Badge } from "@chakra-ui/react";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import { Separator } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
const OrderPage = ({ setPageOrder }) => {
  /* --------------------------state------------------------- */
  const { colorMode } = useColorMode();
  const navigate=useNavigate();
  

  return (
    <>
      {/* Active Order Now */}
      <Box>
        <Text fontSize={{ base: "20px", md: "40px" }} fontWeight={"700"}>
          Active Order Now
        </Text>
        {/* order */}
        <Box
          bg={
            colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
          }
          rounded={"2xl"}
          p={{ base: 3, md: 7 }}
          my={4}
        >
          {/* upper */}
          <Flex
            direction={{ base: "column", md: "row" }}
            justify={"space-between"}
            alignItems={"center"}
          >
            {/* left */}
            <Box textAlign={{ base: "center", md: "start" }}>
              <Badge
                fontWeight={400}
                fontSize={"18px"}
                rounded={"xl"}
                p={3}
                color={
                  colorMode === "light"
                    ? colors.light.pending
                    : colors.dark.pending
                }
                bg={
                  colorMode === "light"
                    ? colors.light.pending20a
                    : colors.dark.pending20a
                }
              >
                Order Placed
              </Badge>
            </Box>

            {/* right */}
            <Box>
              <Text
                fontWeight={500}
                my={4}
                fontSize={"30px"}
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
              >
                Total: 275.00 LE
              </Text>
            </Box>
          </Flex>

          {/* btn */}
          <Flex
            justify={"space-between"}
            direction={{ base: "column", md: "row" }}
          >
            <Box>
              <Text mt={6} color={colors.light.textSub}>
                29 / 10 / 2025 | 10:50 AM | #ORD-2025-001234
              </Text>
            </Box>
            <Button
              onClick={() => navigate("/home/details")}
              my={3}
              rounded="xl"
              variant="solid"
              color="white"
              bg={
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed
              }
              _active={{
                bg:
                  colorMode === "light"
                    ? colors.light.mainFixedActive
                    : colors.dark.mainFixedActive,
                transform: "scale(0.98)",
              }}
              _hover={{
                bg:
                  colorMode === "light"
                    ? colors.light.mainFixedActive
                    : colors.dark.mainFixedActive,
              }}
            >
              Order Details
            </Button>
          </Flex>
        </Box>
      </Box>

      {/* ------------history order------------------- */}
      <Box>
        <Text fontSize={{ base: "20px", md: "40px" }} fontWeight={"700"}>
          History Order
        </Text>
        {/* order */}

        <Box
          bg={
            colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
          }
          rounded={"2xl"}
          p={{ base: 3, md: 7 }}
          my={4}
        >
          {/* upper */}
          <Flex
            direction={{ base: "column", md: "row" }}
            justify={"flex-end"}
            alignItems={"center"}
          >
            {/* left */}

            {/* right */}
            <Box>
              <Text
                fontWeight={500}
                fontSize={"30px"}
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
              >
                Total: 275.00 LE
              </Text>
            </Box>
          </Flex>

          <Separator my={4} variant="solid" />

          {/* content order */}
          <Flex gap="4" direction={"column"} py={4}>
            <Flex
              p={4}
              rounded={"xl"}
              justify={"space-between"}
              alignItems={"center"}
              bg={
                colorMode === "light"
                  ? colors.light.bgFourth
                  : colors.dark.bgFourth
              }
            >
              <Box>
                <Heading> Traditional Koshari</Heading>
                <Text my={3} color={colors.light.textSub}>
                  Price: 55 LE
                </Text>
              </Box>

              <Text
                fontWeight={500}
                fontSize={"30px"}
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
              >
                2x
              </Text>
            </Flex>
          </Flex>
          <Flex gap="4" direction={"column"} py={4}>
            <Flex
              p={4}
              rounded={"xl"}
              justify={"space-between"}
              alignItems={"center"}
              bg={
                colorMode === "light"
                  ? colors.light.bgFourth
                  : colors.dark.bgFourth
              }
            >
              <Box>
                <Heading> Traditional Koshari</Heading>
                <Text my={3} color={colors.light.textSub}>
                  Price: 55 LE
                </Text>
              </Box>

              <Text
                fontWeight={500}
                fontSize={"30px"}
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
              >
                2x
              </Text>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default OrderPage;
