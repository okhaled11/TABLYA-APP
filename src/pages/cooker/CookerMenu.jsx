import { Box, Heading, Text } from "@chakra-ui/react";

const CookerMenu = () => {
  return (
    <Box py={6}>
      <Heading size="lg" mb={4}>
        My Menu
      </Heading>
      <Text color="gray.500">
        Manage your dishes and menu items here.
      </Text>
      {/* Add your menu management components here */}
    </Box>
  );
};

export default CookerMenu;
