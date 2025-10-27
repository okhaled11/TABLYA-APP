import React from 'react'
import Navbar from '../components/Landingpage/Navbar'
import { Box, Button, Card, Container, Heading } from '@chakra-ui/react';
import { VStack } from '@chakra-ui/react';
import colors from '../theme/color';
import { useColorMode } from '../theme/color-mode';
import { Image } from '@chakra-ui/react';
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import Cards from '../components/Landingpage/Cards';
import Testimonials from '../components/Landingpage/Testimonials';
import Footer from '../shared/Footer';
import { scale, transform } from 'framer-motion';






export default function Landing() {

  const { colorMode, toggleColorMode } = useColorMode();




  return (
    <>
      <Container bgImage="url('/assets/Pattern.png')" bgRepeat="no-repeat " minH="100vh"
        position={"relative"}
        bgSize="cover"
        bgPosition="center"
        bgBlendMode="normal" bgColor={colorMode === "light" ? colors.light.mainFixed : colors.dark.bgMain} maxW={"100vw"} padding={0} margin={0} pt="20px"

      >


        <Navbar />

        {/* Hero Section */}
        {/* <Box 
        
        
        textAlign={"center"} mt={{ base: 20, md: 40, lg: 30 }} mb={{ base: 20, md: 40, lg: 60 }} mx={{ base: 20, md: 40, lg: 200 }} color={"white"}>

          <VStack spacing={0} align="center">
            <Heading
              as="h1"
              size="xl"
              fontWeight="extrabold"
              lineHeight="0.8"
              fontSize={"150px"}
              m={0}

            >
              Come Eat,
            </Heading>
            <Heading
              as="h1"
              size="xl"
              fontWeight="extrabold"
              lineHeight="0.8"
              fontSize={"150px"}
              m={0}
            >

              
              Feel Home
            </Heading>
          </VStack>
        </Box> */}


        <Box
          textAlign={"center"}
          mt={{ base: 20, md: 40, lg: 30 }}
          mb={{ base: 20, md: 40, lg: 60 }}
          mx={{ base: 20, md: 40, lg: 200 }}
          color={"white"}
          position="relative"
        >
          {colorMode === "light" ? <Box
            position="absolute"
            top="70%"
            left="50%"
            transform="translate(-50%, -10%)"
            w={{ base: "400px", md: "800px", lg: "1200px" }}
            h={{ base: "200px", md: "300px", lg: "400px" }}
            bg="radial-gradient(circle, white 0%, transparent 50%)"
            filter="blur(100px)"
            zIndex={0}
          /> : null}


          <VStack spacing={0} align="center" position="relative" zIndex={1}>
            <Heading
              as="h1"
              size="xl"
              fontWeight="extrabold"
              lineHeight="0.8"
              fontSize={"150px"}
              m={0}
            >
              Come Eat,
            </Heading>
            <Heading
              as="h1"
              size="xl"
              fontWeight="extrabold"
              lineHeight="0.8"
              fontSize={"150px"}
              m={0}
            >
              Feel Home
            </Heading>
          </VStack>
        </Box>






        {/* curved white svg background */}


        <Box position={"absolute"} left={0} right={0} width="100%" top={"70%"}>



          <svg width="100%" viewBox="0 0 1920 490" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_217_374)">
              <path d="M1920 150.82V489.5H0V150.46C265.5 56.12 598.28 0 959.5 0C1320.72 0 1654.34 56.26 1920 150.82Z" fill={colorMode === "light" ? "white" : colors.dark.bgMain} />
            </g>
            <defs>
              <clipPath id="clip0_217_374">
                <rect width="1920" height="489.5" fill="white" />
              </clipPath>
            </defs>
          </svg>


        </Box>

        {/* tablya's image  */}

        <Box >

          <Image src="/assets/tablya.png" alt="Tablya Logo" position={"absolute"} top="50%"
            left="50%"
            transform="translate(-50%, -10%)"
            height={{ base: "150px", md: "200px", lg: "400px" }}
            zIndex={2}
          />

        </Box>







        <Button display="flex"
          _hover={{ transform: "translateX(-50%) scale(1.05)" }}
          alignItems="center"
          zIndex={3}
          justifyContent="center"
          gap="8px"
          px="30px"
          py={"25px"}
          position={"absolute"}
          borderRadius={20}
          background={colorMode === "light" ? "rgb(31, 6, 4)" : "rgb(255, 247, 240)"}
          color={colorMode === "light" ? "white" : "rgb(31, 6, 4)"}
          left="50%"
          transform="translateX(-50%)"
          fontSize={"23px"}> Get Start<MdKeyboardDoubleArrowRight /> </Button>







      </Container>

      <Box mt={{ base: "200px", md: "100px" }} bg={colorMode === "light" ? "white" : "rgb(31, 6, 4)"}>
        <Cards />
      </Box>



      <Box mt={{ base: "200px", md: "100px" }} bg={colorMode === "light" ? "white" : "rgb(31, 6, 4)"}>
        <Testimonials />
      </Box>

      <Footer />


    </>

  )
}
