import ChefCard from "../../../components/customer/ChefCard.jsx";
import {
  Container,
  Grid,
  Flex,
  Text,
  Box,
  Icon,
  IconButton,
  InputGroup,
  Input,
} from "@chakra-ui/react";
import { useColorMode } from "../../../theme/color-mode.jsx";
import colors from "../../../theme/color.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useGetAllCookersQuery, useGetCustomerCityQuery } from "../../../app/features/Customer/CookersApi.js";
import ChefCardSkelaton from "../../../components/ui/ChefCardSkelaton.jsx";

const AllCookers = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const { data: cookers, isLoading, error, isError } = useGetAllCookersQuery();
  const { data: customerCity, error: cityError } = useGetCustomerCityQuery();
  const [query, setQuery] = useState("");

  // Check city field in each cooker
  if (cookers && Array.isArray(cookers)) {
    cookers.forEach((c, index) => {
      const cityTrimmed = (c.city || "").trim();
    });
    
    // Show filtered cookers
    const filtered = cookers.filter((c) => {
      if (customerCity) {
        const cookerCity = (c.city || "").trim();
        const normalizedCustomerCity = customerCity.trim();
        if (cookerCity === "null" || cookerCity === "" || 
            cookerCity.toLowerCase() !== normalizedCustomerCity.toLowerCase()) {
          return false;
        }
      }
      return true;
    });
  }

  const handleBackBtn = () => {
    navigate(-1);
  };
  return (
    <>
      <Container align="center">
        <Flex
          mt={{ base: "0", md: "5" }}
          align="center"
          justifyContent="space-between"
          direction="row"
          textAlign="center"
          w="100%"
          mb={{ base: "0", md: "6" }}
          gap={{ base: 3, md: 0 }}
        >
          <IconButton
            onClick={handleBackBtn}
            variant="ghost"
            aria-label="Back"
            colorScheme="gray"
            size={{ base: "md", md: "lg" }}
            alignSelf={{ base: "flex-start", md: "center" }}
          >
            <Icon as={FiArrowLeft} boxSize={6} />
          </IconButton>

          {/* search */}
          <Flex
            flex="1"
            maxW={"400px"}
            ml="140px"
            mr="10px"
            justifyContent="center"
            display={{ base: "none", md: "flex" }}
          >
            <InputGroup
              startElement={
                <FiSearch
                  fill={
                    colorMode == "light"
                      ? colors.light.white10a
                      : colors.dark.white10a
                  }
                />
              }
            >
              <Input
                placeholder={t('customer.allChefs.searchPlaceholder')}
                bg={
                  colorMode == "light"
                    ? colors.light.white10a
                    : colors.dark.white10a
                }
                borderRadius="12px"
                size="md"
                _placeholder={{ color: "#fffff" }}
                // color="white"
                border="2px solid #fffff"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </InputGroup>
          </Flex>

          <Text fontSize="xl" fontWeight="bold">
            {t('customer.allChefs.title')}
          </Text>

          {/* <Box w={{ base: "0", md: "70px" }} /> */}
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
            (() => {
              const q = query.trim().toLowerCase();
              const list = Array.isArray(cookers)
                ? cookers.filter((c) => {
                    // First: Filter by city (must match if customerCity exists)
                    if (customerCity) {
                      const cookerCity = (c.city || "").trim(); // Remove spaces
                      const normalizedCustomerCity = customerCity.trim();
                      
                      // Skip if city is "null" string or doesn't match
                      if (cookerCity === "null" || cookerCity === "" || 
                          cookerCity.toLowerCase() !== normalizedCustomerCity.toLowerCase()) {
                        return false;
                      }
                    }
                    
                    // Second: Filter by search query (only if query exists)
                    if (q) {
                      const kitchen = (c.kitchen_name || "").toLowerCase();
                      const owner = (c.users?.name || "").toLowerCase();
                      return kitchen.includes(q) || owner.includes(q);
                    }
                    
                    // If no query, show all cookers from the same city
                    return true;
                  })
                : [];
              if (list.length === 0) {
                return (
                  <Text textAlign="center" fontSize="lg" color="gray.500">
                    {t('customer.allChefs.noChefsFound')}
                  </Text>
                );
              }
              return list.map((cooker) => (
                <ChefCard key={cooker.user_id} {...cooker} />
              ));
            })()
          )}
        </Grid>
      </Container>
    </>
  );
};

export default AllCookers;
