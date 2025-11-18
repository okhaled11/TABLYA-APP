import React from "react";
import DeliveryStatistics from "../../components/delivery/DeliveryStatistics";
import Navbar from "../../layout/Navbar";
import DeliveryTabs from "../../components/delivery/DeliveryTabs";
import { Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Footer from "../../shared/Footer";

const DeliveryPage = () => {
  return (
    <>
      <Navbar />
      <Container maxW="container.md" mx="auto" py={4}>
        <DeliveryTabs />
        <Outlet />
      </Container>
      <Footer />
    </>
  );
};

export default DeliveryPage;
