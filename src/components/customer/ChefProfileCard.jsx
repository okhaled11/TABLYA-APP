import {
  Box,
  Flex,
  Image,
  Text,
  Badge,
  Icon,
  IconButton,
  useBreakpointValue,
  Stack,
} from "@chakra-ui/react";
import { FaStar, FaPhoneAlt, FaClock } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { FiHeart } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import { useState } from "react";

const ChefProfileCard = ({
  users,
  avg_rating,
  bio,
  start_time,
  end_time,
  is_available,
  kitchen_name,
  total_reviews,
}) => {
  const { colorMode } = useColorMode();
  const [fav, setFav] = useState(false);
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      bg={colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird}
      borderRadius="20px"
      p={{ base: 4, md: 10 }}
      boxShadow="sm"
      position="relative"
      overflow="hidden"
    >
      {/* Favorite Icon */}
      <IconButton
        onClick={() => setFav(!fav)}
        variant="ghost"
        aria-label="Add to favorites"
        position="absolute"
        top="4"
        right="4"
        color={
          fav ? "red.400" : colorMode === "dark" ? "whiteAlpha.800" : "gray.700"
        }
        _hover={{ color: "red.400" }}
        bg={
          fav
            ? colorMode === "dark"
              ? colors.dark.bgSecond
              : colors.light.bgSecond
            : colorMode === "dark"
            ? colors.dark.bgThird
            : colors.light.bgThird
        }
        borderRadius={"16px"}
        border={`1px solid ${colors.light.textSub}`}
      >
        <FiHeart fill={fav ? "#FA2C23" : "none"} />
      </IconButton>

      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        gap={{ base: 4, md: 6 }}
      >
        {/* Left: Chef Image */}
        <Image
          src={users?.avatar_url || "/default-avatar.png"}
          alt="Chef Avatar"
          borderRadius="full"
          boxSize={{ base: "100px", md: "150px" }}
          objectFit="cover"
          mr={{ base: 4, md: 0 }}
          mb={{ base: 0, md: 3 }}
          border={`3px solid ${colors.light.mainFixed}`}
        />

        {/* Right: Content */}
        <Box flex="1">
          <Flex align="center" flexWrap="wrap" gap={{ base: 2, md: 5 }}>
            <Text
              fontSize={{ base: "lg", md: "2xl" }}
              fontWeight="bold"
              color={
                colorMode == "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            >
              {kitchen_name || "Chef Name"}
            </Text>
            {/* check status */}
            {is_available ? (
              <Badge
                bg={
                  colorMode === "light"
                    ? colors.light.success20a
                    : colors.dark.success20a
                }
                borderRadius="8px"
                fontSize={{ base: "xs", md: "sm" }}
                px={3}
                py={1}
              >
                <Status.Root
                  colorPalette="green"
                  color={
                    colorMode === "light"
                      ? colors.light.success
                      : colors.dark.success
                  }
                >
                  <Status.Indicator
                    bg="green.400"
                    boxShadow="0 0 12px 2px #2EB200"
                    filter="blur(0.5px)"
                  />
                  Available Now
                </Status.Root>
              </Badge>
            ) : (
              <Badge
                bg={
                  colorMode === "light"
                    ? colors.light.error20a
                    : colors.dark.error20a
                }
                borderRadius="8px"
                fontSize={{ base: "xs", md: "sm" }}
                px={3}
                py={1}
                color={
                  colorMode === "light" ? colors.light.error : colors.dark.error
                }
              >
                <RxCross2 size={20} />
                Closed Now
              </Badge>
            )}
          </Flex>

          {/* Info Row */}
          {isSmallScreen ? (
            <Stack spacing={1} mt={2}>
              <Flex align="center" gap={2}>
                <Icon
                  as={FaStar}
                  color={
                    colorMode == "light"
                      ? colors.light.warning
                      : colors.dark.warning
                  }
                />
                <Text
                  fontSize="sm"
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {avg_rating || 0}({total_reviews || "0"} Reviews)
                </Text>
                <Icon
                  as={FaPhoneAlt}
                  color={
                    colorMode == "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                />
                <Text
                  fontSize="sm"
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {users?.phone || "no number"}
                </Text>
              </Flex>

              <Flex align="center" gap={2}>
                <Icon
                  as={MdAlternateEmail}
                  color={
                    colorMode == "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                />
                <Text
                  fontSize="sm"
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {users?.email || "no email"}
                </Text>
                <Icon
                  as={FaClock}
                  color={
                    colorMode == "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                />
                <Text
                  fontSize="sm"
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {start_time || "00:00"} AM - {end_time || "00:00"} PM
                </Text>
              </Flex>
            </Stack>
          ) : (
            <Flex
              align="center"
              mt={2}
              gap={5}
              wrap="wrap"
              fontSize="sm"
              color="gray.700"
            >
              <Flex align="center" gap={2}>
                <Icon
                  as={FaStar}
                  color={
                    colorMode == "light"
                      ? colors.light.warning
                      : colors.dark.warning
                  }
                />
                <Text
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {avg_rating || 0}({total_reviews || "0"} Reviews)
                </Text>
              </Flex>
              <Flex align="center" gap={2}>
                <Icon
                  as={MdAlternateEmail}
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                />
                <Text
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {users?.email || "no email"}
                </Text>
              </Flex>
              <Flex align="center" gap={2}>
                <Icon
                  as={FaPhoneAlt}
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                />
                <Text
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {users?.phone || "no number"}
                </Text>
              </Flex>
              <Flex align="center" gap={2}>
                <Icon
                  as={FaClock}
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                />
                <Text
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {start_time || "00:00"} AM - {end_time || "00:00"} PM
                </Text>
              </Flex>
            </Flex>
          )}

          {/* Bio */}
          <Text
            mt={3}
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="light"
            color={
              colorMode === "light" ? colors.light.textSub : colors.dark.textSub
            }
            lineHeight="1.6"
          >
            {bio ||
              "This kitchen offers modern, home-style meals cooked with passion and served fresh every day."}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default ChefProfileCard;
