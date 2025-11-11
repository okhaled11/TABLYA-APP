import { Box, Heading, Text } from "@chakra-ui/react";

const CookerReviews = () => {
  return (
    <Box py={6}>
      <Heading size="lg" mb={4}>
        Reviews
      </Heading>
      <Text color="gray.500">
        See what your customers are saying about your food.
      </Text>
      {/* Add your reviews components here */}
    </Box>
  );
};

export default CookerReviews;
