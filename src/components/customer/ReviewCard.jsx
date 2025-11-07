import { Card, Flex, Text, Box, Avatar } from "@chakra-ui/react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { formatDate } from "../../utils";

const ReviewCard = ({ rating = 0, comment, created_at, customers }) => {
  const { colorMode } = useColorMode();

  //to make stars
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) stars.push(<FaStar key={i} color="#FF861F" />);
      else stars.push(<FaRegStar key={i} color="#FF861F" />);
    }
    return stars;
  };
  const { day, month, year } = formatDate(created_at);
  return (
    <Card.Root
      direction="column"
      overflow="hidden"
      // maxW="100%"
      flex={1}
      border="none"
      borderRadius="20px"
      p={4}
      bg={colorMode === "light" ? colors.light.bgFourth : colors.dark.bgFourth}
    >
      <Text
        fontSize="md"
        fontWeight="light"
        mb={3}
        color={
          colorMode === "light" ? colors.light.textMain : colors.dark.textMain
        }
      >
        {comment}
      </Text>

      <Box
        h="1px"
        w="100%"
        bg={
          colorMode === "light"
            ? colors.light.textMain10a
            : colors.dark.textMain10a
        }
        mb={3}
      />

      <Flex justify="space-between" align="center">
        <Flex align="center" gap={3}>
          <Avatar.Root>
            <Avatar.Fallback name="avater" />
            <Avatar.Image
              src={
                customers?.user?.avatar_url ||
                `https://bit.ly/${customers?.user?.name}`
              }
            />
          </Avatar.Root>
          <Flex direction="column" alignItems="flex-start">
            <Text
              fontSize="sm"
              fontWeight="medium"
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            >
              {customers?.user?.name}
            </Text>

            <Text
              fontSize="xs"
              fontWeight="light"
              color={
                colorMode === "light"
                  ? colors.light.textSub
                  : colors.dark.textSub
              }
            >
              {day}/{month}/{year}
            </Text>
          </Flex>
        </Flex>

        {/* النجوم */}
        <Flex gap={1}>{renderStars()}</Flex>
      </Flex>
    </Card.Root>
  );
};

export default ReviewCard;
