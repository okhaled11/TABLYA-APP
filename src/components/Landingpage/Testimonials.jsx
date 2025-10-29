
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow, Autoplay, } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import {
  Box, Text, Heading, Flex, Image, Container,
  Button,
} from "@chakra-ui/react";
import { FaQuoteLeft, FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Card } from "@chakra-ui/react";
import { useColorMode } from "../../theme/color-mode";


// dummy data will be replaced next
const testimonials = [
  {
    id: 1,
    name: "Sara K.",
    date: "August 2025",
    text: "I’m so glad I found this website! The food is incredible, and it feels so good to support local cooks. It’s like having a home-cooked meal without any of the work",
    rating: 5,
    img: "/assets/customer.png",
  },
  {
    id: 2,
    name: "Sara K.",
    date: "July 2025",
    text: "I’m so glad I found this website! The food is incredible, and it feels so good to support local cooks. It’s like having a home-cooked meal without any of the work",
    rating: 4,
    img: "/assets/customer.png",
  },
  {
    id: 3,
    name: "Sara K.",
    date: "June 2025",
    text: "I’m so glad I found this website! The food is incredible, and it feels so good to support local cooks. It’s like having a home-cooked meal without any of the work",
    rating: 5,
    img: "/assets/customer.png",
  },
  {
    id: 4,
    name: "Sara K.",
    date: "May 2025",
    text: "I’m so glad I found this website! The food is incredible, and it feels so good to support local cooks. It’s like having a home-cooked meal without any of the work",
    rating: 5,
    img: "/assets/customer.png",
  },
  {
    id: 5,
    name: "Sara K.",
    date: "May 2025",
    text: "I’m so glad I found this website! The food is incredible, and it feels so good to support local cooks. It’s like having a home-cooked meal without any of the work",
    rating: 5,
    img: "/assets/customer.png",
  },
];

export default function Testimonials() {

  const { colorMode } = useColorMode();

  return (
    <Box
      bg={colorMode === "light" ? "rgb(254, 234, 228)" : "rgb(46, 22, 20)"}
      py={{ base: 16, md: 24 }}
    >
      <Container maxW="container.xl" position="relative">
        <Heading
          textAlign="center"
          mb={10}
          fontWeight="bold"
          color={colorMode === "light" ? "rgb(31, 6, 4)" : "white"}
          fontSize={{ base: "2xl", md: "50px" }}
        >
          What Our Customers Say
        </Heading>

        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          // spaceBetween={200}
          // slidesPerView="auto"
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 3 },
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 180,
            modifier: 1,
            slideShadows: false,
            scale: 0.8,
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
          navigation={{
            nextEl: ".next-button",
            prevEl: ".prev-button",
          }}
          style={{ paddingBottom: "100px" }}

        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <Flex justify="center" mt={"10px"}>
                <Card.Root

                  bg={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
                  borderRadius="2xl"
                  w={{ base: "300px", md: "400px" }}
                  h="100%"
                  border={"none"}
                  shadow="sm"
                  transition="transform 0.3s ease"
                  _hover={{ transform: "scale(1.03)" }}
                >
                  <Card.Body p={5} h="100%">
                    <FaQuoteLeft color="#f44336" size="28px" />
                    <Text
                      mt={4}
                      fontSize="sm"
                      color={colorMode === "light" ? "black" : "white"}
                      lineHeight="1.6"
                      mb={6}
                      noOfLines={5}
                    >
                      {item.text}
                    </Text>

                    <Box
                      h="1px"
                      bg={
                        colorMode === "light"
                          ? "rgb(233, 230, 230)"
                          : "rgb(43, 28, 26)"
                      }
                      my={4}
                    />

                    <Flex justify="space-between" align="center">
                      <Flex align="center" gap={3}>
                        <Image
                          src={item.img}
                          alt={item.name}
                          borderRadius="full"
                          boxSize="45px"
                          objectFit="cover"
                        />
                        <Box>
                          <Text
                            fontWeight="semibold"
                            fontSize="sm"
                            color={
                              colorMode === "light" ? "#2e0000" : "white"
                            }
                          >
                            {item.name}
                          </Text>
                          <Text
                            fontSize="xs"
                            color={
                              colorMode === "light"
                                ? "gray.500"
                                : "whiteAlpha.700"
                            }
                          >
                            {item.date}
                          </Text>
                        </Box>
                      </Flex>

                      <Flex>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            color={i < item.rating ? "#ff7b54" : "#ddd"}
                          />
                        ))}
                      </Flex>
                    </Flex>
                  </Card.Body>
                </Card.Root>
              </Flex>
            </SwiperSlide>
          ))}
        </Swiper>


      </Container>

      {/* pagination arrows and dots */}
      <Box mx={{ base: "100px", md: "300px", lg: "700px" }}>


        <Flex justify="center" align="center" mt={-10} gap={5}>

          <Button
            className="prev-button"

            aria-label="Previous"
            cursor={"pointer"}
            bg="#f44336"
            color="white"
            rounded="full"
            px="10px"
            _hover={{ bg: "red.500" }}
            size="sm">

            <FaArrowLeft />

          </Button>

          <Box className="custom-pagination" />

          <Button
            className="next-button"
            aria-label="Next"
            cursor={"pointer"}
            px="10px"
            bg="#f44336"
            color="white"
            rounded="full"
            _hover={{ bg: "red.500" }}
            size="sm"
          >

            <FaArrowRight />

          </Button>

        </Flex>

      </Box>
      {/* customization dots style */}
      <style>
        {`
        .custom-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        .swiper-pagination-bullet {
          background-color: rgb(232, 211, 206) !important;
          opacity: 0.5;
          transition: 0.3s;
          width: 10px;
          height: 10px;
        }
        .swiper-pagination-bullet-active {
          background-color: #f44336 !important;
          opacity: 1;
          transform: scale(1.2)
          }

          .swiper-slide {
         transition: opacity 0.4s ease;
          opacity: 0.6;
                       }

            .swiper-slide-active {
              opacity: 1; 
            }

           .prev-button, .next-button {
           cursor: pointer !important;
                       } 
        `}
      </style>




    </Box>
  );
}








