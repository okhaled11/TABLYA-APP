import { Box, Flex, VStack, Text, HStack, Icon } from "@chakra-ui/react";
import { useColorMode } from "../theme/color-mode";
import colors from "../theme/color";
import Navbar from "./Navbar";
import { useState, useRef, useEffect } from "react";
import { User, MapPin, Lock, ArrowLeft, Warning } from "@phosphor-icons/react";
import Footer from "../shared/Footer";
import { useLocation, useNavigate } from "react-router-dom";

export default function CustomerLayout({ tabs, lockToAddressTab = false }) {
  const { colorMode } = useColorMode();
  const [activeTab, setActiveTab] = useState(lockToAddressTab ? 1 : 0);
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const menuItems = [
    {
      title: "Personal Info",
      icon: User,
    },
    {
      title: "Address",
      icon: MapPin,
    },
    {
      title: "Security",
      icon: Lock,
    },
    {
      title: "Report System",
      icon: Warning,
    },
  ];

  // Map URL segment to tab index and vice versa
  const segments = ["", "address", "security", "report"]; // '' => personal-info root

  // Sync active tab when URL changes, but keep it locked on Address when required
  useEffect(() => {
    // Expecting path like /personal-info or /personal-info/<segment>
    const parts = location.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("personal-info");
    const seg = idx >= 0 ? parts[idx + 1] || "" : "";
    let newIndex = Math.max(0, segments.indexOf(seg));

    if (lockToAddressTab) {
      newIndex = 1; // Force Address tab
    }

    if (newIndex !== activeTab) setActiveTab(newIndex);
  }, [location.pathname, lockToAddressTab]);

  const goToTab = (index) => {
    if (lockToAddressTab && index !== 1) return;
    const seg = segments[index];
    const to = seg ? `/personal-info/${seg}` : "/personal-info";
    navigate(to);
  };

  return (
    <>
      <Navbar />
      <Box px={{ base: 4, md: 8 }} py={8} maxW="1600px" mx="auto">
        {/* Header with Back Button */}
        <HStack mb={6} spacing={3}>
          <Icon
            as={ArrowLeft}
            boxSize={6}
            color={
              colorMode === "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
            cursor="pointer"
            onClick={() => {
              if (lockToAddressTab) return;
              navigate(-1);
            }}
            _hover={{
              color:
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed,
            }}
            transition="all 0.2s"
          />
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={
              colorMode === "light"
                ? colors.light.textMain
                : colors.dark.textMain
            }
          >
            {menuItems[activeTab].title}
          </Text>
        </HStack>

        <Box
          ref={sliderRef}
          display={{ base: "block", md: "none" }}
          mb={6}
          overflowX="auto"
          cursor={isDragging ? "grabbing" : "grab"}
          userSelect="none"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          css={{
            "&::-webkit-scrollbar": {
              height: "4px",
            },
            "&::-webkit-scrollbar-track": {
              background:
                colorMode === "light"
                  ? colors.light.bgFourth
                  : colors.dark.bgFourth,
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background:
                colorMode === "light"
                  ? colors.light.mainFixed
                  : colors.dark.mainFixed,
              borderRadius: "10px",
            },
          }}
        >
          <HStack spacing={3} pb={2} minW="max-content">
            {menuItems.map((item, index) => {
              const isActive = activeTab === index;
              return (
                <Box
                  key={index}
                  px={4}
                  py={3}
                  borderRadius="12px"
                  bg={
                    isActive
                      ? colorMode === "light"
                        ? colors.light.mainFixed
                        : colors.dark.mainFixed
                      : colorMode === "light"
                      ? colors.light.bgThird
                      : colors.dark.bgThird
                  }
                  cursor="pointer"
                  onClick={() => goToTab(index)}
                  transition="all 0.2s"
                  _hover={{
                    bg: isActive
                      ? colorMode === "light"
                        ? colors.light.mainFixed70a
                        : colors.dark.mainFixed70a
                      : colorMode === "light"
                      ? colors.light.mainFixed10a
                      : colors.dark.mainFixed10a,
                  }}
                  whiteSpace="nowrap"
                >
                  <HStack spacing={2}>
                    <Icon
                      as={item.icon}
                      boxSize={4}
                      color={
                        isActive
                          ? colorMode === "light"
                            ? colors.light.white
                            : colors.dark.white
                          : colorMode === "light"
                          ? colors.light.textMain
                          : colors.dark.textMain
                      }
                    />
                    <Text
                      color={
                        isActive
                          ? colorMode === "light"
                            ? colors.light.white
                            : colors.dark.white
                          : colorMode === "light"
                          ? colors.light.textMain
                          : colors.dark.textMain
                      }
                      fontWeight={isActive ? "bold" : "normal"}
                      fontSize="sm"
                    >
                      {item.title}
                    </Text>
                  </HStack>
                </Box>
              );
            })}
          </HStack>
        </Box>

        <Flex gap={6} direction={{ base: "column", md: "row" }}>
          <Box
            w={{ base: "100%", md: "33.33%" }}
            bg={
              colorMode === "light" ? colors.light.bgThird : colors.dark.bgThird
            }
            borderRadius="25px"
            p={6}
            h="fit-content"
            position="sticky"
            top="100px"
            display={{ base: "none", md: "block" }}
          >
            <VStack spacing={2} align="stretch">
              {menuItems.map((item, index) => {
                const isActive = activeTab === index;
                return (
                  <Box
                    key={index}
                    p={4}
                    borderRadius="0"
                    bg={
                      isActive
                        ? colorMode === "light"
                          ? colors.light.mainFixed10a
                          : colors.dark.mainFixed10a
                        : colorMode === "light"
                        ? colors.light.bgThird
                        : colors.dark.bgThird
                    }
                    borderLeft={
                      isActive
                        ? `4px solid ${
                            colorMode === "light"
                              ? colors.light.mainFixed
                              : colors.dark.mainFixed
                          }`
                        : "4px solid transparent"
                    }
                    _hover={{
                      bg:
                        colorMode === "light"
                          ? colors.light.mainFixed10a
                          : colors.dark.mainFixed10a,
                      cursor: "pointer",
                    }}
                    transition="all 0.2s"
                    onClick={() => goToTab(index)}
                  >
                    <HStack spacing={3}>
                      <Icon
                        as={item.icon}
                        boxSize={5}
                        color={
                          isActive
                            ? colorMode === "light"
                              ? colors.light.mainFixed
                              : colors.dark.mainFixed
                            : colorMode === "light"
                            ? colors.light.textMain
                            : colors.dark.textMain
                        }
                      />
                      <Text
                        color={
                          isActive
                            ? colorMode === "light"
                              ? colors.light.mainFixed
                              : colors.dark.mainFixed
                            : colorMode === "light"
                            ? colors.light.textMain
                            : colors.dark.textMain
                        }
                        fontWeight={isActive ? "bold" : "normal"}
                      >
                        {item.title}
                      </Text>
                    </HStack>
                  </Box>
                );
              })}
            </VStack>
          </Box>

          {/* Content - 2/3 */}
          <Box w={{ base: "100%", md: "66.67%" }}>{tabs[activeTab]}</Box>
        </Flex>
      </Box>
      <Footer />
    </>
  );
}
