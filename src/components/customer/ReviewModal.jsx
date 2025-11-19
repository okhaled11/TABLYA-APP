import { useState, useEffect } from "react";
import {
  Box,
  Textarea,
  Text,
  Flex,
  Button,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { IoWarningOutline } from "react-icons/io5";
import CustomModal from "../../shared/Modal";
import { useAddReviewMutation, useUpdateReviewMutation } from "../../app/features/Customer/reviewsApi";
import { toaster } from "../ui/toaster";
import { useParams } from "react-router-dom";
import { useGetUserDataQuery } from "../../app/features/Auth/authSlice";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
const ReviewModal = ({ dialog, existingReview }) => {
  const { colorMode } = useColorMode();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [warningOpen, setWarningOpen] = useState(false);
  const [checkingText, setCheckingText] = useState(false);
  const { id: cookerId } = useParams();
  const { data: userData } = useGetUserDataQuery();
  const customerId = userData?.sub;

  const [addReview, { isLoading }] = useAddReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  const checkTextSensitivity = async (text) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing VITE_GEMINI_API_KEY in environment.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE",
        },
      ],
    });

    const prompt = `Evaluate if this review text is appropriate for a food delivery platform. Reply with only "SAFE" if the text is respectful and appropriate, or "UNSAFE" if it contains profanity, hate speech, threats, or highly offensive language.\n\nReview text: ${text}`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;

      // Check if response was blocked
      if (!response || response.promptFeedback?.blockReason) {
        // If blocked, treat as potentially sensitive
        return true;
      }

      const responseText = response.text().trim().toUpperCase();
      return responseText.includes("UNSAFE");
    } catch (error) {
      // If API call fails or is blocked, allow the review (fail open)
      console.error("Gemini API error:", error);
      return false;
    }
  };

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview?.rating || 0);
      setReview(existingReview?.comment || "");
    }
  }, [existingReview]);

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
      return false;
    }

    // Check text sensitivity with Gemini AI
    try {
      setCheckingText(true);
      const isSensitive = await checkTextSensitivity(review);

      if (isSensitive) {
        setWarningOpen(true);
        setCheckingText(false);
        return false;
      }
    } catch (err) {
      setCheckingText(false);
      toaster.create({
        title: "Content Check Failed",
        description:
          err?.message || "Could not verify content. Please try again.",
        type: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return false;
    }

    // Submit review if text is safe
    try {
      setCheckingText(false);

      if (existingReview?.id) {
        await updateReview({ id: existingReview.id, updates: { rating, comment: review } }).unwrap();
        toaster.create({
          title: "Review",
          description: "Review updated successfully",
          type: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } else {
        const reviewData = {
          rating,
          comment: review,
          customer_id: customerId,
          cooker_id: cookerId,
        };
        await addReview(reviewData).unwrap();
        toaster.create({
          title: "Review",
          description: "Review submitted successfully",
          type: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }

      // reset form
      setRating(0);
      setHoverRating(0);
      setReview("");
      return true;
    } catch (err) {
      toaster.create({
        title: "Review",
        description: err?.message || "Failed to submit review",
        type: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return false;
    }
  };

  return (
    <>
      <CustomModal
        dialog={dialog}
        description="Rate this meal and let others know your experience"
        title={existingReview ? "Update Your Review" : "Add A Review"}
        okTxt={existingReview ? "Update Review" : "Submit Review"}
        cancelTxt="Cancel"
        onOkHandler={handleSubmit}
        isLoading={isLoading || isUpdating || checkingText}
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

      <Dialog.Root
        open={warningOpen}
        onOpenChange={(e) => setWarningOpen(e.open)}
        motionPreset="slide-in-bottom"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content
              maxW="md"
              borderRadius="16px"
              bg={
                colorMode === "light"
                  ? colors.light.bgThird
                  : colors.dark.bgThird
              }
              borderWidth="2px"
              borderColor="red.500"
            >
              <Dialog.Header pb={2}>
                <Flex align="center" gap={3}>
                  <Box
                    p={2}
                    borderRadius="full"
                    bg="red.100"
                    color="red.600"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <IoWarningOutline size={28} />
                  </Box>
                  <Dialog.Title fontSize="xl" fontWeight="bold" color="red.600">
                    Sensitive Content Detected
                  </Dialog.Title>
                </Flex>
              </Dialog.Header>

              <Dialog.Body py={4}>
                <Text
                  fontSize="md"
                  color={
                    colorMode === "light"
                      ? colors.light.textSub
                      : colors.dark.textSub
                  }
                  lineHeight="1.6"
                >
                  Your review contains sensitive or inappropriate content. Please
                  revise your review to be respectful and appropriate before
                  submitting.
                </Text>
              </Dialog.Body>

              <Dialog.Footer pt={2}>
                <Button
                  onClick={() => setWarningOpen(false)}
                  colorPalette="red"
                  width="full"
                  size="lg"
                  borderRadius="12px"
                >
                  Edit Review
                </Button>
              </Dialog.Footer>

              <Dialog.CloseTrigger asChild>
                <CloseButton
                  size="sm"
                  position="absolute"
                  top={3}
                  right={3}
                />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default ReviewModal;
