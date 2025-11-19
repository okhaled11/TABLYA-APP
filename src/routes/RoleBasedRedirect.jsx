import { Navigate } from "react-router-dom";
import { Center, Image } from "@chakra-ui/react";
import { useGetUserDataQuery } from "../app/features/Auth/authSlice";
import CookieService from "../services/cookies";
import LoadingGif from "../assets/Transparent Version.gif";

const RoleBasedRedirect = () => {
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

  // If no user, stay on landing page
  if (!token || !user) {
    return null;
  }

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

  // Default: stay on landing page
  return null;
};

export default RoleBasedRedirect;
