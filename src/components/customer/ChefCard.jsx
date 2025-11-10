import {
  Box,
  Button,
  Card,
  Flex,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../services/supabaseClient";
import { toaster } from "../../components/ui/toaster";
import {
  useAddFavoriteCookerMutation,
  useGetFavoriteCookersByCustomerQuery,
  useRemoveFavoriteCookerMutation,
} from "../../app/features/Customer/favoritesApi";
import {
  addFavoriteCooker,
  removeFavoriteCooker,
  setFavoriteCookers,
} from "../../app/features/Customer/favoriteCookersSlice";

const ChefCard = ({
  avg_rating,
  user_id,
  users,
  total_reviews,
  kitchen_name,
}) => {
  const { colorMode } = useColorMode();

  const dispatch = useDispatch();

  // get logged-in user id from Redux; fallback to Supabase session (post-refresh)
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

  // fetch favorite cooker ids for this customer
  const { data: favoriteIds = [] } = useGetFavoriteCookersByCustomerQuery(
    customerId,
    { skip: !customerId }
  );

  useEffect(() => {
    if (favoriteIds?.length >= 0) dispatch(setFavoriteCookers(favoriteIds));
  }, [dispatch, favoriteIds]);

  const isFavGlobal = useSelector((s) =>
    Array.isArray(s.favoriteCookers?.ids)
      ? s.favoriteCookers.ids.includes(user_id)
      : false
  );

  const [fav, setFav] = useState(false);
  useEffect(() => {
    setFav(isFavGlobal);
  }, [isFavGlobal]);

  const [addFav, { isLoading: adding }] = useAddFavoriteCookerMutation();
  const [removeFav, { isLoading: removing }] =
    useRemoveFavoriteCookerMutation();

  const toggling = useMemo(() => adding || removing, [adding, removing]);

  const onToggleFavorite = async () => {
    let activeCustomerId = customerId;
    if (!activeCustomerId) {
      const { data } = await supabase.auth.getUser();
      const fetchedId = data?.user?.id;
      if (fetchedId) {
        setCustomerIdFromSupabase(fetchedId);
        activeCustomerId = fetchedId;
      } else {
        toaster.create({
          title: "Please login to favorite chefs",
          type: "warning",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
    }
    const optimisticNext = !fav;
    setFav(optimisticNext);
    try {
      if (optimisticNext) {
        dispatch(addFavoriteCooker(user_id));
        const res = await addFav({
          customerId: activeCustomerId,
          cookerId: user_id,
        });
        if (res.error) throw res.error;
        toaster.create({
          title: "Added to favorites ❤️",
          type: "success",
          duration: 1500,
        });
      } else {
        dispatch(removeFavoriteCooker(user_id));
        const res = await removeFav({
          customerId: activeCustomerId,
          cookerId: user_id,
        });
        if (res.error) throw res.error;
        toaster.create({
          title: "Removed from favorites 💔",
          type: "success",
          duration: 1500,
        });
      }
    } catch (err) {
      // revert optimistic change on error
      setFav(!optimisticNext);
      if (optimisticNext) {
        dispatch(removeFavoriteCooker(user_id));
      } else {
        dispatch(addFavoriteCooker(user_id));
      }
      toaster.create({ title: "Action failed", type: "error", duration: 1800 });
    }
  };
  return (
    <Card.Root
      maxW="md"
      p={5}
      borderRadius="22px"
      boxShadow="sm"
      position="relative"
      display="flex"
      flexDirection={{ base: "row", md: "column" }}
      alignItems="center"
      textAlign={{ base: "left", md: "center" }}
      bg={colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird}
      backdropFilter="blur(6px)"
      border="none"
      borderColor={
        colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
      }
      transition="0.3s ease"
      _hover={{
        transform: "scale(1.02)",
        boxShadow: "md",
        border: "1px solid red",
      }}
    >
      <IconButton
        onClick={onToggleFavorite}
        variant="ghost"
        aria-label="Add to favorites"
        position="absolute"
        top="4"
        right="4"
        color={
          fav ? "red.400" : colorMode === "dark" ? "whiteAlpha.800" : "gray.700"
        }
        _hover={{ color: "red.400" }}
        isLoading={toggling}
        bg={
          fav
            ? colorMode === "dark"
              ? colors.dark.bgSecond
              : colors.light.bgSecond
            : colorMode === "dark"
            ? colors.dark.bgThird
            : colors.light.bgThird
        }
        borderRadius={"16px"}
        border={`1px solid ${colors.light.textSub}`}
      >
        {fav ? <FaHeart color="#FA2C23" /> : <FaRegHeart />}
      </IconButton>

      <Image
        src={users?.avatar_url || "/default-avatar.png"}
        alt="Chef Avatar"
        borderRadius="full"
        boxSize={{ base: "70px", md: "150px" }}
        objectFit="cover"
        mr={{ base: 4, md: 0 }}
        mb={{ base: 0, md: 3 }}
        border={`3px solid ${colors.light.mainFixed}`}
      />

      <Box flex="1">
        <Text
          fontWeight="semibold"
          fontSize={{ base: "lg", md: "2xl" }}
          mb="1"
          color={
            colorMode == "light" ? colors.light.textMain : colors.dark.textMain
          }
        >
          {kitchen_name || users?.name}
        </Text>
        <Flex
          alignItems="center"
          justifyContent={{ base: "flex-start", md: "center" }}
          gap="1"
          mb="2"
          wrap="wrap"
        >
          <FaStar color="#FF861F" size={20} />
          <Text
            fontWeight="light"
            fontSize="lg"
            color={
              colorMode == "light" ? colors.light.textSub : colors.dark.textSub
            }
          >
            {avg_rating ? avg_rating.toFixed(1) : "0"}
          </Text>
          <Text
            fontSize="lg"
            fontWeight="light"
            color={
              colorMode == "light" ? colors.light.textSub : colors.dark.textSub
            }
          >
            ( {total_reviews || "0"} Reviews )
          </Text>
        </Flex>

        {/* <Text fontSize="sm" color="gray.600" mb="3">
          This kitchen offers modern, home-style meals cooked with passion and
          served fresh every day.
        </Text> */}

        <Button
          as={Link}
          to={`/home/cookers/${user_id}`}
          bg={
            colorMode == "light"
              ? colors.light.mainFixed
              : colors.dark.mainFixed
          }
          color={colors.light.white}
          variant="solid"
          size="sm"
          fontWeight="light"
          fontSize="md"
          w={{ base: "110px", md: "135px" }}
          borderRadius="12px"
          _hover={{ bg: colors.light.mainHover }}
        >
          View Menu
        </Button>
      </Box>
    </Card.Root>
  );
};

export default ChefCard;
