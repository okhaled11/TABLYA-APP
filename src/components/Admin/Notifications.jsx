
import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { FaBell, FaShoppingCart, FaCheckCircle } from "react-icons/fa";
import { Box, Menu, Portal, Badge, Button } from "@chakra-ui/react";

export default function Notifications() {
  const [unread, setUnread] = useState(true);
  const [notifications, setNotifications] = useState([]);


  //handle unread 

  const openNotification = () => {

    setUnread(false);
    localStorage.setItem("unread", "false");

  }
  // handle remove notification 

  const handleremove = (id) => {

    setNotifications((prev) => prev.filter(n => n.id !== id));

  }


  //get notification from local storage 
  useEffect(() => {
    const saved = localStorage.getItem("notifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    }

    const savedUnread = localStorage.getItem("unread");
    if (savedUnread === "false") {
      setUnread(false);
    }
  }, []);

  // save notification in local storage 
  const addNotification = (notification) => {
    setNotifications((prev) => {
      const updated = [notification, ...prev];
      localStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });
  };

  //handle orders table 
  useEffect(() => {
    const ordersSub = supabase
      .channel("orders-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const notif = {
            type: "order",
            data: payload.new,
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          addNotification(notif);
        }
      )
      .subscribe();


    //handle cookers approvals table
    const approvalsSub = supabase
      .channel("approvals-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "cooker_approvals" },
        (payload) => {
          const notif = {
            type: "approval",
            data: payload.new,
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          addNotification(notif);
        }
      )
      .subscribe();
    //clean up 
    return () => {
      supabase.removeChannel(ordersSub);
      supabase.removeChannel(approvalsSub);
    };
  }, []);

  return (
    <Box>
      <Menu.Root onOpenChange={openNotification}>
        <Menu.Trigger asChild>
          <Button variant="ghost" position="relative" bg="transparent"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            _focus={{ bg: "transparent", boxShadow: "none" }}
            outline="none"
            p={0}>

            <FaBell size={20} color="white" />

            {notifications.length > 0 && unread && (
              <Badge
                position="absolute"
                top="-1"
                right="-1"
                borderRadius="full"
                bg="red.500"
                color="white"
                fontSize="0.7em"
                px={2}
                minW="20px"
                h="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {notifications.length}
              </Badge>
            )}
          </Button>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content
              bg="white"
              borderRadius="md"
              boxShadow="lg"
              p={2}
              minW="300px"
              maxH="400px"
              overflowY="auto"
            >
              {notifications.length === 0 ? (
                <Box p={4} textAlign="center" color="gray.500">
                  No notifications
                </Box>
              ) : (
                notifications.map((n, i) => (
                  <Menu.Item
                    key={i}
                    p={3}
                    borderRadius="md"
                    _hover={{ bg: "gray.50" }}
                    cursor="pointer"
                  >
                    <Box display="flex" alignItems="start" gap={3}>
                      <Box
                        mt={1}
                        color={n.type === "order" ? "blue.500" : "green.500"}
                      >
                        {n.type === "order" ? (
                          <FaShoppingCart size={20} />
                        ) : (
                          <FaCheckCircle size={20} />
                        )}
                      </Box>

                      <Box flex={1}>
                        <Box fontWeight="600" fontSize="sm" color="gray.800" mb={1}>
                          {n.type === "order" ? "New Order" : "New Chef Request"}
                        </Box>

                        <Box fontSize="sm" color="gray.600">
                          {n.type === "order" ? (
                            "A new order has been created"
                          ) : (
                            <>
                              <b>{n.data.name}</b> sent a request to join chefs
                            </>
                          )}
                          {/* remove btn */}
                          <Button outline="none" bg="transparent"
                            _hover={{ bg: "transparent" }}
                            _active={{ bg: "transparent" }}
                            _focus={{ bg: "transparent", boxShadow: "none" }} variant={"none"} color={"red"} mx={"5px"} onClick={() => handleremove(n.id)} fontSize={"20px"}  >✕</Button>
                        </Box>

                        <Box fontSize="xs" color="gray.400" mt={1}>
                          {n.timestamp}
                        </Box>
                      </Box>
                    </Box>
                  </Menu.Item>
                ))
              )}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Box>
  );
}
