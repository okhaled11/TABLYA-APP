import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import CookieService from "../services/cookies";

// Guards any nested routes. Public routes should not be nested under this.
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const reduxUserId = useSelector((s) => s.auth?.userData?.user?.id);
  const cookieToken = CookieService.get("access_token");
  const isAuthed = Boolean(reduxUserId || cookieToken);

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Support both wrapper usage and as a Route element with Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
