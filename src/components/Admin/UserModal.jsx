import {
  Avatar,
  Badge,
  Button,
  CloseButton,
  DataList,
  Dialog,
  HStack,
  Portal,
  Textarea,
  VStack,
  Text,
} from "@chakra-ui/react";
import React from "react";

const UserModal = ({ user, isOpen, onClose, mode }) => {
  if (!user) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="lg" shadow="lg" maxW="lg">
            <Dialog.Header>
              <Dialog.Title>
                {mode === "edit"
                  ? `Edit User: ${user.name}`
                  : `User Details: ${user.name}`}
              </Dialog.Title>
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

              {mode === "edit" && (
                <Textarea
                  placeholder="Add a note or edit information"
                  mt="8"
                  minH="100px"
                />
              )}
            </Dialog.Body>

            <Dialog.Footer>
              {mode === "edit" ? (
                <Button colorScheme="green" mr="3">
                  Save Changes
                </Button>
              ) : (
                <Button onClick={onClose}>Close</Button>
              )}
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

export default UserModal;
