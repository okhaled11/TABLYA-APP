import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import Login from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CookieService from "./services/cookies";
import { Toaster } from "./components/ui/toaster";
import Landing from "./pages/Landing";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import CustomerPage from "./pages/CustomerPage";
import SidebarLayout from "./components/Admin/SidebarLayout";
import ChefVerification from "./pages/AdminPages/ChefVerification";
import Analytics from "./pages/AdminPages/Analytics";
import Dashboard from "./pages/AdminPages/Dashboard";
import Deliveries from "./pages/AdminPages/Deliveries";
import Complaints from "./pages/AdminPages/Complaints";
import UserManagement from "./pages/AdminPages/UserManagement";
import AllCookers from "./pages/customer/home/AllCookers";
import ChefMenuProfile from "./pages/customer/home/ChefMenuProfile";
import CustomerHome from "./pages/customer/home/CustomerHome";
import OrderPage from "./pages/customer/OrderPage";
import OrderDetails from "./pages/customer/OrderDetails";
import CustomerFavourite from "./pages/customer/CustomerFavourite";
import MealDetails from "./pages/customer/home/MealDetails";

function App() {
  const token = CookieService.get("access_token");
  const { i18n } = useTranslation();

  useEffect(() => {
    /* direction page  */
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login isAuthenticated={token} />} />
        <Route
          path="/register"
          element={<RegisterPage isAuthenticated={token} />}
        />
        <Route path="/pending-approval" element={<PendingApprovalPage />} />
        {/* customer Routes */}
        <Route path="/home" element={<CustomerPage />}>
          {<Route index element={<CustomerHome />} />}
          <Route path="cookers" element={<AllCookers />} />
          <Route path="cookers/:id" element={<ChefMenuProfile />} />
          <Route path="cookers/:chefId/meals/:mealId" element={<MealDetails  />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="details" element={<OrderDetails />} />
          <Route path="favourities" element={<CustomerFavourite />} />
        </Route>
        {/* Admin Routes */}
        <Route path="/admin" element={<SidebarLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="chef-verification" element={<ChefVerification />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="deliveries" element={<Deliveries />} />
          <Route path="complaints" element={<Complaints />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
