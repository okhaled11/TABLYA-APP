import Navbar from "../layout/Navbar";
import { Container } from "@chakra-ui/react";
import CustomerTabs from "../components/customer/CustomerTabs";

const CustomerPage = () => {
  //   const { colorMode } = useColorMode();
  return (
    <>
      <Navbar />
      <Container maxW="container.md" mx="auto" py={4}>
        <CustomerTabs />
      </Container>
    </>
  );
};

export default CustomerPage;
