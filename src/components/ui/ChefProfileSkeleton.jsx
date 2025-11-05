import {
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  useBreakpointValue,
} from "@chakra-ui/react";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";

const ChefProfileCardSkeleton = () => {
  const { colorMode } = useColorMode();
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
      {/* Favorite Icon Skeleton */}
      <SkeletonCircle
        size="8"
        position="absolute"
        top="4"
        right="4"
        startColor={colorMode === "light" ? "gray.100" : "whiteAlpha.200"}
        endColor={colorMode === "light" ? "gray.300" : "whiteAlpha.400"}
      />

      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        gap={{ base: 4, md: 6 }}
      >
        {/* Image Skeleton */}
        <SkeletonCircle
          boxSize={{ base: "100px", md: "150px" }}
          startColor={colorMode === "light" ? "gray.100" : "whiteAlpha.200"}
          endColor={colorMode === "light" ? "gray.300" : "whiteAlpha.400"}
        />

        {/* Right Side Skeletons */}
        <Box flex="1" w="full">
          {/* Title + Badge Skeleton */}
          <Flex align="center" gap={4}>
            <Skeleton
              height="20px"
              width={{ base: "150px", md: "250px" }}
              borderRadius="md"
              startColor={colorMode === "light" ? "gray.100" : "whiteAlpha.200"}
              endColor={colorMode === "light" ? "gray.300" : "whiteAlpha.400"}
            />
            <Skeleton
              height="20px"
              width={{ base: "80px", md: "100px" }}
              borderRadius="full"
              startColor={colorMode === "light" ? "gray.100" : "whiteAlpha.200"}
              endColor={colorMode === "light" ? "gray.300" : "whiteAlpha.400"}
            />
          </Flex>

          {/* Info Rows */}
          <Flex
            mt={4}
            direction={isSmallScreen ? "column" : "row"}
            gap={isSmallScreen ? 2 : 5}
          >
            {Array(4)
              .fill("")
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height="16px"
                  width={isSmallScreen ? "80%" : "160px"}
                  borderRadius="md"
                  startColor={
                    colorMode === "light" ? "gray.100" : "whiteAlpha.200"
                  }
                  endColor={
                    colorMode === "light" ? "gray.300" : "whiteAlpha.400"
                  }
                />
              ))}
          </Flex>

          {/* Bio Skeleton */}
          <Box mt={4}>
            <SkeletonText
              mt="4"
              noOfLines={3}
              spacing="3"
              skeletonHeight="3"
              startColor={colorMode === "light" ? "gray.100" : "whiteAlpha.200"}
              endColor={colorMode === "light" ? "gray.300" : "whiteAlpha.400"}
            />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default ChefProfileCardSkeleton;
