import { Box, Heading, Grid, Text, Flex } from "@chakra-ui/react";
import { useColorMode } from "../../../theme/color-mode";
import colors from "../../../theme/color";
import { useGetUserDataQuery } from "../../../app/features/Auth/authSlice";
import { useGetReviewsByCookerIdQuery } from "../../../app/features/Customer/reviewsApi";
import ReviewCard from "../../../components/customer/ReviewCard";
import ReviewCardSkeleton from "../../../components/ui/ReviewCardSkeleton";
import CookieService from "../../../services/cookies";
import { FaRegStar } from "react-icons/fa";

const CookerReviews = () => {
  const { colorMode } = useColorMode();
  const token = CookieService.get("access_token");
  const { data: userData } = useGetUserDataQuery(undefined, {
    skip: !token,
  });
  const cookerId = userData?.sub;

  const { data: reviews, isLoading } = useGetReviewsByCookerIdQuery(cookerId, {
    skip: !cookerId,
  });

    return (
    <>
      <Box py={6}>
        <Heading 
          fontSize={{base:"2xl",md:"3xl"}} 
          fontWeight="bold" 
          mb={6} 
          color={colorMode === "light" ? colors.light.textMain : colors.dark.textMain}
        >
          Customer Reviews
        </Heading>
        
        {isLoading ? (
          <Grid templateColumns={{base:"1fr",md:"1fr 1fr"}} gap={4} alignItems="start">
            {Array.from({ length: 4 }).map((_, index) => (
              <ReviewCardSkeleton key={index} />
            ))}
          </Grid>
        ) : reviews && reviews.length > 0 ? (
          <Grid templateColumns={{base:"1fr",md:"1fr 1fr"}} gap={4} alignItems="start">
            {reviews.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </Grid>
        ) : (
          <Box 
            textAlign="center" 
            py={10}
            bg={colorMode === "light" ? colors.light.bgFourth : colors.dark.bgFourth}
            borderRadius="20px"
          >
            <Flex justify="center" gap={2} mb={4}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaRegStar key={star} size={32} color="#FF861F" />
              ))}
            </Flex>
            <Text 
              fontSize="lg" 
              fontWeight="medium"
              mb={2}
              color={colorMode === "light" ? colors.light.textMain : colors.dark.textMain}
            >
              No Reviews Yet
            </Text>
            <Text 
              fontSize="md" 
              color={colorMode === "light" ? colors.light.textSub : colors.dark.textSub}
            >
              Keep up the great work to get your first review!
            </Text>
          </Box>
        )}
      </Box>
    </>
  );  
};

export default CookerReviews;
