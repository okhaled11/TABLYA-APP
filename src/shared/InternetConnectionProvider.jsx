import React, { useEffect, useRef, useState } from "react";
import { BsWifiOff } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { networkMode } from "../app/features/networkSlice";
import { toaster } from "../components/ui/toaster";

const InternetConnectionProvider = ({ children }) => {
  const toastIdRef = useRef();
  const [isOnline, setIsOnline] = useState(true);
  const dispatch = useDispatch();

  function closeToast() {
      toaster.remove(toastIdRef.current);

  }

  function showOfflineToast() {
      toastIdRef.current = toaster.create({
        title: "No Internet Connection",
        description: "You are currently offline. Please check your connection.",
        type: "warning",
        position: "top",
      });

  }

  const setOnlineHandler = () => {
    dispatch(networkMode(true));
    setIsOnline(true);
    closeToast();
    
    // Show success toast when back online
    toaster.create({
      title: "Connection Restored",
      description: "You are back online!",
      type: "success",
      duration: 3000,
      position: "top",
    });
  };

  const setOfflineHandler = () => {
    dispatch(networkMode(false));
    setIsOnline(false);
    showOfflineToast();
  };

  useEffect(() => {
    window.addEventListener("online", setOnlineHandler);
    window.addEventListener("offline", setOfflineHandler);

    return () => {
      window.removeEventListener("online", setOnlineHandler);
      window.removeEventListener("offline", setOfflineHandler);
    };
  }, []);

    if (!isOnline) {
      return <>{children}</>;
    }

    return children;
};

export default InternetConnectionProvider;
