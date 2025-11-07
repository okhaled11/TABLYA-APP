import {
  Card,
  Flex,
  Box,
  Skeleton,
  SkeletonCircle,
  VStack,
} from "@chakra-ui/react";

const ReviewCardSkeleton = () => {
  return (
    <Card.Root
      direction="column"
      overflow="hidden"
      maxW="80%"
      border="none"
      borderRadius="20px"
      p={4}
    >
      {/* comment placeholder */}
      <Skeleton height="20px" mb={3} />

      {/* divider */}
      <Box h="1px" w="100%" bg="gray.200" mb={3} />

      {/* footer with avatar and stars */}
      <Flex justify="space-between" align="center">
        <Flex align="center" gap={3}>
          <SkeletonCircle size="10" />
          <VStack align="flex-start" spacing={1}>
            <Skeleton height="14px" width="80px" />
            <Skeleton height="12px" width="50px" />
          </VStack>
        </Flex>

        {/* stars placeholder */}
        <Flex gap={1}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height="14px" width="14px" borderRadius="2px" />
          ))}
        </Flex>
      </Flex>
    </Card.Root>
  );
};

export default ReviewCardSkeleton;
