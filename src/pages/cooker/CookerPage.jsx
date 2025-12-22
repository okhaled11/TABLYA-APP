import { Outlet } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import Footer from "../../shared/Footer";
import { Container } from "@chakra-ui/react";
import CookerTabs from "../../components/cooker/CookerTabs";
import ChatSupport from "../../shared/ChatSupport";

const CookerPage = () => {
  return (
    <>
      <Navbar />
      <Container maxW="container.md" mx="auto" py={4}>
        <CookerTabs />
        <Outlet />
      </Container>
      <ChatSupport />
      <Footer />
    </>
  );
};

export default CookerPage;
