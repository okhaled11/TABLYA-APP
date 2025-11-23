import { Outlet } from "react-router-dom";
import Navbar from "../../layout/Navbar";
import Footer from "../../shared/Footer";
import { Container } from "@chakra-ui/react";
import CookerTabs from "../../components/cooker/CookerTabs";

const CookerPage = () => {
  return (
    <>
      <Navbar />
      <Container maxW="container.md" mx="auto" py={4}>
        <CookerTabs />
        <Outlet />
      </Container>
      <Footer />
    </>
  );
};

export default CookerPage;
