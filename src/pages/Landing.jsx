import React from "react";
import Navbar from "../components/Landingpage/Navbar";
import { Box, Button, Container, Heading } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import colors from "../theme/color";
import { useColorMode } from "../theme/color-mode";
import { Image } from "@chakra-ui/react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import Cards from "../components/Landingpage/Cards";
import Testimonials from "../components/Landingpage/Testimonials";
import Footer from "../shared/Footer";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Landing() {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  return (
    <>
      <Container
        bgImage="url('/assets/Pattern.png')"
        bgRepeat="no-repeat "
        minH="100vh"
        position={"relative"}
        bgSize="cover"
        bgPosition="center"
        bgBlendMode="normal"
        bgColor={
          colorMode === "light" ? colors.light.mainFixed : colors.dark.bgMain
        }
        maxW={"100vw"}
        padding={0}
        margin={0}
        pt="20px"
      >
        <Navbar />

        {/* Hero Section */}

        <Box
          textAlign={"center"}
          mt={{ base: 20, md: 20, lg: 30 }}
          mb={{ base: 20, md: 40, lg: 60 }}
          mx={{ base: 20, md: 40, lg: 200 }}
          color={"white"}
          position="relative"
        >
          {/* light effect in light mode on header using radial gradient */}
          {colorMode === "light" ? (
            <Box
              position="absolute"
              top="70%"
              left="50%"
              transform="translate(-50%, -10%)"
              w={{ base: "400px", md: "800px", lg: "1200px" }}
              h={{ base: "200px", md: "300px", lg: "400px" }}
              bg="radial-gradient(circle, white 0%, transparent 50%)"
              filter="blur(100px)"
              zIndex={0}
            />
          ) : null}

          {/* headings  */}
          <VStack spacing={0} align="center" position="relative" zIndex={1}>
            <Heading
              as="h1"
              size="lg"
              fontWeight="bold"
              lineHeight="0.8"
              textAlign={"center"}
              whiteSpace={"nowrap"}
              fontSize={{ base: "60px", sm: "100px", md: "100px", lg: "150px" }}
              m={0}
            >
              {t("landing.heroTitle1")}
            </Heading>
            <Heading
              as="h1"
              size="lg"
              fontWeight="bold"
              lineHeight="0.8"
              textAlign={"center"}
              whiteSpace={"nowrap"}
              fontSize={{ base: "60px", sm: "100px", md: "100px", lg: "150px" }}
              m={0}
            >
              {t("landing.heroTitle2")}
            </Heading>
          </VStack>
        </Box>

        {/* curved white svg background */}

        <Box
          position={"absolute"}
          left={0}
          right={0}
          top={{ base: "80%", md: "60%", lg: "60%" }}
          height={{ base: "200px", md: "400px", lg: "400px" }}
          width={{ base: "100%", md: "100%" }}
          px={0}
          margin={0}
        >
          <svg
            width="100%"
            preserveAspectRatio="none"
            viewBox="0 0 1920 490"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            height={"100%"}
          >
            <g clip-path="url(#clip0_217_374)">
              <path
                d="M1920 150.82V489.5H0V150.46C265.5 56.12 598.28 0 959.5 0C1320.72 0 1654.34 56.26 1920 150.82Z"
                fill={colorMode === "light" ? "white" : colors.dark.bgMain}
              />
            </g>
            <defs>
              <clipPath id="clip0_217_374">
                <rect width="1920" height="489.5" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </Box>

        {/* tablya's image  */}

        <Box>
          <Image
            src="/assets/tablya.png"
            alt={t("landing.tablyaAlt")}
            position={"absolute"}
            left="50%"
            top={{ base: "65%", md: "50%" }}
            transform="translate(-50%, -10%)"
            height={{ base: "250px", sm: "300px", md: "400px", lg: "400px" }}
            zIndex={2}
          />

          {/* white shaddow effect */}
          {colorMode === "light" ? (
            <Box
              position="absolute"
              top="80%"
              left="50%"
              transform="translate(-50%, -10%)"
              w={{ base: "400px", md: "800px", lg: "1200px" }}
              h={{ base: "200px", md: "300px", lg: "400px" }}
              bg="radial-gradient(circle, white 0%, transparent 50%)"
              filter="blur(100px)"
              zIndex={3}
            />
          ) : null}

          {colorMode === "light" ? (
            <Box
              position="absolute"
              top="80%"
              left="70%"
              transform="translate(-70%, -10%)"
              w={{ base: "400px", md: "800px", lg: "1200px" }}
              h={{ base: "200px", md: "300px", lg: "400px" }}
              bg="radial-gradient(circle, white 0%, transparent 50%)"
              filter="blur(100px)"
              zIndex={3}
            />
          ) : null}
        </Box>

        {/* ************************************************************************************************* */}

        {/* Button of get start */}
        <Box mx={"auto"} w="200px" h="100px">
          <Link to="/login">
            <Button
              display="flex"
              _hover={{ transform: "scale(1.05)" }}
              alignItems="center"
              zIndex={3}
              justifyContent="center"
              gap="8px"
              px="25px"
              py={"25px"}
              position={"absolute"}
              borderRadius={20}
              background={
                colorMode === "light"
                  ? colors.light.textMain
                  : colors.light.white
              }
              color={colorMode === "light" ? "white" : colors.light.textMain}
              top={{ base: "50%", md: "80%" }}
              fontSize={"23px"}
            >
              {" "}
              {t("landing.getStart")}
              <MdKeyboardDoubleArrowRight />{" "}
            </Button>
          </Link>
        </Box>
      </Container>

      {/* end of hero section container */}

      {/* Cards section contains 3 Cards */}

      <Box
        pt={{ base: 20, md: 10 }}
        bg={colorMode === "light" ? "white" : colors.dark.bgMain}
      >
        <Cards />
      </Box>

      {/* Testimonials section */}
      <Box
        pt={{ base: 20, md: 10 }}
        bg={colorMode === "light" ? "white" : colors.dark.bgSecond}
      >
        <Testimonials />
      </Box>

      {/* Footer section  */}
      <Footer />
    </>
  );
}
