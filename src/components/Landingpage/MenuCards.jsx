import React, { useState } from 'react'
import { Box, Container, useBreakpointValue } from '@chakra-ui/react'
import i18n from "../../i18n";
import { useColorMode } from "../../theme/color-mode";
import { useTranslation } from "react-i18next";
import { Heading } from '@chakra-ui/react';
import colors from '../../theme/color';
import { SimpleGrid, VStack, Image, Text, HStack, Stack, Avatar, IconButton } from '@chakra-ui/react';
import { useGetLandingMenuItemsQuery } from '../../app/features/Landing/LandingMenuApi';
import { useNavigate } from 'react-router-dom';

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";


export default function MenuCards() {
    const { t } = useTranslation();
    const { colorMode } = useColorMode();
    const { data: menu = [], error } = useGetLandingMenuItemsQuery();
   
    const navigate = useNavigate();

    const isMobile = useBreakpointValue({ base: true, md: false })

    return (
        <Box id={"menu"} bg={colorMode === "light" ? "rgb(255, 247, 240)" : colors.dark.bgMain}
            py={{ base: 10, md: 24 }}
        >

            <Heading
                lineHeight={"normal"}
                textAlign="center"
                mb={10}
                fontWeight="semibold"
                fontSize={{ base: "2xl", md: "50px" }}
                color={colorMode === "light" ? "rgb(31, 6, 4)" : "white"}
            >
                <Text as="span" color="rgb(255, 43, 43)">{t("landing.menuTitle1")}</Text>{" "}
                {t("landing.menuTitle2")} <br /> {t("landing.menuTitle3")}{" "}
                <Text as="span" color="rgb(255, 43, 43)">
                  {t("landing.menuTitle4")}
                </Text>
            </Heading>

            <Container maxW="7xl" py={{ base: 10, md: 20 }}>

                {/* swiper in mobile */}
                {isMobile ? (<Swiper
                    modules={[Pagination, Navigation]}
                    pagination={{ clickable: true }}
                    navigation
                    spaceBetween={20}
                    slidesPerView={1}

                    style={{
                        paddingTop: "40px",
                        overflow: "visible",
                        paddingBottom: "40px"
                    }}
                >
                    {menu.slice(0, 8).map((item) => (
                        <SwiperSlide key={item.id}>
                            <Box display="flex" justifyContent="center">


                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="space-between"
                                    position="relative"
                                    borderRadius="30px"
                                    py={6}
                                    px={6}
                                    my={4}
                                    width="100%"
                                    maxW="280px"
                                    overflow="visible"
                                    height="380px"
                                    textAlign="center"
                                    background={colorMode === "light"
                                        ? "linear-gradient(to top, #FFD1C4 0%, #FFE4DD 40%, #FFF7F4 80%, white 100%)"
                                        : "linear-gradient(to top, rgb(31, 6, 4) 0%, rgba(122, 22, 19, 1) 40%, rgb(20, 4, 2) 80%, rgb(20, 4, 2) 100%)"
                                    }
                                    boxShadow="0 8px 25px rgba(0,0,0,0.08)"
                                >

                                    <Box
                                        position="absolute"
                                        top="-55px"
                                        left="50%"
                                        transform="translateX(-50%)"
                                        width="210px"
                                        height="210px"
                                        borderRadius="full"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        background={colorMode === "light"
                                            ? "linear-gradient(to top, white 0%, #FFE0D0 60%, #FFB897 80%, #FF8A6D 100%)"
                                            : "linear-gradient(to top, rgb(20, 4, 2) 0%, rgba(57, 14, 8, 1) 60%, rgba(123, 24, 20, 1) 80%, rgb(106, 19, 16) 100%)"}
                                        p="8px"
                                    >
                                        <Box width="200px" height="200px" overflow="hidden" borderRadius="full">
                                            <Image src={item.menu_img} width="100%" height="100%" objectFit="cover" />
                                        </Box>
                                    </Box>

                                    <Box position="absolute" top="70px" right="30px">
                                        <Box
                                            bg={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
                                            borderRadius="full"
                                            width="54px"
                                            height="54px"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Box
                                                bg="rgb(255, 43, 43)"
                                                color="white"
                                                fontWeight="bold"
                                                borderRadius="full"
                                                width="48px"
                                                height="48px"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                fontSize="12px"
                                            >
                                                {item.price_for_customer} L.E
                                            </Box>
                                        </Box>
                                    </Box>

                                    <VStack spacing={4} mt="130px" position="relative">
                                        <HStack gap="1" mt={2}>
                                            <Avatar.Root style={{ width: "28px", height: "28px" }}>
                                                <Avatar.Image src={item.cooker?.avatar_url} />
                                            </Avatar.Root>
                                            <Stack gap="0">
                                                <Text fontWeight="medium" fontSize="small">{item.kitchen_name}</Text>
                                            </Stack>
                                        </HStack>

                                        <Heading fontSize="20px" fontWeight="bold" color={colorMode === "light" ? "rgb(255, 43, 43)" : "white"} mt={2}>
                                            {item.title}
                                        </Heading>

                                        <Text
                                            fontSize="14px"
                                            color={colorMode === "light" ? "gray.600" : "white"}
                                            width="100%"
                                            px={3}
                                            height="100%"
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                            display="-webkit-box"
                                            style={{
                                                WebkitLineClamp: 4,
                                                WebkitBoxOrient: "vertical"
                                            }}
                                        >
                                            {item.description}
                                        </Text>

                                        <Box
                                            position="absolute"
                                            top="200px"
                                            bg="rgb(250, 44, 35)"
                                            color="white"
                                            fontWeight="bold"
                                            px={7}
                                            py={2.5}
                                            borderRadius="30px"
                                            cursor="pointer"
                                            fontSize="15px"
                                            onClick={() =>
                                                navigate(`/home/cookers/${item.cooker_id}/meals/${item.id}`)
                                            }
                                        >
                                            {t("landing.orderNow")}
                                        </Box>
                                    </VStack>
                                </Box>

                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
                ) : (


                    <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 4 }} spacing={"10px"} justifyItems="center" columnGap={{ base: "30px", md: "30px", lg: "10px" }} rowGap="70px">
                        {menu?.slice(0, 8).map((item) => (




                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="space-between"
                                position="relative"
                                borderRadius="30px"
                                py={6}
                                px={6}
                                my={4}
                                width="100%"
                                maxW="280px"
                                overflow="visible"
                                height="380px"
                                textAlign="center"
                                background={colorMode === "light" ?
                                    "linear-gradient(to top, #FFD1C4 0%, #FFE4DD 40%, #FFF7F4 80%, white 100%) !important"
                                    : "linear-gradient(to top, rgb(31, 6, 4) 0%, rgba(122, 22, 19, 1) 40%, rgb(20, 4, 2) 80%, rgb(20, 4, 2) 100%) !important"}
                                boxShadow="0 8px 25px rgba(0,0,0,0.08)"
                                transition="all 0.3s ease"

                                _hover={{
                                    transform: "translateY(-10px)",
                                    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                                }}
                            >

                                {/* IMAGE GRADIENT CIRCLE WRAPPER */}
                                <Box
                                    position="absolute"
                                    top="-55px"
                                    left="50%"
                                    transform="translateX(-50%)"
                                    width="210px"
                                    height="210px"
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"

                                    background={colorMode === "light" ? "linear-gradient(to top, white 0%, #FFE0D0 60%, #FFB897 80%, #FF8A6D 100%)"
                                        : "linear-gradient(to top, rgb(20, 4, 2) 0%, rgba(57, 14, 8, 1) 60%, rgba(123, 24, 20, 1) 80%, rgb(106, 19, 16) 100%)"
                                    }
                                    padding="8px"

                                >
                                    <Box
                                        width="200px"
                                        height="200px"
                                        overflow="hidden"
                                        borderRadius="full"

                                    >
                                        <Image
                                            src={item.menu_img}
                                            width="100%"
                                            height="100%"
                                            objectFit="cover"
                                        />
                                    </Box>
                                </Box>

                                {/* PRICE TAG */}

                                <Box position="absolute"
                                    top="70px"
                                    right="30px"
                                    bg={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}


                                    borderRadius="full"
                                    width="54px"
                                    height="54px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"

                                >


                                    <Box

                                        bg="rgb(255, 43, 43)"
                                        // color={colorMode === "light" ? "white" : "black"}
                                        color={"white"}
                                        fontWeight="bold"
                                        borderRadius="full"
                                        width="48px"
                                        height="48px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontSize="12px"

                                    >
                                        {item.price_for_customer} L.E
                                    </Box>

                                </Box>

                                {/* CONTENT */}
                                <VStack spacing={4} mt="130px" position={"relative"}>

                                    <HStack gap="1" mt={2}>
                                        <Avatar.Root style={{ width: "28px", height: "28px" }}>
                                            <Avatar.Fallback />
                                            <Avatar.Image src={item.cooker?.avatar_url} />
                                        </Avatar.Root>
                                        <Stack gap="0">
                                            <Text fontWeight="medium" fontSize={"small"}>{item.kitchen_name}</Text>
                                        </Stack>
                                    </HStack>


                                    <Heading fontSize="20px" fontWeight="bold" color={colorMode === "light" ? "rgb(255, 43, 43)" : "white"} mt={2}>
                                        {item.title}
                                    </Heading>

                                    <Text fontSize="14px"
                                        color={colorMode === "light" ? "gray.600" : "white"}

                                        width={"100%"}
                                        px={3}

                                        height="100%"
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                        display="-webkit-box"
                                        style={{
                                            WebkitLineClamp: 4,
                                            WebkitBoxOrient: "vertical"
                                        }}


                                    >
                                        {item.description}
                                    </Text>

                                    {/* BUTTON */}
                                    <Box
                                        position={"absolute"}
                                        top={"190px"}
                                        mt={3}
                                        bg="rgb(250, 44, 35)"
                                        color="white"
                                        fontWeight="bold"
                                        px={7}
                                        py={2.5}
                                        borderRadius="30px"
                                        cursor="pointer"
                                        fontSize="15px"
                                        _hover={{ bg: "#ff2b2b" }}
                                        onClick={() => navigate(`/home/cookers/${item.cooker_id}/meals/${item.id}`)}

                                    >
                                        {t("landing.orderNow")}
                                    </Box>
                                </VStack>
                            </Box>

                        ))}


                    </SimpleGrid>

                )}


            </Container>

            <style>
                {`
        .swiper-button-next,
        .swiper-button-prev {
          width: 32px !important;
          height: 32px !important;
          color: #ff2b2b !important;
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 18px !important;
        }

        .swiper-button-next,
        .swiper-button-prev {
         
          border-radius: 50%;
        }
      `}
            </style>




        </Box>
    )
}
