import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import CookerStaticsCard from "../cooker/CookerStaticsCard";
import { RiFileList3Fill } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { PiMoneyWavyFill } from "react-icons/pi";

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
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          <CookerStaticsCard
            title="Active Deliveries"
            value={"3"}
            icon={TbTruckDelivery}
            // subtext={`Currently assigned`}
            iconBg={
              colorMode === "light"
                ? colors.light.warning10a
                : colors.dark.warning10a
            }
            iconColor={
              colorMode === "light" ? colors.light.warning : colors.dark.warning
            }
          />
          <CookerStaticsCard
            title="Completed Today"
            value={"34"}
            icon={BsFillBoxSeamFill}
            iconBg={
              colorMode === "light"
                ? colors.light.success10a
                : colors.dark.success10a
            }
            iconColor={
              colorMode === "light" ? colors.light.success : colors.dark.success
            }
          />
          <CookerStaticsCard
            title="Earnings Today"
            value={"345"}
            icon={PiMoneyWavyFill}
            iconBg={
              colorMode === "light" ? colors.light.info10a : colors.dark.info10a
            }
            iconColor={
              colorMode === "light" ? colors.light.info : colors.dark.info
            }
          />
        </SimpleGrid>
      </Box>
    </>
  );
};

export default DeliveryStatistics;
