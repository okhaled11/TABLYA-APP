import { Navigate, Outlet } from "react-router-dom";
import { Center, Image } from "@chakra-ui/react";
import { useGetUserDataQuery } from "../app/features/Auth/authSlice";
import CookieService from "../services/cookies";
import LoadingGif from "../assets/Transparent Version.gif";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const token = CookieService.get("access_token");
  const { data: user, isLoading } = useGetUserDataQuery(undefined, {
    skip: !token,
  });

  // If still loading, show loading spinner
  if (isLoading) {
    return (
      <Center h="100vh" w="100vw">
        <Image src={LoadingGif} alt="Loading..." w="200px" h="200px" />
      </Center>
    );
  }

  // If no user or no token, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in allowed roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === "customer") {
      return <Navigate to="/home" replace />;
    } else if (user.role === "cooker") {
      return <Navigate to="/cooker" replace />;
    } else if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "delivery") {
      return <Navigate to="/delivery" replace />;
    }
    // Default redirect
    return <Navigate to="/" replace />;
  }

  // User has correct role, render the route
  return <Outlet />;
};

export default RoleProtectedRoute;
