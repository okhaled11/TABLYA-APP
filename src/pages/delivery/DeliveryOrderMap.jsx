import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Container,
  Icon,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaArrowLeft, FaLocationArrow } from "react-icons/fa";
import Navbar from "../../layout/Navbar";
import Footer from "../../shared/Footer";
import { useColorStyles } from "../../hooks/useColorStyles";

const DeliveryOrderMap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const colors = useColorStyles();

  const order = location.state?.order;
  const dt = order?.created_at ? new Date(order.created_at) : new Date();
  const formattedDate = dt.toLocaleDateString("en-GB");
  const formattedTime = dt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const latitude =
    order?.latitude !== undefined && order?.latitude !== null
      ? Number(order.latitude)
      : null;
  const longitude =
    order?.longitude !== undefined && order?.longitude !== null
      ? Number(order.longitude)
      : null;

  const hasCoordinates =
    typeof latitude === "number" &&
    !Number.isNaN(latitude) &&
    typeof longitude === "number" &&
    !Number.isNaN(longitude);

  const mapQuery = hasCoordinates ? `${latitude},${longitude}` : null;

  const mapSrc = mapQuery
    ? `https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`
    : null;

  const handleNavigateClick = () => {
    if (!hasCoordinates) return;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    window.open(url, "_blank");
  };

  return (
    <>
      <Box minH="100vh" color="white" py={6}>
        <Container maxW="container.lg">
          <Flex alignItems="center" mb={6} justifyContent="space-between">
            <Flex alignItems="center" gap={3}>
              <Button
                size="sm"
                variant="outline"
                color={colors.mainFixed}
                borderColor={colors.mainFixed}
                leftIcon={<FaArrowLeft />}
                onClick={() => navigate(-1)}
              >
                Back to Orders
              </Button>
            </Flex>
          </Flex>

          <Box
            bg="white"
            h="90vh"
            borderRadius="2xl"
            border={`1px solid ${colors.bgFourth}`}
            p={4}
            mb={9}
          >
            <Flex
              bg={colors.bgThird}
              borderRadius="2xl"
              height="100%"
              position="relative"
              overflow="hidden"
              border={`1px solid ${colors.bgFourth}`}
            >
              {hasCoordinates ? (
                <>
                  <Box
                    as="iframe"
                    src={mapSrc}
                    title="Order location map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <Flex
                    position="absolute"
                    inset="0"
                    alignItems="center"
                    justifyContent="center"
                    pointerEvents="none"
                  >
                    {/* <Icon
                      as={FaMapMarkerAlt}
                      boxSize={10}
                      color="#FF3F3F"
                      filter="drop-shadow(0 4px 8px rgba(0,0,0,0.45))"
                    /> */}
                  </Flex>
                </>
              ) : (
                <Flex
                  width="100%"
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                  bgGradient="linear(to-br, #3b1a1a, #120606)"
                >
                  <Icon as={FaMapMarkerAlt} boxSize={10} color="#FF3F3F" />
                </Flex>
              )}

              <Box
                position="absolute"
                left={{ base: 4, md: 6 }}
                bottom={{ base: 4, md: 6 }}
                bg={colors.bgThird}
                px={4}
                py={2}
                borderRadius="xl"
                border={`1px solid ${colors.bgFourth}`}
                maxW="80%"
                boxShadow="0 10px 25px rgba(0,0,0,0.35)"
              >
                <Text fontSize="sm" color={colors.textMain} noOfLines={2}>
                  {order?.address || "Address not available"}
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* <Box
            bg={colors.bgThird}
            borderRadius="2xl"
            p={5}
            border={`1px solid ${colors.bgFourth}`}
          >
            <Heading size="md" mb={3}>
              Order Details
            </Heading>
            <Text color={colors.textSub}>
              Status: {order?.status || "Unknown"}
            </Text>
            <Text color={colors.textSub}>
              Payment: {order?.payment_method || "Not specified"}
            </Text>
            <Text color={colors.textSub}>
              Total: {order?.total ? `${order.total.toFixed(2)} LE` : "-"}
            </Text>

            <Button
              mt={4}
              w={{ base: "full", md: "auto" }}
              leftIcon={<FaLocationArrow />}
              bg={colors.mainFixed}
              color="white"
              borderRadius="full"
              onClick={handleNavigateClick}
              isDisabled={!hasCoordinates}
              _hover={{ bg: colors.mainFixed, opacity: 0.9 }}
            >
              Open in Maps
            </Button>
          </Box> */}
        </Container>
      </Box>
    </>
  );
};

export default DeliveryOrderMap;
