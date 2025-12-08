import {
  Avatar,
  Badge,
  Button,
  CloseButton,
  DataList,
  Dialog,
  Portal,
  Tooltip as ChakraTooltip,
} from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";

import React from "react";

const UserInfoModal = ({ user, isOpen, onClose }) => {
  console.log(user);
  if (!user) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="lg" shadow="lg" maxW="lg">
            <Dialog.Header>
              <Dialog.Title>User Details: {user.name}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pb="6">
              <DataList.Root orientation="horizontal">
                <DataList.Item>
                  <DataList.ItemLabel>Avatar</DataList.ItemLabel>
                  <DataList.ItemValue>
                    <Avatar.Root size="lg">
                      <Avatar.Image src={user.avatar_url} />
                      <Avatar.Fallback name={user.name} />
                    </Avatar.Root>
                  </DataList.ItemValue>
                </DataList.Item>

                <DataList.Item>
                  <DataList.ItemLabel>Name</DataList.ItemLabel>
                  <DataList.ItemValue>{user.name}</DataList.ItemValue>
                </DataList.Item>

                <DataList.Item>
                  <DataList.ItemLabel>Email</DataList.ItemLabel>
                  <DataList.ItemValue>{user.email}</DataList.ItemValue>
                </DataList.Item>

                <DataList.Item>
                  <DataList.ItemLabel>Role</DataList.ItemLabel>
                  <DataList.ItemValue>
                    <Badge
                      colorPalette={
                        user.role === "customer"
                          ? "orange"
                          : user.role === "cooker"
                          ? "green"
                          : "blue"
                      }
                    >
                      {user.role}
                    </Badge>
                  </DataList.ItemValue>
                </DataList.Item>

                {/* <DataList.Item>
                  <DataList.ItemLabel>Phone</DataList.ItemLabel>
                  <DataList.ItemValue>{user.phone}</DataList.ItemValue>
                </DataList.Item> */}

                <DataList.Item>
                  <DataList.ItemLabel>Phone</DataList.ItemLabel>
                  <DataList.ItemValue
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ marginRight: "8px" }}>{user.phone}</span>
                    {user.role === "delivery" && user.phone && (
                      <a
                        href={`https://wa.me/${user.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Chat on WhatsApp"
                        style={{ color: "#25D366" }}
                      >
                        <FaWhatsapp size={30} />
                      </a>
                    )}
                  </DataList.ItemValue>
                </DataList.Item>

                <DataList.Item>
                  <DataList.ItemLabel>Registered</DataList.ItemLabel>
                  <DataList.ItemValue>
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }).format(new Date(user.created_at))}
                  </DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>
            </Dialog.Body>

            <Dialog.Footer>
              <Button onClick={onClose}>Close</Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" position="absolute" top="3" right="3" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default UserInfoModal;
