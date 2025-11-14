import { Box, Heading } from "@chakra-ui/react";
import colors from "../../../theme/color";
import { useColorMode } from "../../../theme/color-mode";
import CookerStatistics from "../../../components/cooker/CookerStatistics";
const CookerHome = () => {
  const { colorMode } = useColorMode();
  return (
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
      {/* statistics */}
      <CookerStatistics />
      {/* Add your dashboard components here */}
    </Box>
  );
};

export default CookerHome;
