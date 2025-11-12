import CustomerLayout from "../../layout/CustomerLayout";
import { useGetUserDataQuery } from "../../app/features/Auth/authSlice";
import CookieService from "../../services/cookies";
import PersonalInfoTab from "../../components/customer/PersonalInfoTab";
import SecurityTab from "../../components/customer/SecurityTab";
import AddressTab from "../../components/customer/AddressTab";

export default function PersonalInfo() {
  const token = CookieService.get("access_token");
  const { data: user } = useGetUserDataQuery(undefined, {
    skip: !token,
  });
  const tabs = [
    <PersonalInfoTab />,
    <AddressTab />,
    <SecurityTab user={user} />,
  ];

  return <CustomerLayout tabs={tabs} />;
}
