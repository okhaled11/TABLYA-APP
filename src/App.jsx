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
        <Route path="/home" element={<CustomerPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
