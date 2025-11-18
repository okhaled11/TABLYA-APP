import { Box, Heading } from "@chakra-ui/react";
import colors from "../../../theme/color";
import { useColorMode } from "../../../theme/color-mode";
import CookerStatistics from "../../../components/cooker/CookerStatistics";
import { CookerAnalytics } from "../../../components/Cooker/CookerAnalytics";
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
      <Heading
        size="lg"
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="bold"
        my={4}
        color={
          colorMode == "light" ? colors.light.textMain : colors.dark.textMain
        }
      >
        Analytics
      </Heading>
      <CookerAnalytics />
    </Box>
  );
};

export default CookerHome;
