import { Container, Flex, Tabs } from "@chakra-ui/react";
import { LuHouse } from "react-icons/lu";
import { RiFileList3Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa6";
import colors from "../../theme/color";
import CustomerHome from "../../pages/customer/home/CustomerHome";
import CustomerFavourite from "../../pages/customer/CustomerFavourite";
import { useLocation, useNavigate } from "react-router-dom";

const CustomerTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isCookersPage = location.pathname.startsWith("/home/cookers");

  return (
    <Tabs.Root defaultValue="Home">
      <Tabs.List>
        <Flex w="100%" justifyContent="center" gap={6}>
          <Tabs.Trigger
            colorPalette={"red"}
            value="Home"
            _selected={{
              color: colors.light.mainFixed,
            }}
          >
            <Flex alignItems="center" gap={1}>
              <LuHouse size={20} />
              Home
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
              Orders
            </Flex>
          </Tabs.Trigger>

          <Tabs.Trigger
            value="favourities"
            colorPalette={"red"}
            _selected={{
              color: colors.light.mainFixed,
            }}
          >
            <Flex alignItems="center" gap={1}>
              <FaRegHeart size={20} />
              Favourites
            </Flex>
          </Tabs.Trigger>
        </Flex>
      </Tabs.List>

      <Tabs.Content value="Home">
        {!isCookersPage && <CustomerHome />}
      </Tabs.Content>
      <Tabs.Content value="favourities">
        <CustomerFavourite />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default CustomerTabs;
