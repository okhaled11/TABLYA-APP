import { Flex, Tabs, Box } from "@chakra-ui/react";
import { LuHouse } from "react-icons/lu";
import { RiFileList3Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa6";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import { useNavigate, useLocation } from "react-router-dom";
import { MdRestaurantMenu } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";

const CookerTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colorMode } = useColorMode();
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/cooker/home") return "Home";
    if (path === "/cooker/menu") return "Menu";
    if (path === "/cooker/orders") return "Orders";
    if (path === "/cooker/reviews") return "Reviews";
    return "Home"; 
  };

  return (
    <Tabs.Root value={getActiveTab()} position="sticky" top={{ base: 20, md: 20 }} zIndex="900" bg={colorMode === "light" ? colors.light.bgMain : colors.dark.bgMain}>
      <Tabs.List >
        <Flex w="100%" justifyContent="center" gap={{ base: 6, md: 6 }}>
          <Tabs.Trigger
            colorPalette={"red"}
            value="Home"
            _selected={{
              color: colors.light.mainFixed,
            }}
            px={{ base: 2, md: 4 }}
            fontSize={{ base: "sm", md: "md" }}
          >
            <Flex alignItems="center" gap={{ base: 1, md: 2 }} onClick={() => navigate("/cooker/home")}>
              <LuHouse size={20} />
              <Box display={{ base: "none", sm: "inline" }}>Home</Box>
            </Flex>
          </Tabs.Trigger>

          <Tabs.Trigger
            value="Menu"
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
              onClick={() => navigate("/cooker/menu")}
            >
              <MdRestaurantMenu size={20} />
              <Box display={{ base: "none", sm: "inline" }}>Menu</Box>
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="Orders"
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
              onClick={() => navigate("/cooker/orders")}
            >
              <RiFileList3Line size={20} />
              <Box display={{ base: "none", sm: "inline" }}>Orders</Box>
            </Flex>
          </Tabs.Trigger>

          <Tabs.Trigger
            value="Reviews"
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
              onClick={() => navigate("/cooker/reviews")}
            >
              <FaRegStar size={20} />
              <Box display={{ base: "none", sm: "inline" }}>Reviews</Box>
            </Flex>
          </Tabs.Trigger>
        </Flex>
      </Tabs.List>
    </Tabs.Root>
  );
};

export default CookerTabs;
