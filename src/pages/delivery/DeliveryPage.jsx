import React, { useEffect } from "react";
import DeliveryStatistics from "../../components/delivery/DeliveryStatistics";
import Navbar from "../../layout/Navbar";
import DeliveryTabs from "../../components/delivery/DeliveryTabs";
import { Container } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../../shared/Footer";
import CookieService from "../../services/cookies";
import { useGetUserDataQuery } from "../../app/features/Auth/authSlice";
import { useGetDeliveryByUserIdQuery } from "../../app/features/delivery/deliveryApi";

const DeliveryPage = () => {
  const token = CookieService.get("access_token");
  const { data: user } = useGetUserDataQuery(undefined, {
    skip: !token,
  });
  const navigate = useNavigate();

  const { data: deliveryData, isLoading: deliveryLoading } =
    useGetDeliveryByUserIdQuery(user?.id, {
      skip: !user?.id || user?.role !== "delivery",
    });

  useEffect(() => {
    if (user?.role !== "delivery") return;
    if (deliveryLoading) return;

    if (!deliveryData?.city) {
      navigate("/personal-info/address", { replace: true });
    }
  }, [user, deliveryLoading, deliveryData, navigate]);
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
