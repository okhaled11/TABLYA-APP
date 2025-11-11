import { Box, Heading, Text } from "@chakra-ui/react";

const CookerHome = () => {
  return (
    <Box py={6}>
      <Heading size="lg" mb={4}>
        Dashboard
      </Heading>
      <Text color="gray.500">
        Welcome to your cooker dashboard. Manage your kitchen operations here.
      </Text>
      {/* Add your dashboard components here */}
    </Box>
  );
};

export default CookerHome;
