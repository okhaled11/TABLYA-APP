import { Box, Flex, Text, Button, VStack, Progress } from "@chakra-ui/react";
import colors from "../../theme/color";
import { useColorMode } from "../../theme/color-mode";
import { useParams } from "react-router-dom";
import ScrollAreaComponent from "../ui/ScrollAreaComponent";
import ReviewCard from "./ReviewCard";
import { useGetReviewsByCookerIdQuery } from "../../app/features/Customer/reviewsApi";
import ReviewCardSkeleton from "../ui/ReviewCardSkeleton";
import { FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import AvgCustomerReview from "./AvgCustomerReview";

const CustomerReviewSection = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const { id } = useParams();
  const { data: reviews, isLoading } = useGetReviewsByCookerIdQuery(id);

  return (
    <>
    
    <Box
      bg={colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird}
      borderRadius="20px"
      p={{ base: 4, md: 10 }}
      my={8}
      boxShadow="sm"
    >
      <Flex
        direction="row"
        justifyContent="space-between"
        align="center"
        mb={3}
        wrap={{ base: "wrap", md: "nowrap" }}
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color={
            colorMode === "light" ? colors.light.textMain : colors.dark.textMain
          }
        >
          {t("customerReviews.title")}
        </Text>
      </Flex>

      <Box
        w="100%"
        h="2px"
        bg={
          colorMode === "light"
            ? colors.light.textMain10a
            : colors.dark.textMain10a
        }
        mt={3}
        mb={5}
      />

      <Flex
        justifyContent="space-between"
        // w="100%"
        align="flex-start"
        wrap={{ base: "wrap", md: "nowrap" }}
        gap={3}
      >
        {/* Avg Reviews */}
        <AvgCustomerReview />

        {/* Reviews Scroll */}
        <Box flex="2" minW={{ base: "100%", md: "0" }}>
          <ScrollAreaComponent>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <ReviewCardSkeleton key={index} />
              ))
            ) : reviews && reviews.length > 0 ? (
              reviews.map((item) => <ReviewCard key={item.id} {...item} />)
            ) : (
              <Text mt={8} textAlign="center">
                {t("customerReviews.noReviews")}
              </Text>
            )}
          </ScrollAreaComponent>
        </Box>
      </Flex>
    </Box>
    </>
  );
};

export default CustomerReviewSection;
