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
        <Flex alignItems="center" justifyContent="center" gap={4}>
          <FaStar color="#FF861F" size={20} />

          <Progress.Root
            width="220px"
            value={percent} 
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
            {cooker?.total_reviews || 0}
          </Text>
        </Flex>
        {!hasReviewed && (
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
            Add Review
          </Button>
        )}
      </Box>
      <ReviewModal dialog={dialog} />
    </>
  );
};

export default AvgCustomerReview;
