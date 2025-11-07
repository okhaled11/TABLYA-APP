import ChefCard from "../../../components/customer/ChefCard.jsx";
import { Container, Grid, Flex, Text } from "@chakra-ui/react";
import { useColorMode } from "../../../theme/color-mode.jsx";
import colors from "../../../theme/color.js";
import { Link, Outlet } from "react-router-dom";
import { useGetTopCookersQuery } from "../../../app/features/Customer/CookersApi.js";
import ChefCardSkelaton from "../../../components/ui/ChefCardSkelaton.jsx";
const CustomerHome = () => {
  const { colorMode } = useColorMode();
  const { data: cookers, isLoading, error } = useGetTopCookersQuery();
  // console.log(cookers);

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
            Top Cookers
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
            View All Cookers
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
            <Text>Error loading cookers.</Text>
          ) : (
            cookers?.map((cooker) => (
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
