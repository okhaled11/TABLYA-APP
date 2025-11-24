import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../services/supabaseClient";
import {
  Box,
  Grid,
  Heading,
  Text,
  VStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { useGetFavoriteCookersByCustomerQuery } from "../../app/features/Customer/favoritesApi";
import { useGetCookersByIdsQuery } from "../../app/features/Customer/CookersApi";
import ChefCard from "../../components/customer/ChefCard";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { FaHeart } from "react-icons/fa";
const CustomerFavourite = () => {
  const { colorMode } = useColorMode();
  const customerIdFromRedux = useSelector((s) => s.auth?.userData?.user?.id);
  const [customerIdFromSupabase, setCustomerIdFromSupabase] = useState(null);

  useEffect(() => {
    if (!customerIdFromRedux) {
      supabase.auth.getUser().then(({ data }) => {
        const id = data?.user?.id || null;
        if (id) setCustomerIdFromSupabase(id);
      });
    }
  }, [customerIdFromRedux]);

  const customerId = customerIdFromRedux || customerIdFromSupabase;

  // load favourite cooker ids for this customer (do not refetch on mount to avoid flicker)
  const favQuery = useGetFavoriteCookersByCustomerQuery(customerId, {
    skip: !customerId,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
  });
  const favouriteIds = favQuery.data || []; // keep showing cached data if available

  // fetch cookers details by ids (skip until we have favouriteIds)
  const cookersQuery = useGetCookersByIdsQuery(favouriteIds, {
    skip: !customerId || favouriteIds.length === 0,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
  });
  const cookers = cookersQuery.data || []; // keep showing cached data if available

  // pending only on true initial load (skeleton). When refetching, keep showing cached UI.
  const isPending = useMemo(() => {
    if (!customerId) return true;
    const initialFavLoad = favQuery.isLoading && !favQuery.data;
    const initialCookersLoad =
      favouriteIds.length > 0 && cookersQuery.isLoading && !cookersQuery.data;
    return initialFavLoad || initialCookersLoad;
  }, [
    customerId,
    favQuery.isLoading,
    favQuery.data,
    favouriteIds.length,
    cookersQuery.isLoading,
    cookersQuery.data,
  ]);

  return (
    <Box px={{ base: 4, md: 8 }} py={6}>
      <Text
        size="lg"
        mb={6}
        fontWeight="bold"
        fontSize="2xl"
        color={
          colorMode === "light" ? colors.light.textMain : colors.dark.textMain
        }
      >
        My Favourite Chefs
      </Text>

      {isPending && (
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <Box
              key={idx}
              p={4}
              rounded="2xl"
              bg={
                colorMode === "light"
                  ? colors.light.bgThird
                  : colors.dark.bgThird
              }
            >
              <VStack align="stretch" spacing={4}>
                <SkeletonCircle size="16" alignSelf="center" />
                <Skeleton height="16px" />
                <Skeleton height="16px" width="60%" />
                <SkeletonText noOfLines={2} spacing="3" />
              </VStack>
            </Box>
          ))}
        </Grid>
      )}

      {!isPending && favouriteIds.length === 0 && (
        <Box
          bg={
            colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
          }
          rounded={"2xl"}
          p={{ base: 5, md: 10 }}
          my={4}
          textAlign="center"
        >
          <VStack spacing={4}>
            <Box
              p={6}
              rounded="full"
              bg={
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed
              }
              color="white"
            >
              <FaHeart size={40} />
            </Box>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="bold"
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            >
              No Favourite Chefs Yet
            </Text>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color={
                colorMode === "light"
                  ? colors.light.textSecondary
                  : colors.dark.textSecondary
              }
              maxW="md"
            >
              Start exploring our amazing chefs and add them to your favourites
              to see them here!
            </Text>
          </VStack>
        </Box>
      )}

      {!isPending && favouriteIds.length > 0 && cookers.length > 0 && (
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
        >
          {cookers.map((cooker) => (
            <ChefCard
              key={cooker.user_id}
              avg_rating={cooker.avg_rating}
              user_id={cooker.user_id}
              users={cooker.users}
              total_reviews={cooker.total_reviews}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CustomerFavourite;
