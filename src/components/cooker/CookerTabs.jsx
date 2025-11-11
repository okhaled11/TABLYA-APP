import { Flex, Tabs } from "@chakra-ui/react";
import { LuHouse } from "react-icons/lu";
import { RiFileList3Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa6";
import colors from "../../theme/color";
import { useNavigate, useLocation } from "react-router-dom";
import { MdRestaurantMenu } from "react-icons/md";

const CookerTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/cooker/home") return "Home";
    if (path === "/cooker/menu") return "Menu";
    if (path === "/cooker/orders") return "Orders";
    if (path === "/cooker/reviews") return "Reviews";
    return "Home"; 
  };

  return (
    <Tabs.Root value={getActiveTab()}>
      <Tabs.List>
        <Flex w="100%" justifyContent="center" gap={6}>
          <Tabs.Trigger
            colorPalette={"red"}
            value="Home"
            _selected={{
              color: colors.light.mainFixed,
            }}
          >
            <Flex alignItems="center" gap={1} onClick={() => navigate("/cooker/home")}>
              <LuHouse size={20} />
              Home
            </Flex>
          </Tabs.Trigger>

          <Tabs.Trigger
            value="Menu"
            colorPalette={"red"}
            _selected={{
              color: colors.light.mainFixed,
            }}
          >
            <Flex
              alignItems="center"
              gap={1}
              onClick={() => navigate("/cooker/menu")}
            ><MdRestaurantMenu size={20} />
              Menu
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="Orders"
            colorPalette={"red"}
            _selected={{
              color: colors.light.mainFixed,
            }}
          >
            <Flex
              alignItems="center"
              gap={1}
              onClick={() => navigate("/cooker/orders")}
            >
              <RiFileList3Line size={20} />
              Orders
            </Flex>
          </Tabs.Trigger>

          <Tabs.Trigger
            value="Reviews"
            colorPalette={"red"}
            _selected={{
              color: colors.light.mainFixed,
            }}
          >
            <Flex
              alignItems="center"
              gap={1}
              onClick={() => navigate("/cooker/reviews")}
            >
              <FaRegHeart size={20} />
              Reviews
            </Flex>
          </Tabs.Trigger>
        </Flex>
      </Tabs.List>
    </Tabs.Root>
  );
};

export default CookerTabs;
