import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import HomePage from "./pages/index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Navbar from "./layout/Navbar";
import CookieService from "./services/cookies";
import AddUserForm from "./components/ui/AddUserForm"; // test
import UsersList from "./components/ui/UsersList"; // test

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
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login isAuthenticated={token} />} />
        <Route path="/signup" element={<SignUp isAuthenticated={token} />} />
      </Routes>
      <AddUserForm />
      <hr />
      <UsersList />
      <hr />
    </>
  );
}

export default App;
