import { Box, Heading, Text } from "@chakra-ui/react";

const CookerOrders = () => {
  return (
    <Box py={6}>
      <Heading size="lg" mb={4}>
        Orders
      </Heading>
      <Text color="gray.500">
        View and manage your customer orders here.
      </Text>
      {/* Add your orders management components here */}
    </Box>
  );
};

export default CookerOrders;
