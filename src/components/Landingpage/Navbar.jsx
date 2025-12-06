import React, { useContext } from 'react'
import { FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

import { Box, Flex, HStack, Image, Link, IconButton, Button, VStack } from '@chakra-ui/react';
import logo from '../../assets/logotitle.png';

import { FiMoon, FiSun } from 'react-icons/fi';
import { useColorMode } from '../../theme/color-mode';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from "react-router-dom";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();


  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.dir = lang === "ar" ? "rtl" : "ltr";
  };
  return (
    <Box
      bg={"rgb(20, 4, 2)"}
      px={{ base: "4", md: "7" }}
      mx={{ base: 4, md: 20 }}
      borderRadius={20}
      mt={0}
      height={"70px"}
    >
      <Flex h="70px" alignItems="center" justifyContent={"space-between"}>
        {/* left : logo (lift aligned) */}
        <Box
          alignItems={"center"}
          flex={1}
          display={"flex"}
          justifyContent={"flex-start"}
        >
          <Image
            src={logo}
            alt={t("navbar.logoAlt")}
            height={{ base: "25px", md: "40px" }}
          />
        </Box>

        {/* middle : nav links (centered) */}
        <Box
          flex={1}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            <Link
              as={RouterLink}
              to="/home"
              px={3}
              py={1}
              fontSize={"lg"}
              color={"white"}
              _hover={{
                bg: "rgb(43, 28, 26)",
                textDecoration: "none",
                borderRadius: "md",
              }}
            >
              {t("navbar.home")}
            </Link>
            <Link
              href='#features'
              px={3}
              py={1}
              fontSize={"lg"}
              color={"white"}
              _hover={{
                bg: "rgb(43, 28, 26)",
                textDecoration: "none",
                borderRadius: "md",
              }}
            >
              {t("navbar.features")}
            </Link>
            <Link
              href='#reviews'
              px={3}
              py={1}
              fontSize={"lg"}
              color={"white"}
              _hover={{
                bg: "rgb(43, 28, 26)",
                textDecoration: "none",
                borderRadius: "md",
              }}
            >
              {t("navbar.reviews")}
            </Link>

              <Link
              href='#menu'
              px={3}
              py={1}
              fontSize={"lg"}
              color={"white"}
              _hover={{
                bg: "rgb(43, 28, 26)",
                textDecoration: "none",
                borderRadius: "md",
              }}
            >
             Menu
            </Link>
          </HStack>
        </Box>

        {/* right : toggle button (right aligned) */}
        <Box flex={1} display={"flex"} justifyContent={"flex-end"}>
          {/* ---------------------------------------------------------- */}
          {/* test language */}
          {/* <button
            onClick={() => changeLanguage("en")}
            style={{
              backgroundColor: "#fff",
              color: "#3b82f6",
              border: "none",
              padding: "2px 2px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#e0e7ff")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
          >
            English
          </button>

          <button
            onClick={() => changeLanguage("ar")}
            style={{
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "2px solid #fff",
              padding: "1px 2px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            عربي
          </button> */}



          {/* theme toggle for dark and light modes */}

          <IconButton
            aria-label="Toggle Menu"
            as={colorMode === "light" ? FiMoon : FiSun}
            display="inline-flex"
            ml={2}
            onClick={toggleColorMode}
            borderRadius="40%"
            color={"white"}
            bg="rgb(43, 28, 26)"
            p={"10px"}
          />
          {/* ---------------------------------------------------------- */}

          {/* Mobile Menu Toggle */}
          <IconButton
            aria-label="Toggle Menu"
            as={isOpen ? FiX : FiMenu}
            display={{ base: "inline-flex", md: "none" }}
            ml={2}
            onClick={toggleMenu}
            borderRadius="40%"
            color={"white"}
            bg="rgb(43, 28, 26)"
            p={"5px"}
          />
        </Box>
      </Flex>

      {/* Mobile Menu */}
      {isOpen && (
        <Box
          display={{ base: "block", md: "none" }}
          mt={7}
          bg={"rgb(20, 4, 2)"}
          borderRadius={10}
          p={4}
          shadow="md"
          position="absolute"
          left="50%"
          transform="translateX(-50%)"
          top="70px"
          zIndex={9}
          width={{ base: "90%", sm: "80%" }}
        >
          <VStack spacing={3} align="center">
            <Link
              px={3}
              py={1}
              href={"#features"}
              fontSize={"lg"}
              color={"white"}
              _hover={{ textDecoration: "none", color: "gray.300" }}
              onClick={() => setIsOpen(false)}
            >
              {t("navbar.home")}
            </Link>
            <Link
              px={3}
              py={1}
              href={"#aboutus"}
              fontSize={"lg"}
              color={"white"}
              _hover={{ textDecoration: "none", color: "gray.300" }}
              onClick={() => setIsOpen(false)}
            >
              {t("navbar.features")}
            </Link>
            <Link
              px={3}
              py={1}
              href={"#contactus"}
              fontSize={"lg"}
              color={"white"}
              _hover={{ textDecoration: "none", color: "gray.300" }}
              onClick={() => setIsOpen(false)}
            >
              {t("navbar.reviews")}
            </Link>
            
             <Link
              px={3}
              py={1}
              href={"#menu"}
              fontSize={"lg"}
              color={"white"}
              _hover={{ textDecoration: "none", color: "gray.300" }}
              onClick={() => setIsOpen(false)}
            >
             Menu
            </Link>


          </VStack>
        </Box>
      )}
    </Box>
  );
}
