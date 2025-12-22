import Navbar from "../layout/Navbar";
import { Container } from "@chakra-ui/react";
import CustomerTabs from "../components/customer/CustomerTabs";
import { Outlet } from "react-router-dom";
import Footer from "../shared/Footer";
import ChatSupport from "../shared/ChatSupport";

const CustomerPage = () => {
  //   const { colorMode } = useColorMode();
  return (
    <>
      <Navbar />
      <Container maxW="container.md" mx="auto" py={4}>
        <CustomerTabs />
        <Outlet />
      </Container>
      <ChatSupport />
      <Footer />
    </>
  );
};

export default CustomerPage;
