import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Navbar from "./layout/Navbar";
import CookieService from "./services/cookies";

function App() {
  const token = CookieService.get("jwt");

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login isAuthenticated={token} />} />
        <Route path="/signup" element={<SignUp isAuthenticated={token} />} />
      </Routes>
    </>
  );
}

export default App;
