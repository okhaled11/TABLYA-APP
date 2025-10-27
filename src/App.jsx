import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import HomePage from "./pages/index";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./layout/Navbar";
import CookieService from "./services/cookies";
import Landing from "./pages/Landing";

function App() {
  const token = CookieService.get("jwt");
  const { i18n } = useTranslation();

  useEffect(() => {
    /* direction page  */
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/login" element={<Login isAuthenticated={token} />} />
      </Routes>
    </>
  );
}

export default App;
