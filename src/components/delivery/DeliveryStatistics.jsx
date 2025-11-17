import { Box, Heading } from "@chakra-ui/react";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";

const DeliveryStatistics = () => {
  const { colorMode } = useColorMode();

  return (
    <>
      <Box py={6}>
        <Heading
          size="lg"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          my={4}
          color={
            colorMode == "light" ? colors.light.textMain : colors.dark.textMain
          }
        >
          Statistics
        </Heading>
        {/* 
                  constent here
            */}
      </Box>
    </>
  );
};

export default DeliveryStatistics;
