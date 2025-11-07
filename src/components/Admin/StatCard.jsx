import { Flex, Box, Stack, Text } from "@chakra-ui/react";
import React from "react";
export default function StatCard({ icon, iconBg, iconColor, label, value, valueColor,backgroundColor }) {
  return (
    <Stack
      
     
      h="100%"
      border={"none"}
     
      w="auto"
      background={backgroundColor}
      direction="row"
      borderWidth="1px"
      borderRadius="xl"
      p={5}
      align="center"
      shadow="sm"
      transition="transform 0.3s ease"
      _hover={{ transform: "scale(1.03)" }}
    >
      <Flex>
        <Box
          bg={iconBg}
          p={2}
          borderRadius="lg"
          mr={5}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {React.createElement(icon, { color: iconColor, size: 50 })}
        </Box>
      </Flex>
      <Flex direction="column" justify="center">
        <Text fontSize="sm" color="gray.500">
          {label}
        </Text>
        <Text
          fontSize="3xl"
          fontWeight="bold"
          mt={2}
          color={valueColor}
          textAlign="start"
        >
          {value}
        </Text>
      </Flex>
    </Stack>
  );
}

