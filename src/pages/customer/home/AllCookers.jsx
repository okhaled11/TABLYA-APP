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
import { useGetAllCookersQuery } from "../../../app/features/Customer/CookersApi.js";
import ChefCardSkelaton from "../../../components/ui/ChefCardSkelaton.jsx";

const AllCookers = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const { data: cookers, isLoading, error } = useGetAllCookersQuery();
  const [query, setQuery] = useState("");
  // console.log("Cookers Data:", cookers);

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
                placeholder="Search"
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

          <Text
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="bold"
            color={
              colorMode === "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
          >
            All Cookers
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
                    const kitchen = (c.kitchen_name || "").toLowerCase();
                    const owner = (c.users?.name || "").toLowerCase();
                    return kitchen.includes(q) || owner.includes(q);
                  })
                : [];
              if (list.length === 0) {
                return (
                  <Text gridColumn={{ base: "1 / -1" }} textAlign="center">
                    No results found
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
