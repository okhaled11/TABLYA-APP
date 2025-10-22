import { Box, Flex, Text } from "@chakra-ui/react";
import CookieService from "../services/cookies";

const HomePage = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      px={{ base: 4, md: 10, lg: 20 }} 
      py={{ base: 8, md: 16 }}
      minH="80vh"
      textAlign="center"
      gap={6}
    >
      <Text
        fontSize={{ base: "md", md: "lg", lg: "xl" }} 
        fontWeight="bold"
        maxW={{ base: "90%", md: "80%", lg: "60%" }} 
        lineHeight="1.8"
      >
        مرحبا بك في{" "}
        <Text as="h1" color="red.400" fontWeight="extrabold">
          طبلية
        </Text>
        ، المنصة التي تسهل عليك إدارة وصفاتك المفضلة ومشاركتها مع الآخرين. اكتشف
        وصفات جديدة، احفظها في مكتبتك الشخصية، ونظّمها بكل سهولة. ابدأ رحلتك في
        عالم الطهي معنا اليوم!
      </Text>
    </Flex>
  );
};

export default HomePage;
