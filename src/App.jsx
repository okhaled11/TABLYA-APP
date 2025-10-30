import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import HomePage from "./pages/index";
import Login from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CookieService from "./services/cookies";
import { Toaster } from "./components/ui/toaster";
import Landing from "./pages/Landing";

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
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<HomePage />} />
        <Route
          path="/register"
          element={<RegisterPage isAuthenticated={token} />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Login />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
