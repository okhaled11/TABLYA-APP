
import React from "react";
import {
    Box,
    Container,
    Flex,
    Text,
    Heading,
    VStack,
    HStack,
    Link,
    Image,} from "@chakra-ui/react";


import { FaTiktok, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { SiSnapchat } from "react-icons/si";
import logo from '../assets/logotitle.png';
import { FaFacebook } from "react-icons/fa";

const Footer = () => {
    return (
        <Box bg="#140706" color="white" py={10} >
            <Container maxW="6xl">
                {/* Logo */}
                <HStack spacing={3} mb={6}>
                    <Image src={logo} alt="Tablya Logo" height="40px" />
                </HStack>

                {/* Divide line */}
                <Box borderBottom="1px solid rgb(90, 77, 73)" mb={8}></Box>

                {/* Links Section */}
                <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    gap={10}
                    mb={8}

                >
                    <VStack align="flex-start" spacing={3}>
                        <Heading fontSize="lg">For Customers</Heading>
                        <Link color={"rgb(184, 174, 169)"}>Browse Sellers</Link>
                        <Link color={"rgb(184, 174, 169)"}>How It Works</Link>
                        <Link color={"rgb(184, 174, 169)"}>Customer Support</Link>
                    </VStack>

                    <VStack align="flex-start" spacing={3}>
                        <Heading fontSize="lg">For Sellers</Heading>
                        <Link color={"rgb(184, 174, 169)"}>Start Selling</Link>
                        <Link color={"rgb(184, 174, 169)"}>Seller Resources</Link>
                        <Link color={"rgb(184, 174, 169)"}>Seller Support</Link>
                    </VStack>

                    <VStack align="flex-start" spacing={3}>
                        <Heading fontSize="lg">Company</Heading>
                        <Link color={"rgb(184, 174, 169)"}>About Us</Link>
                        <Link color={"rgb(184, 174, 169)"}>Contact</Link>
                        <Link color={"rgb(184, 174, 169)"}>Privacy Policy</Link>
                    </VStack>
                </Flex>

                {/* Divide line */}
                <Box borderBottom="1px solid rgb(90, 77, 73)" mb={6}></Box>

                {/* Bottom Row */}
                <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align="center"
                    gap={4}
                >
                    <Text fontSize="sm">
                        Made By <Text as="span" fontWeight="bold">Tablya</Text> Team 2025
                    </Text>

                    <HStack spacing={5}>

                        <Link color={"white"} fontSize={"30px"}><FaFacebook /></Link>
                        <Link color={"white"} fontSize={"30px"}> <FaTiktok />  </Link>
                        <Link color={"white"} fontSize={"30px"}><FaInstagram />   </Link>
                        <Link color={"white"} fontSize={"30px"}><SiSnapchat /></Link>
                        <Link color={"white"} fontSize={"30px"}><FaXTwitter /> </Link>

                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
};

export default Footer;
