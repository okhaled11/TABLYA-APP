import {
  Box,
  Button,
  Card,
  Flex,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { Link } from "react-router-dom";

const ChefCard = ({ avg_rating, user_id, users,total_reviews }) => {
  const { colorMode } = useColorMode();
  const [fav, setFav] = useState(false);
  return (
    <Card.Root
      maxW="md"
      p={5}
      borderRadius="22px"
      boxShadow="sm"
      position="relative"
      display="flex"
      flexDirection={{ base: "row", md: "column" }}
      alignItems="center"
      textAlign={{ base: "left", md: "center" }}
      bg={colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird}
      backdropFilter="blur(6px)"
      border="none"
      borderColor={
        colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
      }
      transition="0.3s ease"
      _hover={{
        transform: "scale(1.02)",
        boxShadow: "md",
        border: "1px solid red",
      }}
    >
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

      <Box flex="1">
        <Text
          fontWeight="semibold"
          fontSize={{ base: "lg", md: "2xl" }}
          mb="1"
          color={
            colorMode == "light" ? colors.light.textMain : colors.dark.textMain
          }
        >
          {users?.name || "Chef Name"}
        </Text>
        <Flex
          alignItems="center"
          justifyContent={{ base: "flex-start", md: "center" }}
          gap="1"
          mb="2"
          wrap="wrap"
        >
          <FaStar color="#FF861F" size={20} />
          <Text
            fontWeight="light"
            fontSize="lg"
            color={
              colorMode == "light" ? colors.light.textSub : colors.dark.textSub
            }
          >
            {avg_rating ? avg_rating.toFixed(1) : "0"}
          </Text>
          <Text
            fontSize="lg"
            fontWeight="light"
            color={
              colorMode == "light" ? colors.light.textSub : colors.dark.textSub
            }
          >
            ( {total_reviews || "0"} Reviews )
          </Text>
        </Flex>

        {/* <Text fontSize="sm" color="gray.600" mb="3">
          This kitchen offers modern, home-style meals cooked with passion and
          served fresh every day.
        </Text> */}

        <Button
          as={Link}
          to={`/home/cookers/${user_id}`}
          bg={
            colorMode == "light"
              ? colors.light.mainFixed
              : colors.dark.mainFixed
          }
          color={colors.light.white}
          variant="solid"
          size="sm"
          fontWeight="light"
          fontSize="md"
          w={{ base: "110px", md: "135px" }}
          borderRadius="12px"
          _hover={{ bg: colors.light.mainHover }}
        >
          View Menu
        </Button>
      </Box>
    </Card.Root>
  );
};

export default ChefCard;
