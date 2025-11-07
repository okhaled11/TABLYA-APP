import CustomerLayout from "../../layout/CustomerLayout";
import { useGetUserDataQuery } from "../../app/features/Auth/authSlice";
import CookieService from "../../services/cookies";
import PersonalInfoTab from "../../components/customer/PersonalInfoTab";
import SecurityTab from "../../components/customer/SecurityTab";
import AddressTab from "../../components/customer/AddressTab";
import PaymentMethodsTab from "../../components/customer/PaymentMethodsTab";

export default function PersonalInfo() {
  const token = CookieService.get("access_token");
  const { data: user } = useGetUserDataQuery(undefined, {
    skip: !token,
  });
  const tabs = [
    <PersonalInfoTab user={user} />,
    <AddressTab />,
    <SecurityTab user={user} />,
    <PaymentMethodsTab />,
  ];

  return <CustomerLayout tabs={tabs} />;
}
