import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  Progress,
  useDialog,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import { useParams } from "react-router-dom";

import { FaStar } from "react-icons/fa";
import { useGetCookerByIdQuery } from "../../app/features/Customer/CookersApi";
import CustomModal from "../../shared/Modal";
import ReviewModal from "./ReviewModal";
import { useGetReviewsByCookerIdQuery } from "../../app/features/Customer/reviewsApi";
import { useSelector } from "react-redux";
import { supabase } from "../../services/supabaseClient";

const AvgCustomerReview = () => {
  const dialog = useDialog();
  const { colorMode } = useColorMode();
  const { id } = useParams();
  const { data: cooker } = useGetCookerByIdQuery(id);
  // console.log("from rating", cooker);
  const rating = cooker?.avg_rating || 0;
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));

  // determine if current customer already reviewed this cooker
  const { data: reviews = [] } = useGetReviewsByCookerIdQuery(id, { skip: !id });
  const customerIdFromRedux = useSelector((s) => s.auth?.userData?.user?.id);
  const [customerIdFromSupabase, setCustomerIdFromSupabase] = useState(null);
  useEffect(() => {
    if (!customerIdFromRedux) {
      supabase.auth.getUser().then(({ data }) => {
        const uid = data?.user?.id || null;
        if (uid) setCustomerIdFromSupabase(uid);
      });
    }
  }, [customerIdFromRedux]);
  const customerId = customerIdFromRedux || customerIdFromSupabase;
  const hasReviewed = useMemo(() => {
    if (!customerId) return false;
    return Array.isArray(reviews)
      ? reviews.some((r) => r.customer_id === customerId)
      : false;
  }, [reviews, customerId]);
  const starCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (Array.isArray(reviews)) {
      reviews.forEach((r) => {
        const s = Math.round(Number(r?.rating) || 0);
        if (s >= 1 && s <= 5) counts[s] += 1;
      });
    }
    return counts;
  }, [reviews]);

  const totalReviews = useMemo(
    () => Object.values(starCounts).reduce((a, b) => a + b, 0),
    [starCounts]
  );

  const existingReview = useMemo(
    () =>
      Array.isArray(reviews)
        ? reviews.find((r) => r.customer_id === customerId) || null
        : null,
    [reviews, customerId]
  );

  return (
    <>
      <Box flex="1" maxW={{ base: "100%", md: "350px" }} textAlign="center">
        <Flex justifyContent="center" alignItems="flex-end" gap={2}>
          <Text
            fontSize="4xl"
            fontWeight="bold"
            textAlign="center"
            color={
              colorMode == "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
          >
            {cooker?.avg_rating || 0}
          </Text>
          <Text
            fontSize="xl"
            fontWeight="medium"
            mb={2}
            textAlign="center"
            color={
              colorMode == "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
          >
            {" "}
            / 5
          </Text>
        </Flex>
        {[5, 4, 3, 2, 1].map((s) => {
          const count = starCounts[s] || 0;
          const p = totalReviews ? Math.max(0, Math.min(100, (count / totalReviews) * 100)) : 0;
          return (
            <Flex key={s} alignItems="center" justifyContent="center" gap={4} mt={2}>
              <Flex alignItems="center" gap={1} minW="40px" justifyContent="center">
                <Text
                  color={
                    colorMode == "light"
                      ? colors.light.textMain
                      : colors.dark.textMain
                  }
                >
                  {s}
                </Text>
                <FaStar color="#FF861F" size={16} />
              </Flex>

              <Progress.Root
                width="220px"
                value={p}
                colorPalette={"red"}
                variant="outline"
              >
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>

              <Text
                color={
                  colorMode == "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
              >
                {count}
              </Text>
            </Flex>
          );
        })}
        <Button
          mt={4}
          color={
            colorMode == "light"
              ? colors.light.mainFixed
              : colors.dark.mainFixed
          }
          borderColor={
            colorMode == "light"
              ? colors.light.mainFixed
              : colors.dark.mainFixed
          }
          borderRadius="12px"
          variant="outline"
          w="80%"
          _hover={{ bg: colors.light.mainFixed, color: "white" }}
          transition="0.5s ease"
          onClick={() => {
            dialog.setOpen(true);
          }}
        >
          {hasReviewed ? "Update Review" : "Add Review"}
        </Button>
      </Box>
      <ReviewModal dialog={dialog} existingReview={existingReview} />
    </>
  );
};

export default AvgCustomerReview;
