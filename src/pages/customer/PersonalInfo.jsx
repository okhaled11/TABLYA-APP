import CustomerLayout from "../../layout/CustomerLayout";
import { useGetUserDataQuery } from "../../app/features/Auth/authSlice";
import CookieService from "../../services/cookies";
import PersonalInfoTab from "../../components/customer/PersonalInfoTab";
import SecurityTab from "../../components/customer/SecurityTab";
import AddressTab from "../../components/customer/AddressTab";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetDeliveryByUserIdQuery } from "../../app/features/delivery/deliveryApi";

export default function PersonalInfo() {
  const token = CookieService.get("access_token");
  const { data: user } = useGetUserDataQuery(undefined, {
    skip: !token,
  });
  const navigate = useNavigate();
  const location = useLocation();

  const { data: deliveryData, isLoading: deliveryLoading } =
    useGetDeliveryByUserIdQuery(user?.id, {
      skip: !user?.id || user?.role !== "delivery",
    });

  const lockToAddressTab =
    user?.role === "delivery" && !deliveryLoading && !deliveryData?.city;

  useEffect(() => {
    if (!lockToAddressTab) return;

    const parts = location.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("personal-info");
    const seg = idx >= 0 ? parts[idx + 1] || "" : "";

    if (seg !== "address") {
      navigate("/personal-info/address", { replace: true });
    }
  }, [lockToAddressTab, location.pathname, navigate]);

  const tabs = [
    <PersonalInfoTab />,
    <AddressTab />,
    <SecurityTab user={user} />,
  ];

  return <CustomerLayout tabs={tabs} lockToAddressTab={lockToAddressTab} />;
}
