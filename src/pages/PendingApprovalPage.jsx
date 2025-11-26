import {
  Flex,
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Container,
  Input,
  Stack,
  Spinner,
  Icon,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "../theme/color-mode";
import colors from "../theme/color";
import { FaClock, FaEnvelope, FaHome, FaCloudUploadAlt, FaCheckCircle, FaFileImage } from "react-icons/fa";
import { MdPendingActions, MdError, MdTimer } from "react-icons/md";
import Navbar from "../layout/Navbar";
import Footer from "../shared/Footer";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { uploadImageToImgBB } from "../services/uploadImageToImageBB";
import { convertImageToWebP } from "../services/imageToWebp";
import { toaster } from "../components/ui/toaster";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const FileUploadBox = ({ label, onChange, file, isRTL, bgInput, borderColor, hoverBorderColor }) => {
  return (
    <Box>
      <Text fontSize="sm" fontWeight="semibold" mb={2} align={isRTL ? "right" : "left"}>
        {label}
      </Text>
      <Box
        position="relative"
        border="2px dashed"
        borderColor={file ? "green.400" : borderColor}
        borderRadius="xl"
        bg={file ? "green.50" : bgInput}
        p={4}
        transition="all 0.2s"
        _hover={{ borderColor: hoverBorderColor, bg: "orange.50" }}
        cursor="pointer"
        role="group"
      >
        <Input
          type="file"
          accept="image/*"
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          opacity={0}
          cursor="pointer"
          onChange={onChange}
          zIndex={2}
        />
        <VStack spacing={2}>
          {file ? (
             <Icon as={FaCheckCircle} boxSize={8} color="green.500" />
          ) : (
             <Icon 
               as={FaCloudUploadAlt} 
               boxSize={8} 
               color="gray.400" 
               _groupHover={{ color: "orange.500", transform: "scale(1.1)" }} 
               transition="all 0.2s"
             />
          )}
          <Text fontSize="sm" color={file ? "green.600" : "gray.500"} fontWeight="medium">
            {file ? file.name : "Click to upload or drag and drop"}
          </Text>
          {!file && (
            <Text fontSize="xs" color="gray.400">
              SVG, PNG, JPG or GIF (max. 5MB)
            </Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

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

  const bgMain = colorMode === "light" ? "gray.50" : "gray.900";
  const bgCard = colorMode === "light" ? "white" : "gray.800";
  const textColor = colorMode === "light" ? "gray.800" : "white";
  const subTextColor = colorMode === "light" ? "gray.500" : "gray.400";
  const bgInput = colorMode === "light" ? "gray.50" : "gray.700";
  const borderColor = colorMode === "light" ? "gray.200" : "gray.600";
  const hoverBorderColor = "orange.400";

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
        status: "pending",
      };

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
      
      setFiles({ frontId: null, backId: null, selfie: null });
      setNote(null); // Hide note after submission until next review
      
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
      <Flex minH="100vh" align="center" justify="center" bg={bgMain}>
        <Spinner size="xl" color="orange.500" thickness="4px" />
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
        // bg={bgMain}
        px={4}
        py={10}
      >
        <Container maxW="2xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            bg={bgCard}
            borderRadius="2xl"
            p={{ base: 6, md: 10 }}
            boxShadow="lg"
            textAlign="center"
          >
            <VStack gap={6}>
              {/* Illustration Area */}
              <Box position="relative" mb={2}>
                <MotionBox
                  animate={{ 
                    y: [0, -5, 0],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Box
                    w="120px"
                    h="120px"
                    bg="orange.50"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                  >
                     {/* Clock Hands Animation */}
                    <Box
                      position="absolute"
                      w="100px"
                      h="100px"
                      borderRadius="full"
                      border="2px dashed"
                      borderColor="orange.200"
                      animation="spin 10s linear infinite"
                    />
                    
                    <Icon as={MdTimer} boxSize={16} color="orange.500" />
                    
                    <Box
                        position="absolute"
                        bottom="-2px"
                        right="-2px"
                        bg="white"
                        p={2}
                        borderRadius="full"
                        boxShadow="sm"
                        border="1px solid"
                        borderColor="gray.100"
                    >
                        <Icon as={MdPendingActions} boxSize={5} color="orange.500" />
                    </Box>
                  </Box>
                </MotionBox>
              </Box>

              {/* Title & Description */}
              <VStack gap={2}>
                <Heading
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="bold"
                  color={textColor}
                >
                  {t("pendingApproval.title")}
                </Heading>
                <Text
                  fontSize="md"
                  color={subTextColor}
                  maxW="md"
                  lineHeight="tall"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t("pendingApproval.description")}
                </Text>
              </VStack>

              {/* Note Section */}
              {note && (
                <MotionBox
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  w="full"
                  bg="red.50"
                  p={4}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="red.100"
                >
                  <VStack align="start" spacing={2}>
                    <HStack color="red.500" spacing={2}>
                      <MdError size={20} />
                      <Text fontWeight="bold" fontSize="md">Action Required</Text>
                    </HStack>
                    <Text color="red.700" textAlign="left" fontSize="sm" w="full">
                      {note}
                    </Text>
                  </VStack>
                </MotionBox>
              )}

              {/* Re-upload Section */}
              {note && (
                <VStack w="full" spacing={4} align="stretch" mt={2}>
                   <Text fontWeight="semibold" fontSize="lg" align={isRTL ? "right" : "left"} color={textColor}>
                      Update Documents
                   </Text>
                   
                   <Stack direction={{ base: "column", md: "row" }} spacing={3}>
                      <FileUploadBox 
                        label="National ID (Front)" 
                        onChange={(e) => handleFileChange(e, "frontId")}
                        file={files.frontId}
                        isRTL={isRTL}
                        bgInput={bgInput}
                        borderColor={borderColor}
                        hoverBorderColor={hoverBorderColor}
                      />
                      <FileUploadBox 
                        label="National ID (Back)" 
                        onChange={(e) => handleFileChange(e, "backId")}
                        file={files.backId}
                        isRTL={isRTL}
                        bgInput={bgInput}
                        borderColor={borderColor}
                        hoverBorderColor={hoverBorderColor}
                      />
                   </Stack>
                   <FileUploadBox 
                        label="Selfie with ID" 
                        onChange={(e) => handleFileChange(e, "selfie")}
                        file={files.selfie}
                        isRTL={isRTL}
                        bgInput={bgInput}
                        borderColor={borderColor}
                        hoverBorderColor={hoverBorderColor}
                      />

                   <Button
                      size="lg"
                      bg="#FA2c23"
                      color="white"
                      _hover={{
                        bg: "#d91f17",
                        transform: "translateY(-1px)",
                      }}
                      _active={{ transform: "translateY(0)" }}
                      onClick={handleResubmit}
                      isLoading={uploading}
                      loadingText="Uploading..."
                      leftIcon={<FaCloudUploadAlt />}
                      fontSize="md"
                      borderRadius="lg"
                      mt={2}
                   >
                      Resubmit Documents
                   </Button>
                </VStack>
              )}

              {/* Info Box */}
              {!note && (
                <Box
                  w="full"
                  p={5}
                  bg={colorMode === "light" ? "orange.50" : "rgba(237, 137, 54, 0.1)"}
                  borderRadius="lg"
                >
                  <HStack align="start" spacing={3}>
                    <Box
                      mt={1}
                      color="orange.500"
                    >
                      <FaClock size={18} />
                    </Box>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold" fontSize="md" color={textColor}>
                        {t("pendingApproval.whatNext")}
                      </Text>
                      <Text fontSize="sm" color={subTextColor} textAlign="left" lineHeight="relaxed">
                        {t("pendingApproval.whatNextDescription")}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              )}

              {/* Action Buttons */}
              <Button
                variant="ghost"
                size="md"
                onClick={() => navigate("/")}
                color={subTextColor}
                leftIcon={<FaHome />}
                _hover={{ bg: colorMode === "light" ? "gray.100" : "gray.700", color: textColor }}
              >
                {t("pendingApproval.goHome")}
              </Button>

            </VStack>
          </MotionBox>
        </Container>
      </Flex>
      <Footer />

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

export default PendingApprovalPage;
