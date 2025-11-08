import { useState } from "react";
import { Box, Textarea, Text, Flex, Button } from "@chakra-ui/react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import CustomModal from "../../shared/Modal";
import { useAddReviewMutation } from "../../app/features/Customer/reviewsApi";
import { toaster } from "../ui/toaster";
import { useParams } from "react-router-dom";
import { useGetUserDataQuery } from "../../app/features/Auth/authSlice";
const ReviewModal = ({ dialog }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const { id: cookerId } = useParams();
  const { data: userData } = useGetUserDataQuery();
  const customerId = userData?.sub;


  const [addReview, { isLoading }] = useAddReviewMutation();

  const handleSubmit = async () => {
    // Check for empty input first
    if (!rating || !review) {
      toaster.create({
        title: "Review",
        description: "Please provide a rating and review.",
        type: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const reviewData = {
        rating,
        comment: review,
        customer_id: customerId,
        cooker_id: cookerId,
      };

       addReview(reviewData).unwrap();

      toaster.create({
        title: "Review",
        description: "Review submitted successfully",
        type: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      dialog.setOpen(false);

      // reset form
      setRating(0);
      setHoverRating(0);
      setReview("");
    } catch (err) {
      toaster.create({
        title: "Review",
        description: err?.message || "Failed to submit review",
        type: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <CustomModal
      dialog={dialog}
      description="Rate this meal and let others know your experience"
      title="Add A Review"
      okTxt="Submit Review"
      cancelTxt="Cancel"
      onOkHandler={handleSubmit}
      isLoading={isLoading}
    >
      <Box mb={4}>
        <Text fontWeight="bold" mb={2}>
          Your Rating
        </Text>
        <Flex>
          {[1, 2, 3, 4, 5].map((star) => (
            <Box
              key={star}
              cursor="pointer"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              {star <= (hoverRating || rating) ? (
                <AiFillStar color="#FF861F" size={24} />
              ) : (
                <AiOutlineStar color="#FF861F" size={24} />
              )}
            </Box>
          ))}
        </Flex>
      </Box>

      <Box mb={4}>
        <Text fontWeight="bold" mb={2}>
          Your Review
        </Text>
        <Textarea
          placeholder="Enter your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </Box>
    </CustomModal>
  );
};

export default ReviewModal;
