import Navbar from "../layout/Navbar";
import { Container } from "@chakra-ui/react";
import CustomerTabs from "../components/customer/CustomerTabs";
import { Outlet } from "react-router-dom";
import Footer from "../shared/Footer";

const CustomerPage = () => {
  //   const { colorMode } = useColorMode();
  return (
    <>
      <Navbar />
      <Container maxW="container.md" mx="auto" py={4}>
        <CustomerTabs />
        <Outlet />
      </Container>
      <Footer />
    </>
  );
};

export default CustomerPage;
