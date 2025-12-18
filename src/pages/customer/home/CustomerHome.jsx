import ChefCard from "../../../components/customer/ChefCard.jsx";
import { Container, Grid, Flex, Text } from "@chakra-ui/react";
import { useColorMode } from "../../../theme/color-mode.jsx";
import colors from "../../../theme/color.js";
import { Link, Outlet } from "react-router-dom";
import { useGetTopCookersQuery, useGetCustomerCityQuery } from "../../../app/features/Customer/CookersApi.js";
import ChefCardSkelaton from "../../../components/ui/ChefCardSkelaton.jsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";


const CustomerHome = () => {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const { data: cookers, isLoading, error, isError } = useGetTopCookersQuery();
  const { data: customerCity, error: cityError } = useGetCustomerCityQuery();

  // Filter cookers by customer's city
  const filteredCookers = useMemo(() => {
    if (!cookers || !Array.isArray(cookers)) return [];
    
    // If customer has a city, filter by it
    if (customerCity) {
      return cookers.filter((cooker) => {
        const cookerCity = (cooker.city || "").trim(); // Remove spaces
        const normalizedCustomerCity = customerCity.trim();
        
        // Skip if city is "null" string or empty or doesn't match
        if (cookerCity === "null" || cookerCity === "") {
          return false;
        }
        
        return cookerCity.toLowerCase() === normalizedCustomerCity.toLowerCase();
      });
    }
    
    // If no customer city, show all cookers
    return cookers;
  }, [cookers, customerCity]);

  return (
    <>
      <Container align="center">
        <Flex mt={10} align="center" justifyContent="space-between" w="100%">
          <Text
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="bold"
            color={
              colorMode == "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
          >
            {t("customerHome.topCookers")}
          </Text>
          <Text
            as={Link}
            to="/home/cookers"
            fontSize={{ base: "md", md: "xl" }}
            fontWeight="medium"
            color={
              colorMode == "light"
                ? colors.light.mainFixed
                : colors.dark.mainFixed
            }
            cursor="pointer"
            transition="0.3s ease"
            _hover={{ textDecoration: "underline" }}
          >
            {t("customerHome.viewAll")}
          </Text>
        </Flex>
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }}
          gap={6}
          py={8}
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <ChefCardSkelaton key={index} />
            ))
          ) : error ? (
            <Text>{t("customerHome.error")}</Text>
          ) : filteredCookers.length === 0 ? (
            <Text gridColumn={{ base: "1 / -1" }} textAlign="center">
              {customerCity 
                ? t("customerHome.noCookersInCity", { city: customerCity })
                : t("customerHome.noCookers")}
            </Text>
          ) : (
            filteredCookers.map((cooker) => (
              <ChefCard key={cooker.user_id} {...cooker} />
            ))
          )}
        </Grid>
      </Container>
      <Outlet />
    </>
  );
};

export default CustomerHome;
