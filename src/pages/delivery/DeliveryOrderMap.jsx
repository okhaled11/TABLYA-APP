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
import { FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa";
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

  return (
    <>
      <Navbar />
      <Box bg={colors.bgFixed} minH="100vh" color="white">
        <Container maxW="container.lg" py={6}>
          <Flex alignItems="center" mb={6} justifyContent="space-between">
            <Flex alignItems="center" gap={3}>
              <Button
                size="sm"
                variant="outline"
                color="white"
                borderColor="white"
                leftIcon={<FaArrowLeft />}
                onClick={() => navigate(-1)}
              >
                Back to Orders
              </Button>
              <Text color={colors.textSub}>Orders &gt; Order in map</Text>
            </Flex>
          </Flex>

          <Box
            bg="#2b0c0c"
            borderRadius="2xl"
            border={`1px solid ${colors.bgFourth}`}
            p={6}
            mb={6}
          >
            <Flex
              justifyContent="space-between"
              alignItems={{ base: "flex-start", md: "center" }}
              flexDirection={{ base: "column", md: "row" }}
              mb={4}
            >
              <Text color={colors.textSub} fontSize="sm">
                {formattedDate} | {formattedTime} | #{orderId?.slice(0, 12)}
              </Text>
              <Text fontSize="lg" fontWeight="bold" color={colors.mainFixed}>
                #{order?.id?.slice(0, 10) || orderId}
              </Text>
            </Flex>
            <Flex
              bg="#260909"
              borderRadius="2xl"
              height={{ base: "280px", md: "360px" }}
              position="relative"
              alignItems="flex-end"
              padding={6}
              overflow="hidden"
              border={`1px solid ${colors.bgFourth}`}
            >
              <Box
                position="absolute"
                inset="0"
                bg="radial-gradient(circle, rgba(255,78,78,0.4), transparent 45%)"
                opacity={0.7}
              />
              <Flex
                position="relative"
                width="full"
                height="full"
                borderRadius="2xl"
                backgroundImage="linear-gradient(120deg, rgba(38,38,38,0.8) 0%, rgba(11,11,11,0.95) 100%)"
                justifyContent="center"
                alignItems="center"
              >
                <Icon
                  as={FaMapMarkerAlt}
                  boxSize={10}
                  color="#FF3F3F"
                  position="absolute"
                />
              </Flex>
              <Box
                position="relative"
                bg={colors.bgThird}
                px={4}
                py={2}
                borderRadius="xl"
                border={`1px solid ${colors.bgFourth}`}
                mb={2}
              >
                <Text fontSize="sm" color={colors.textMain}>
                  {order?.address || "123 Ahmed Oraby Street, Suez"}
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box
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
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default DeliveryOrderMap;
