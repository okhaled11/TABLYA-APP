import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CookieService from "../services/cookies";
import { supabase } from "../services/supabaseClient";
import { toaster } from "../components/ui/toaster";

// Guards any nested routes. Public routes should not be nested under this.
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const reduxUserId = useSelector((s) => s.auth?.userData?.user?.id);
  const cookieToken = CookieService.get("access_token");
  const isAuthed = Boolean(reduxUserId || cookieToken);

  // Real-time listener for account suspension
  useEffect(() => {
    if (!reduxUserId) return;


    const channel = supabase
      .channel(`user-status-${reduxUserId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${reduxUserId}`,
        },
        async (payload) => {

          // Check if is_active changed to false
          if (payload.new?.is_active === false) {
            // Sign out the user
            await supabase.auth.signOut();

            // Clear cookie
            CookieService.remove("access_token");

            // Show notification
            toaster.create({
              title: "Account Suspended",
              description: "Your account has been suspended. Please contact support.",
              type: "error",
              duration: 5000,
            });

            // Redirect to suspended page
            navigate("/account-suspended", { replace: true });
          }
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [reduxUserId, navigate]);

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Support both wrapper usage and as a Route element with Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
