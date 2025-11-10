import ellipse404 from "../../src/assets/not-found/Ellipse404.webp";
import img404 from "../../src/assets/not-found/img404.webp";
import { Box, Flex, Image, Text, Button, HStack } from "@chakra-ui/react";
import { useColorMode } from "../theme/color-mode";
import colors from "../theme/color";
import { useNavigate } from "react-router-dom";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

const PageNotFound = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      minH="100vh"
      bg={colorMode === "light" ? colors.light.bgMain : colors.dark.bgMain}
      px={4}
      textAlign="center"
      position="relative"
      overflow="hidden"
    >
      <Image
        src={ellipse404}
        alt="ellipse background"
        position="absolute"
        top="12%"
        left="50%"
        transform="translateX(-50%)"
        maxW={["300px", "420px", "520px"]}
        w="100%"
        zIndex="0"
      />

      <Image
        src={img404}
        alt="404 not found"
        objectFit="contain"
        maxW={["240px", "340px", "440px"]}
        zIndex="1"
        mb={4}
      />

      <Text
        color={
          colorMode === "light" ? colors.light.textMain : colors.dark.textMain
        }
        fontWeight="extrabold"
        fontSize={["6xl", "7xl", "8xl"]}
        lineHeight="1"
        zIndex="1"
      >
        Page Not Found
      </Text>

      <Text
        mt={2}
        color={
          colorMode === "light" ? colors.light.textMain : colors.dark.textMain
        }
        fontSize={["md", "lg", "xl"]}
        zIndex="1"
      >
        <Text as="span" fontWeight="bold">
          Oops!
        </Text>{" "}
        We can't find this page
      </Text>

      <Button
        onClick={() => navigate("/home")}
        mt={6}
        bg={
          colorMode === "light" ? colors.light.textMain : colors.dark.textMain
        }
        color={
          colorMode === "light" ? colors.light.bgMain : colors.dark.bgMain
        }
        _hover={{ bg: colorMode === "light" ? "#3a2a22" : "blue.500" }}
        size="md"
        borderRadius="12px"
        px={5}
        zIndex="1"
      >
        <MdKeyboardDoubleArrowLeft />
        Back to Home
      </Button>
    </Flex>
  );
};

export default PageNotFound;
