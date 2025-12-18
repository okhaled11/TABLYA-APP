import { Flex, Tabs } from "@chakra-ui/react";
import { LuHouse } from "react-icons/lu";
import { RiFileList3Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa6";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

const CustomerTabs = () => {
  const { t, i18n } = useTranslation();
  const {colorMode} = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/home") return "Home";
    if (path === "/home/order" || path.startsWith("/home/details")) return "Orders";
    if (path === "/home/favourities") return "favourities";
    return "Home"; 
  };

  return (
    <Tabs.Root value={getActiveTab()} position="sticky" top={{ base: 20, md: 20 }} zIndex="900" bg={colorMode === "light" ? colors.light.bgMain : colors.dark.bgMain}>
      <Tabs.List dir={i18n.dir()}>
        <Flex w="100%" justifyContent="center" gap={6}>
          <Tabs.Trigger
            colorPalette={"red"}
            value="Home"
            _selected={{
              color: colors.light.mainFixed,
            }}
          >
            <Flex alignItems="center" gap={1} onClick={() => navigate("/home")}>
              <LuHouse size={20} />
              {t("customerTabs.home")}
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
              onClick={() => navigate("/home/order")}
            >
              <RiFileList3Line size={20} />
              {t("customerTabs.orders")}
            </Flex>
          </Tabs.Trigger>

          <Tabs.Trigger
            value="favourities"
            colorPalette={"red"}
            _selected={{
              color: colors.light.mainFixed,
            }}
          >
            <Flex
              alignItems="center"
              gap={1}
              onClick={() => navigate("/home/favourities")}
            >
              <FaRegHeart size={20} />
              {t("customerTabs.favourites")}
            </Flex>
          </Tabs.Trigger>
        </Flex>
      </Tabs.List>
    </Tabs.Root>
  );
};

export default CustomerTabs;
