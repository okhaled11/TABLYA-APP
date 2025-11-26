import {
  Flex,
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Container,
  Input,
  InputGroup,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "../theme/color-mode";
import colors from "../theme/color";
import { FaClock, FaEnvelope, FaHome, FaUpload } from "react-icons/fa";
import { MdPendingActions, MdError } from "react-icons/md";
import Navbar from "../layout/Navbar";
import Footer from "../shared/Footer";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { uploadImageToImgBB } from "../services/uploadImageToImageBB";
import { convertImageToWebP } from "../services/imageToWebp";
import { toaster } from "../components/ui/toaster";

const PendingApprovalPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState(null);
  const [status, setStatus] = useState("pending");
  const [files, setFiles] = useState({
    frontId: null,
    backId: null,
    selfie: null,
  });

  const bgInput =
    colorMode === "light" ? colors.light.bgInput : colors.dark.bgInput;

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login");
          return;
        }

        // Check cooker_approvals for notes and status
        const { data: approvalData, error } = await supabase
          .from("cooker_approvals")
          .select("*")
          .eq("cooker_id", user.id)
          .single();

        if (approvalData) {
          setStatus(approvalData.status);
          setNote(approvalData.notes);

          if (approvalData.status === "approved") {
            navigate("/home");
          }
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [navigate]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [type]: file }));
    }
  };

  const handleResubmit = async () => {
    if (!files.frontId && !files.backId && !files.selfie) {
      toaster.create({
        title: "No files selected",
        description: "Please select at least one file to update.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setUploading(true);
    try {
      const updates = {
        status: "pending", // Reset status to pending so admin sees it
      };

      // Upload images if selected
      if (files.frontId) {
        const webp = await convertImageToWebP(files.frontId);
        updates.id_card_front_url = await uploadImageToImgBB(webp);
      }
      if (files.backId) {
        const webp = await convertImageToWebP(files.backId);
        updates.id_card_back_url = await uploadImageToImgBB(webp);
      }
      if (files.selfie) {
        const webp = await convertImageToWebP(files.selfie);
        updates.selfie_with_id_url = await uploadImageToImgBB(webp);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("cooker_approvals")
        .update(updates)
        .eq("cooker_id", user.id);

      if (error) throw error;

      toaster.create({
        title: "Submitted Successfully",
        description: "Your documents have been updated and are pending approval.",
        type: "success",
        duration: 3000,
      });
      
      // Clear files
      setFiles({ frontId: null, backId: null, selfie: null });
      
    } catch (error) {
      console.error("Error updating documents:", error);
      toaster.create({
        title: "Error",
        description: "Failed to update documents. Please try again.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Spinner size="xl" color="orange.500" />
      </Flex>
    );
  }

  return (
    <>
      <Navbar />
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bg={colorMode === "light" ? colors.light.bgMain : colors.dark.bgMain}
        px={4}
        py={10}
      >
        <Container maxW="2xl">
          <Box
            bg={
              colorMode === "light" ? colors.light.bgThird : colors.dark.bgFixed
            }
            borderRadius="2xl"
            p={{ base: 8, md: 12 }}
            boxShadow="2xl"
            textAlign="center"
          >
            <VStack gap={6}>
              {/* Icon Animation */}
              <Box
                position="relative"
                w="120px"
                h="120px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  position="absolute"
                  w="100%"
                  h="100%"
                  borderRadius="full"
                  bg={colorMode === "light" ? "orange.100" : "orange.900"}
                  opacity={0.3}
                  animation="pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                />
                <Box
                  position="relative"
                  w="80px"
                  h="80px"
                  borderRadius="full"
                  bg={colorMode === "light" ? "orange.200" : "orange.800"}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <MdPendingActions
                    size={48}
                    color={colorMode === "light" ? "#C05621" : "#FBD38D"}
                  />
                </Box>
              </Box>

              {/* Title */}
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
              >
                {t("pendingApproval.title")}
              </Heading>

              {/* Description */}
              <VStack gap={3} maxW="md">
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color={colorMode === "light" ? "gray.600" : "gray.400"}
                  lineHeight="tall"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t("pendingApproval.description")}
                </Text>

                {/* Note Section - Only show if there is a note */}
                {note && (
                  <Box
                    w="full"
                    p={4}
                    bg="red.50"
                    borderRadius="lg"
                    borderLeft="4px solid"
                    borderColor="red.500"
                    textAlign="left"
                  >
                    <Flex align="center" gap={3} mb={2}>
                      <MdError size={20} color="#E53E3E" />
                      <Text fontWeight="semibold" color="red.800">
                        Admin Note:
                      </Text>
                    </Flex>
                    <Text fontSize="sm" color="red.700">
                      {note}
                    </Text>
                  </Box>
                )}

                {/* Re-upload Section - Only show if there is a note (implying rejection/changes needed) */}
                {note && (
                  <Box w="full" mt={4}>
                    <Text
                      fontWeight="bold"
                      mb={4}
                      align={isRTL ? "right" : "left"}
                    >
                      Update Documents
                    </Text>
                    <Stack spacing={4}>
                      <Box>
                        <Text
                          fontSize="sm"
                          mb={1}
                          align={isRTL ? "right" : "left"}
                        >
                          National ID (Front)
                        </Text>
                        <Input
                          type="file"
                          accept="image/*"
                          pt={1}
                          onChange={(e) => handleFileChange(e, "frontId")}
                          bg={bgInput}
                        />
                      </Box>
                      <Box>
                        <Text
                          fontSize="sm"
                          mb={1}
                          align={isRTL ? "right" : "left"}
                        >
                          National ID (Back)
                        </Text>
                        <Input
                          type="file"
                          accept="image/*"
                          pt={1}
                          onChange={(e) => handleFileChange(e, "backId")}
                          bg={bgInput}
                        />
                      </Box>
                      <Box>
                        <Text
                          fontSize="sm"
                          mb={1}
                          align={isRTL ? "right" : "left"}
                        >
                          Selfie with ID
                        </Text>
                        <Input
                          type="file"
                          accept="image/*"
                          pt={1}
                          onChange={(e) => handleFileChange(e, "selfie")}
                          bg={bgInput}
                        />
                      </Box>
                      <Button
                        colorScheme="orange"
                        bg="#FA2c23"
                        color="white"
                        _hover={{ bg: "#d91f17" }}
                        onClick={handleResubmit}
                        isLoading={uploading}
                        loadingText="Uploading..."
                        leftIcon={<FaUpload />}
                      >
                        Resubmit Documents
                      </Button>
                    </Stack>
                  </Box>
                )}

                <Box
                  w="full"
                  p={4}
                  bg={colorMode === "light" ? "orange.50" : "orange.900"}
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor={
                    colorMode === "light" ? "orange.400" : "orange.600"
                  }
                  mt={4}
                >
                  <Flex align="center" gap={3} mb={2}>
                    <FaClock
                      size={20}
                      color={colorMode === "light" ? "#C05621" : "#FBD38D"}
                    />
                    <Text
                      fontWeight="semibold"
                      color={
                        colorMode === "light" ? "orange.800" : "orange.200"
                      }
                    >
                      {t("pendingApproval.whatNext")}
                    </Text>
                  </Flex>
                  <Text
                    fontSize="sm"
                    color={colorMode === "light" ? "orange.700" : "orange.300"}
                    textAlign={isRTL ? "right" : "left"}
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {t("pendingApproval.whatNextDescription")}
                  </Text>
                </Box>
              </VStack>

              {/* Action Buttons */}
              <VStack gap={3} w="full" maxW="sm" mt={4}>
                <Button
                  leftIcon={<FaHome />}
                  bg={
                    colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                  color="white"
                  size="lg"
                  w="full"
                  borderRadius="lg"
                  onClick={() => navigate("/")}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  transition="all 0.2s"
                >
                  {t("pendingApproval.goHome")}
                </Button>

                <Button
                  leftIcon={<FaEnvelope />}
                  variant="outline"
                  borderColor={
                    colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                  color={
                    colorMode === "light"
                      ? colors.light.mainFixed
                      : colors.dark.mainFixed
                  }
                  size="lg"
                  w="full"
                  borderRadius="lg"
                  onClick={() =>
                    (window.location.href = "mailto:support@tablya.com")
                  }
                  _hover={{
                    bg:
                      colorMode === "light"
                        ? "orange.50"
                        : "rgba(251, 211, 141, 0.1)",
                  }}
                >
                  {t("pendingApproval.contactSupport")}
                </Button>
              </VStack>

              {/* Footer Note */}
              <Text
                fontSize="xs"
                color={colorMode === "light" ? "gray.500" : "gray.500"}
                mt={4}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {t("pendingApproval.needHelp")}
              </Text>
            </VStack>
          </Box>
        </Container>
      </Flex>
      <Footer />

      {/* CSS Animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.3;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.5;
            }
          }
        `}
      </style>
    </>
  );
};

export default PendingApprovalPage;
