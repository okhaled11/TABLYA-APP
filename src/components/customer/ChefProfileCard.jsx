import {
  Box,
  Flex,
  Image,
  Text,
  Badge,
  Icon,
  IconButton,
  useBreakpointValue,
  Stack,
  Status,
} from "@chakra-ui/react";
import { FaStar, FaPhoneAlt, FaClock } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../services/supabaseClient";
import {toaster} from "../../components/ui/toaster";
import { MdOutlineFastfood } from "react-icons/md";
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

const ChefProfileCard = ({
  users,
  avg_rating,
  bio,
  start_time,
  end_time,
  is_available,
  is_busy,
  kitchen_name,
  specialty,
  total_reviews,
  user_id, // optional explicit cooker user_id if provided by parent
}) => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  // resolve cooker id
  const cookerId = user_id ?? users?.user_id ?? users?.id;

  // logged-in customer id with fallback to Supabase
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

  // fetch favourite ids for this customer
  const { data: favoriteIds = [] } = useGetFavoriteCookersByCustomerQuery(customerId, { skip: !customerId });
  useEffect(() => {
    if (favoriteIds?.length >= 0) dispatch(setFavoriteCookers(favoriteIds));
  }, [dispatch, favoriteIds]);

  const isFavGlobal = useSelector((s) =>
    Array.isArray(s.favoriteCookers?.ids)
      ? s.favoriteCookers.ids.includes(cookerId)
      : false
  );
  const [fav, setFav] = useState(false);
  useEffect(() => {
    setFav(isFavGlobal);
  }, [isFavGlobal]);

  const [addFav, { isLoading: adding } ] = useAddFavoriteCookerMutation();
  const [removeFav, { isLoading: removing } ] = useRemoveFavoriteCookerMutation();
  const toggling = useMemo(() => adding || removing, [adding, removing]);

  const onToggleFavorite = async () => {
    if (!cookerId) return;
    let activeCustomerId = customerId;
    if (!activeCustomerId) {
      const { data } = await supabase.auth.getUser();
      const fetchedId = data?.user?.id;
      if (fetchedId) {
        setCustomerIdFromSupabase(fetchedId);
        activeCustomerId = fetchedId;
      } else {
        toaster.create({ title: t("chefProfile.loginToFav"), type: "warning", duration: 2000, isClosable: true });
        return;
      }
    }
    const optimisticNext = !fav;
    setFav(optimisticNext);
    try {
      if (optimisticNext) {
        dispatch(addFavoriteCooker(cookerId));
        const res = await addFav({ customerId: activeCustomerId, cookerId });
        if (res.error) throw res.error;
        toaster.create({ title: t("chefProfile.addedFav"), type: "success", duration: 1500 });
      } else {
        dispatch(removeFavoriteCooker(cookerId));
        const res = await removeFav({ customerId: activeCustomerId, cookerId });
        if (res.error) throw res.error;
        toaster.create({ title: t("chefProfile.removedFav"), type: "success", duration: 1500 });
      }
    } catch (e) {
      setFav(!optimisticNext);
      if (optimisticNext) {
        dispatch(removeFavoriteCooker(cookerId));
      } else {
        dispatch(addFavoriteCooker(cookerId));
      }
      toaster.create({ title: t("chefProfile.actionFailed"), type: "error", duration: 1800 });
    }
  };

  return (
    <Box
      bg={colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird}
      borderRadius="20px"
      p={{ base: 4, md: 10 }}
      boxShadow="sm"
      position="relative"
      overflow="hidden"
    >
      {/* Favorite Icon */}
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

      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        gap={{ base: 4, md: 6 }}
      >
        {/* Left: Chef Image */}
        <Image
           src={users?.avatar_url || "/default-avatar.png"}
          alt={t("chefProfile.chefAvatarAlt")}
          borderRadius="full"
          boxSize={{ base: "100px", md: "150px" }}
          objectFit="cover"
          mr={{ base: 4, md: 0 }}
          mb={{ base: 0, md: 3 }}
          border={`3px solid ${colors.light.mainFixed}`}
        />

        {/* Right: Content */}
        <Box flex="1">
          <Flex align="center" flexWrap="wrap" gap={{ base: 2, md: 5 }}>
            <Text
              fontSize={{ base: "lg", md: "2xl" }}
              fontWeight="bold"
              color={
                colorMode == "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            >
              {kitchen_name || users?.name || t("chefProfile.chefNameFallback")}
            </Text>
            {/* check status - Busy takes priority */}
            {is_busy ? (
              <Badge
                bg="red.500"
                borderRadius="8px"
                fontSize={{ base: "xs", md: "sm" }}
                px={3}
                py={1}
                color="white"
              >
                <Status.Root colorPalette="red" color="white">
                  <Status.Indicator
                    bg="red.400"
                    boxShadow="0 0 12px 2px #DC2626"
                    filter="blur(0.5px)"
                  />
                  {t("chefCard.busyNow")}
                </Status.Root>
              </Badge>
            ) : is_available ? (
              <Badge
                bg={
                  colorMode === "light"
                    ? colors.light.success20a
                    : colors.dark.success20a
                }
                borderRadius="8px"
                fontSize={{ base: "xs", md: "sm" }}
                px={3}
                py={1}
              >
                <Status.Root
                  colorPalette="green"
                  color={
                    colorMode === "light"
                      ? colors.light.success
                      : colors.dark.success
                  }
                >
                  <Status.Indicator
                    bg="green.400"
                    boxShadow="0 0 12px 2px #2EB200"
                    filter="blur(0.5px)"
                  />
                  {t("chefProfile.available")}
                </Status.Root>
              </Badge>
            ) : (
              <Badge
                bg={
                  colorMode === "light"
                    ? colors.light.error20a
                    : colors.dark.error20a
                }
                borderRadius="8px"
                fontSize={{ base: "xs", md: "sm" }}
                px={3}
                py={1}
                color={
                  colorMode === "light" ? colors.light.error : colors.dark.error
                }
              >
                <RxCross2 size={20} />
                {t("chefProfile.closed")}
              </Badge>
            )}
          </Flex>

          {/* Info Row */}
          {isSmallScreen ? (
            <Stack spacing={1} mt={2}>
              <Flex align="center" gap={2}>
                <Icon
                  as={FaStar}
                  color={
                    colorMode == "light"
                      ? colors.light.warning
                      : colors.dark.warning
                  }
                />
                <Text
                  fontSize="sm"
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {avg_rating || 0}({total_reviews || "0"} {t("chefProfile.reviews")})
                </Text>
                {/* <Icon
                  as={FaPhoneAlt}
                  color={
                    colorMode == "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                />
                <Text
                  fontSize="sm"
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {users?.phone || "no number"}
                </Text> */}
              </Flex>

              <Flex align="center" gap={2}>
                <Icon
                  as={MdOutlineFastfood }
                  color={
                    colorMode == "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                />
                <Text
                  fontSize="sm"
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {specialty || t("chefProfile.noSpecialty")}
                </Text>
                <Icon
                  as={FaClock}
                  color={
                    colorMode == "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                />
                <Text
                  fontSize="sm"
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {start_time || "00:00"} AM - {end_time || "00:00"} PM
                </Text>
              </Flex>
            </Stack>
          ) : (
            <Flex
              align="center"
              mt={2}
              gap={5}
              wrap="wrap"
              fontSize="sm"
              color="gray.700"
            >
              <Flex align="center" gap={2}>
                <Icon
                  as={FaStar}
                  color={
                    colorMode == "light"
                      ? colors.light.warning
                      : colors.dark.warning
                  }
                />
                <Text
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {avg_rating || 0}({total_reviews || "0"} {t("chefProfile.reviews")})
                </Text>
              </Flex>
              <Flex align="center" gap={2}>
                <Icon
                  as={MdOutlineFastfood }
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                />
                <Text
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {specialty || t("chefProfile.noSpecialty")}
                </Text>
              </Flex>
              <Flex align="center" gap={2}>
                {/* <Icon
                  as={FaPhoneAlt}
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                />
                <Text
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {users?.phone || "no number"}
                </Text> */}
              </Flex>
              <Flex align="center" gap={2}>
                <Icon
                  as={FaClock}
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                />
                <Text
                  fontWeight="light"
                  color={
                    colorMode === "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {start_time || "00:00"} AM - {end_time || "00:00"} PM
                </Text>
              </Flex>
            </Flex>
          )}

          {/* Bio */}
          <Text
            mt={3}
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="light"
            color={
              colorMode === "light" ? colors.light.textSub : colors.dark.textSub
            }
            lineHeight="1.6"
          >
            {bio ||
              t("chefProfile.defaultBio")}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default ChefProfileCard;
