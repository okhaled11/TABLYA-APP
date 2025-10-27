
import React, { useState } from "react";
import { useColorMode } from '../../theme/color-mode';
import {
  Box,
  Text,
  Heading,
  Flex,
  Image,
  IconButton,
  HStack,
  Container,
} from "@chakra-ui/react";
import { FaQuoteLeft, FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Card } from "@chakra-ui/react";

const testimonials = [
  {
    id: 1,
    name: "Sara K.",
    date: "August 2025",
    text: "I'm so glad I found this website! The food is incredible, and it feels so good to support local cooks. It’s like having a home-cooked meal without any of the work.",
    rating: 5,
    img: "https://i.pravatar.cc/60?img=1",
  },
  {
    id: 2,
    name: "Omar M.",
    date: "July 2025",
    text: "Amazing quality and fast delivery. Feels just like homemade!",
    rating: 4,
    img: "https://i.pravatar.cc/60?img=2",
  },
  {
    id: 3,
    name: "Lina S.",
    date: "June 2025",
    text: "Perfect taste every time! Highly recommend this place.",
    rating: 5,
    img: "https://i.pravatar.cc/60?img=3",
  },
  {
    id: 4,
    name: "Ali R.",
    date: "May 2025",
    text: "Exceptional service and amazing taste!",
    rating: 5,
    img: "https://i.pravatar.cc/60?img=4",
  },
];

export default function Testimonials() {


  const { colorMode, toggleColorMode } = useColorMode();
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <Box bg={colorMode === "light" ? "rgb(254, 234, 228)" : "rgb(46, 22, 20)"} py={{ base: 16, md: 24 }} overflow="hidden">
      <Container maxW="container.xl">
        <Heading
          textAlign="center"
          mb={12}
          fontWeight="bold"
          color={colorMode === "light" ? "rgb(126, 34, 24)" : "white"}
          fontSize={{ base: "2xl", md: "4xl" }}
        >
          What Our Customers Say
        </Heading>

        <Flex justify="center" align="center" position="relative" minH="250px">
          {testimonials.map((item, index) => {
            const diff = index - current;

            let scale = 0.85;
            let opacity = 0.7;
            let zIndex = 5;
            let xOffset = 0;

            if (diff === 0) {

              scale = 1;
              opacity = 1;
              zIndex = 10;
              xOffset = 0;
            } else if (diff === -1 || (diff === testimonials.length - 1 && current === 0)) {

              scale = 0.85;
              opacity = 0.7;
              xOffset = -350;
            } else if (diff === 1 || (diff === -(testimonials.length - 1) && current === testimonials.length - 1)) {

              scale = 0.85;
              opacity = 0.7;
              xOffset = 350;
            } else {

              opacity = 0;
              xOffset = diff * 400;
              zIndex = 1;
            }

            return (
              <Box
                key={item.id}
                position="absolute"
                top="50%"
                left="50%"
                transform={`translate(-50%, -50%) translateX(${xOffset}px) scale(${scale})`}
                transition="all 0.5s ease"
                opacity={opacity}
                zIndex={zIndex}
                w={{ base: "320px", md: "350px" }}
                h="250px"
                border="none"

              >
                <Card.Root
                  bg={colorMode === "light" ? "white" : "rgb(20, 4, 2)"}
                  borderRadius="2xl"

                  transition="all 0.3s"
                  h="100%"
                >
                  <Card.Body p={5} h="100%">
                    <FaQuoteLeft color="#f44336" size="28px" />
                    <Text mt={4} fontSize="sm" color={colorMode === "light" ? "grey.200" : "white"} lineHeight="1.6" mb={6}>
                      {item.text}
                    </Text>

                    <Box h="1px" bg={colorMode === "light" ? "rgb(233, 230, 230)" : "rgb(43, 28, 26)"} my={4} />

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
                          <Text fontWeight="semibold" fontSize="sm" color={colorMode === "light" ? "#2e0000" : "white"}      >
                            {item.name}
                          </Text>
                          <Text fontSize="xs" color={colorMode === "light" ? "grey.500" : "white"}>
                            {item.date}
                          </Text>
                        </Box>
                      </Flex>

                      <Flex>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar key={i} color={i < item.rating ? "#ff7b54" : "#ddd"} />
                        ))}
                      </Flex>
                    </Flex>
                  </Card.Body>
                </Card.Root>
              </Box>
            );
          })}
        </Flex>

        {/* الأسهم والدوتس */}
        <Flex justify="center" align="center" mt={10} gap={5}>
          <IconButton
            p={"10px"}
            aria-label="Previous"
            color={"white"}
            as={FaArrowLeft}
            bg="#f44336"
            rounded="full"
            onClick={prevSlide}
            _hover={{ bg: "red.500" }}
            fontSize="20px"
          />
          <HStack spacing={2}>
            {testimonials.map((_, i) => (
              <Box
                key={i}
                w="10px"
                h="10px"
                bg={i === current ? "red.500" : "gray.300"}
                rounded="full"
                cursor="pointer"
                onClick={() => setCurrent(i)}
              />
            ))}
          </HStack>
          <IconButton

            p={"10px"}
            aria-label="Next"
            color={"white"}
            // icon={<FaArrowRight size={16}/>}
            as={FaArrowRight}
            bg="#f44336"
            rounded="full"
            onClick={nextSlide}
            _hover={{ bg: "red.500" }}
          />
        </Flex>
      </Container>
    </Box>
  );
}
