import React from "react";
import { Card, CardBody, Flex, Text, Box, VStack } from "@chakra-ui/react";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";

const CookerStaticsCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  iconBg,
  iconColor,
}) => {
  const { colorMode } = useColorMode();

  return (
    <Card.Root
      bg={colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird}
      borderRadius="xl"
      h="100%"
      border={"none"}
    //   shadow="sm"
      transition="transform 0.3s ease"
      _hover={{ transform: "scale(1.03)" }}
    >
      <CardBody>
        <Flex direction="column" justifyContent="space-between">
          <Text color={colorMode === "light" ? "gray.600" : "gray.400"} fontSize="15px">
            {title}
          </Text>
            <Box h="1px" w="100%"  bg={colorMode=="light"?colors.light.textMain10a:colors.dark.textMain10a}></Box>
            <Flex direction>

            </Flex>
          <Flex justifyContent="space-between" w="100%" align="center" mt={2}>
            <Text fontWeight="bold" fontSize="20px" 
      color={colorMode === "light" ? colors.light.textMain : colors.dark.textMain}

            >
              {value}
            </Text>
            <Box
              bg={iconBg}
              w="40px"
              h="40px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius="10px"
            >
              {Icon ? <Icon size="25px" color={iconColor} /> : null}
            </Box>
          </Flex>
          {subtext ? (
            <Text fontSize="12px" color={colorMode === "light" ? colors.light.textSub : colors.dark.textSub}>
              {subtext}
            </Text>
          ) : null}

        </Flex>
      </CardBody>
    </Card.Root>
  );
};

export default CookerStaticsCard;
