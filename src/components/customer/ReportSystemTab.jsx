import { Box, VStack, Text, Button, Textarea, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "../ui/toaster";
import { Warning } from "@phosphor-icons/react";
import { useColorMode } from "../../theme/color-mode";
import colors from "../../theme/color";
import { useCreateSystemReportMutation } from "../../app/features/Customer/Reports/reportsApiSlice";
import { v4 as uuidv4 } from "uuid";

export default function ReportSystemTab() {
  const { colorMode } = useColorMode();
  const [details, setDetails] = useState("");
  const [createSystemReport, { isLoading: isSubmitting }] =
    useCreateSystemReportMutation();

  const handleSubmitReport = async () => {
    // Validate details
    if (!details.trim()) {
      toaster.create({
        title: "Missing Information",
        description: "Please provide details about the system problem",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      await createSystemReport({
        details: details.trim(),
        targetId: uuidv4(), // Generate UUID for target_id
      }).unwrap();

      toaster.create({
        title: "Success",
        description: "Your report has been submitted successfully",
        type: "success",
        duration: 3000,
      });

      // Clear the form
      setDetails("");
    } catch (error) {
      console.error("Failed to submit report:", error);
      toaster.create({
        title: "Error",
        description: error || "Failed to submit report",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box
      bg={colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird}
      borderRadius="25px"
      p={8}
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <VStack spacing={2} align="start">
          <HStack spacing={3}>
            <Warning
              size={32}
              color={
                colorMode === "light"
                  ? colors.light.warning
                  : colors.dark.warning
              }
              weight="fill"
            />
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.dark.textMain
              }
            >
              Report System Problem
            </Text>
          </HStack>
          <Text
            fontSize="sm"
            color={
              colorMode === "light" ? colors.light.textSub : colors.dark.textSub
            }
          >
            Found a bug or experiencing technical issues? Let us know and we'll
            look into it as soon as possible.
          </Text>
        </VStack>

        {/* Report Type Info */}
        <Box
          bg={
            colorMode === "light" ? colors.light.bgFourth : colors.dark.bgFourth
          }
          p={4}
          borderRadius="12px"
          borderLeft={`4px solid ${
            colorMode === "light" ? colors.light.warning : colors.dark.warning
          }`}
        >
          <VStack spacing={2} align="start">
            <HStack spacing={2}>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
              >
                Report Type:
              </Text>
              <Text
                fontSize="sm"
                color={
                  colorMode === "light"
                    ? colors.light.textSub
                    : colors.dark.textSub
                }
              >
                System Problem
              </Text>
            </HStack>
            <HStack spacing={2}>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={
                  colorMode === "light"
                    ? colors.light.textMain
                    : colors.dark.textMain
                }
              >
                Target:
              </Text>
              <Text
                fontSize="sm"
                color={
                  colorMode === "light"
                    ? colors.light.textSub
                    : colors.dark.textSub
                }
              >
                System
              </Text>
            </HStack>
          </VStack>
        </Box>

        {/* Details Textarea */}
        <Box>
          <Text
            fontSize="sm"
            fontWeight="medium"
            color={
              colorMode === "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
            mb={2}
          >
            Problem Details *
          </Text>
          <Textarea
            placeholder="Please describe the issue you're experiencing in detail..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            bg={
              colorMode === "light" ? colors.light.bgInput : colors.dark.bgInput
            }
            borderRadius="12px"
            minH="200px"
            resize="vertical"
            _focus={{
              borderColor:
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed,
              boxShadow: `0 0 0 1px ${
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed
              }`,
            }}
          />
          <Text
            fontSize="xs"
            color={
              colorMode === "light" ? colors.light.textSub : colors.dark.textSub
            }
            mt={2}
          >
            Please be as detailed as possible to help us resolve the issue
            quickly.
          </Text>
        </Box>

        {/* Submit Button */}
        <HStack spacing={4}>
          <Button
            flex={1}
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
            borderRadius="12px"
            size="lg"
            onClick={() => setDetails("")}
            isDisabled={!details.trim() || isSubmitting}
            _hover={{
              bg:
                colorMode === "light"
                  ? colors.light.mainFixed10a
                  : colors.dark.mainFixed10a,
            }}
          >
            Clear
          </Button>
          <Button
            flex={1}
            bg={
              colorMode === "light"
                ? colors.light.mainFixed
                : colors.dark.mainFixed
            }
            color="white"
            borderRadius="12px"
            size="lg"
            onClick={handleSubmitReport}
            isLoading={isSubmitting}
            loadingText="Submitting..."
            _hover={{
              bg:
                colorMode === "light"
                  ? colors.light.mainFixed70a
                  : colors.dark.mainFixed70a,
            }}
            _loading={{
              bg:
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed,
              opacity: 0.7,
            }}
          >
            Submit Report
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
