import { Flex, Tabs, Box } from "@chakra-ui/react";
import { RiFileList3Line } from "react-icons/ri";
import { FaArrowTrendUp, FaRegHeart } from "react-icons/fa6";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import { useNavigate, useLocation } from "react-router-dom";


const DeliveryTabs = () => {
  const {colorMode} = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/delivery/orders") return "Orders";
    if (path === "/delivery/Statistics") return "Statistics";
    return "Orders"; 
  };

  return (
    <Tabs.Root value={getActiveTab()} position="sticky" top={{ base: 20, md: 20 }} zIndex="900" bg={colorMode === "light" ? colors.light.bgMain : colors.dark.bgMain}>
      <Tabs.List>
        <Flex w="100%" justifyContent="center" gap={{ base: 6, md: 6 }}>
          <Tabs.Trigger
            colorPalette={"red"}
            value="Orders"
            _selected={{
              color: colors.light.mainFixed,
            }}
            px={{ base: 2, md: 4 }}
            fontSize={{ base: "sm", md: "md" }}
          >
            <Flex
              alignItems="center"
              gap={{ base: 1, md: 2 }}
              onClick={() => navigate("/delivery/orders")}
            >
              <RiFileList3Line size={20} />

              <Box >Orders</Box>
            </Flex>
          </Tabs.Trigger>

          <Tabs.Trigger
            value="Statistics"
            colorPalette={"red"}
            _selected={{
              color: colors.light.mainFixed,
            }}
            px={{ base: 2, md: 4 }}
            fontSize={{ base: "sm", md: "md" }}
          >
            <Flex
              alignItems="center"
              gap={{ base: 1, md: 2 }}
              onClick={() => navigate("/delivery/Statistics")}
            >
              <FaArrowTrendUp size={20}/>
              <Box >Statistics</Box>
            </Flex>
          </Tabs.Trigger>
        </Flex>
      </Tabs.List>
    </Tabs.Root>
  );
};

export default DeliveryTabs;
