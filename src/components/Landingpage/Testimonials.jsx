
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow, Autoplay, } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import i18n from "../../i18n";
import { useEffect } from "react";
import { Avatar } from "@chakra-ui/react"

import {
  Box, Text, Heading, Flex, Image, Container,
  Button,HStack , Stack
} from "@chakra-ui/react";
import { FaQuoteLeft, FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Card } from "@chakra-ui/react";
import { useColorMode } from "../../theme/color-mode";
import { useTranslation } from "react-i18next";
import { useGetLandingReviewsQuery } from "../../app/features/Landing/LandingReviews";



export default function Testimonials() {
  const { data: reviews, isLoading } = useGetLandingReviewsQuery();
 
  const filteredReviews = reviews?.filter(item => item.rating === 5);


  const { t } = useTranslation();

  const { colorMode } = useColorMode();

  //   useEffect(() => {
  //   document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  // }, [i18n.language]);


  return (
    <Box
      bg={colorMode === "light" ? "rgb(254, 234, 228)" : "rgb(46, 22, 20)"}
      py={{ base: 16, md: 24 }}



    >
      <Container maxW="container.xl" position="relative" >
        <Heading
          textAlign="center"
          mb={10}
          fontWeight="bold"
          color={colorMode === "light" ? "rgb(31, 6, 4)" : "white"}
          fontSize={{ base: "2xl", md: "50px" }}

        >
          {/* What Our Customers Say */}
          {t("testimonials.title")}
        </Heading>
        <Box dir={i18n.language === "ar" ? "rtl" : "ltr"}>




          <Swiper

            modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            dir="ltr"
            style={{ direction: "ltr", paddingBottom: "100px" }}

            spaceBetween={10}

            slidesPerView={1}
            breakpoints={{
              // 1000: { slidesPerView: 2 },
              860: { slidesPerView: 3, spaceBetween: 0 },
              1200: { slidesPerView: 3, spaceBetween: 0 },
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


          >
            {isLoading ? (<Flex justify="center" align="center" height="250px">
              <Image
                src="src\assets\Transparent Version.gif"
                alt="loading"
                width="100px"
                height="100px"
                objectFit="contain"
              />
            </Flex>) : (filteredReviews?.map((item) => {
              // convert date to short numeric

              const options = { year: "numeric", month: "short", day: "numeric" };
              const day = new Date(item.created_at).toLocaleDateString("en-US", options);


              return (
                <SwiperSlide key={item.id}>
                  <Flex justify="center" mt={"10px"}>
                    <Card.Root

                      bg={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
                      borderRadius="2xl"
                      w={{ base: "400px", md: "400px" }}
                      // h="100%"
                      h="250px"
                      border={"none"}
                      shadow="sm"
                      transition="transform 0.3s ease"
                      _hover={{ transform: "scale(1.03)" }}
                    >
                      <Card.Body p={5} h="100%" display="flex" flexDirection="column" justifyContent="space-between">
                        <Box
                          // scroll
                          overflowY="auto"
                          maxH="200px"
                          css={{
                            /* Firefox */
                            scrollbarWidth: "none",
                            /* IE 10+ */
                            msOverflowStyle: "none",
                            /* Chrome, Safari, Opera */
                            "&::-webkit-scrollbar": {
                              display: "none",
                            },
                          }}

                        >


                          <Flex justifyContent={"space-between"}>



                            <FaQuoteLeft color="#f44336" size="28px" />
                            
                            <HStack gap="1">
                              <Text fontSize={"small"}>{t("testimonials.forChef")}</Text>
                              <Avatar.Root style={{ width: "28px", height: "28px" }}>
                                <Avatar.Fallback />
                                <Avatar.Image src={item.cooker?.avatar_url} />
                              </Avatar.Root>
                              <Stack gap="0">
                                <Text fontWeight="medium" fontSize={"small"}>{item?.cooker?.name?`${item.cooker.name.split (" ")[0]} ${item.cooker.name.split(" ")[1]?.[0]|| ""}.` :""}</Text>
                              </Stack>
                            </HStack>
                          </Flex>
                          <Text
                            mt={4}
                            fontSize="sm"
                            color={colorMode === "light" ? "black" : "white"}
                            lineHeight="1.6"
                            mb={4}
                            noOfLines={3}
                          >
                            {item.comment}
                          </Text>


                        </Box >
                        {/* mt auto to stick in bottom */}
                        <Box mt="auto">

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
                              {/* <Image
                            src={item.img}
                            alt={item.name}
                            borderRadius="full"
                            boxSize="45px"
                            objectFit="cover"
                          /> */}


                              <Avatar.Root colorPalette={"red"}>
                                <Avatar.Fallback />
                              </Avatar.Root>
                              <Box>
                                <Text
                                  fontWeight="semibold"
                                  fontSize="sm"
                                  color={
                                    colorMode === "light" ? "#2e0000" : "white"
                                  }
                                >
                                  {item.customer?.user?.name}
                                </Text>
                                <Text
                                  fontSize="xs"
                                  color={
                                    colorMode === "light"
                                      ? "gray.500"
                                      : "whiteAlpha.700"
                                  }
                                >
                                  {day}
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

                        </Box>

                      </Card.Body>
                    </Card.Root>
                  </Flex>
                </SwiperSlide>

              );


            }))}
          </Swiper>

        </Box>


      </Container>

      {/* pagination arrows and dots */}
      {/* <Box mx={{ base: "100px", md: "300px", lg: "700px" }}> */}


      <Flex justify="center" align="center" mt={-10} gap={5}>

        <Box className="custom-pagination" />

      </Flex>

      {/* </Box> */}
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

          .swiper {
  overflow: hidden !important;
}
        `}
      </style>




    </Box>
  );
}








