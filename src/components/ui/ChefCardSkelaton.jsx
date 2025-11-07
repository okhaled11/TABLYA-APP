import {
  Box,
  Card,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";

const ChefCardSkelaton = () => {
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
      w="full"
    >
      {/* Fav Icon */}
      <IconButton
        variant="ghost"
        aria-label="Add to favorites"
        position="absolute"
        top="4"
        right="4"
        borderRadius="16px"
        isDisabled
      >
        <FiHeart />
      </IconButton>

      {/* Avatar */}
      <SkeletonCircle
        size={{ base: "24", md: "32" }}
        mr={{ base: 4, md: 0 }}
        mb={{ base: 0, md: 3 }}
      />

      {/* Info */}
      <Box flex="1" w="full">
        <Skeleton
          height="20px"
          mb="2"
          width={{ base: "60%", md: "70%" }}
          mx="auto"
        />
        <Flex
          alignItems="center"
          justifyContent={{ base: "flex-start", md: "center" }}
          gap="2"
          mb="3"
        >
          <Skeleton height="18px" width="40px" />
          <Skeleton height="18px" width="80px" />
        </Flex>
        <SkeletonText
          noOfLines={2}
          spacing="2"
          width={{ base: "80%", md: "90%" }}
          mx="auto"
          mb="4"
        />
        <Skeleton
          height="36px"
          width={{ base: "110px", md: "135px" }}
          mx="auto"
          borderRadius="12px"
        />
      </Box>
    </Card.Root>
  );
};

export default ChefCardSkelaton;
